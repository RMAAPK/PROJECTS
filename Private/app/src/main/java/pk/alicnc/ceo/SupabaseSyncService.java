package pk.alicnc.ceo;

import android.content.Context;
import org.json.JSONArray;
import org.json.JSONObject;
import pk.alicnc.ceo.db.PAIDatabaseHelper;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Direct Two-Way Supabase Engine
 * Reads remote master dossier from Supabase first on boot,
 * and writes chat telemetry / memory updates directly to Supabase storage.
 * Zero backend server required.
 */
public class SupabaseSyncService {

    private static final ExecutorService executor = Executors.newSingleThreadExecutor();

    public interface SyncCallback {
        void onSyncComplete(boolean success, String message);
    }

    /**
     * Read from Supabase FIRST using native PostgREST (/rest/v1/memories)
     * with zero third-party libraries (using Android's native OkHttp engine).
     * Automatically falls back to /storage/v1/ if tables are still syncing.
     */
    public static void syncFromSupabase(final Context context, final SyncCallback callback) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                String supabaseUrl = EncryptedVault.getSupabaseUrl();
                String secretKey = EncryptedVault.getSupabaseSecret();
                PAIDatabaseHelper db = PAIDatabaseHelper.getInstance(context);

                // 1. Attempt PostgREST /rest/v1/memories query first
                try {
                    URL postgrestUrl = new URL(supabaseUrl + "/rest/v1/memories?select=*&order=created_at.desc");
                    HttpURLConnection conn = (HttpURLConnection) postgrestUrl.openConnection();
                    conn.setRequestMethod("GET");
                    conn.setRequestProperty("apikey", secretKey);
                    conn.setRequestProperty("Authorization", "Bearer " + secretKey);
                    conn.setRequestProperty("Accept", "application/json");
                    conn.setConnectTimeout(5000);
                    conn.setReadTimeout(5000);

                    int code = conn.getResponseCode();
                    if (code == 200) {
                        BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
                        StringBuilder sb = new StringBuilder();
                        String line;
                        while ((line = reader.readLine()) != null) sb.append(line);
                        reader.close();
                        conn.disconnect();

                        JSONArray arr = new JSONArray(sb.toString());
                        for (int i = 0; i < arr.length(); i++) {
                            JSONObject obj = arr.getJSONObject(i);
                            String key = obj.optString("sneak_key", "MEM_" + i);
                            String cat = obj.optString("category", "general");
                            String title = obj.optString("title", key);
                            String content = obj.optString("content", "");
                            db.upsertMemory(key, cat, title, content);
                        }

                        if (callback != null) {
                            callback.onSyncComplete(true, "PostgREST Synced: " + arr.length() + " memories");
                        }
                        return;
                    }
                    conn.disconnect();
                } catch (Exception ignored) {
                    // Fall back to storage dossier if PostgREST table is not yet generated
                }

                // 2. Storage Fallback: Download master dossier from pai-vault/ali_cnc_master_dossier.json
                try {
                    URL url = new URL(supabaseUrl + "/storage/v1/object/pai-vault/ali_cnc_master_dossier.json");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("GET");
                    conn.setRequestProperty("apikey", secretKey);
                    conn.setRequestProperty("Authorization", "Bearer " + secretKey);
                    conn.setConnectTimeout(8000);
                    conn.setReadTimeout(8000);

                    int code = conn.getResponseCode();
                    if (code == 200) {
                        BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
                        StringBuilder sb = new StringBuilder();
                        String line;
                        while ((line = reader.readLine()) != null) sb.append(line);
                        reader.close();

                        JSONObject json = new JSONObject(sb.toString());
                        int nodeCount = 0;

                        if (json.has("memories")) {
                            JSONArray memArr = json.getJSONArray("memories");
                            for (int i = 0; i < memArr.length(); i++) {
                                JSONObject m = memArr.getJSONObject(i);
                                String key = m.optString("key", "MEM_" + i);
                                String cat = m.optString("category", "general");
                                String title = m.optString("title", key);
                                String content = m.optString("content", "");
                                db.upsertMemory(key, cat, title, content);
                                nodeCount++;
                            }
                        }

                        Iterator<String> keys = json.keys();
                        while (keys.hasNext()) {
                            String k = keys.next();
                            if (!k.equals("memories")) {
                                Object val = json.get(k);
                                db.upsertMemory(k.toUpperCase(), "dossier", "Supabase Dossier: " + k, val.toString());
                                nodeCount++;
                            }
                        }

                        if (callback != null) {
                            callback.onSyncComplete(true, "Supabase Synced: " + nodeCount + " nodes");
                        }
                    } else {
                        if (callback != null) {
                            callback.onSyncComplete(false, "Supabase HTTP " + code);
                        }
                    }
                    conn.disconnect();
                } catch (Exception e) {
                    if (callback != null) {
                        callback.onSyncComplete(false, "Offline / Local Mode: " + e.getMessage());
                    }
                }
            }
        });
    }

    /**
     * Write to Supabase using pure PostgREST (/rest/v1/chat_sessions) and Storage backup
     */
    public static void syncChat(final String role, final String message) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                String supabaseUrl = EncryptedVault.getSupabaseUrl();
                String secretKey = EncryptedVault.getSupabaseSecret();

                // 1. Direct PostgREST POST to /rest/v1/chat_sessions
                try {
                    URL postgrestUrl = new URL(supabaseUrl + "/rest/v1/chat_sessions");
                    HttpURLConnection conn = (HttpURLConnection) postgrestUrl.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("apikey", secretKey);
                    conn.setRequestProperty("Authorization", "Bearer " + secretKey);
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setRequestProperty("Prefer", "return=minimal");
                    conn.setDoOutput(true);
                    conn.setConnectTimeout(4000);
                    conn.setReadTimeout(4000);

                    JSONObject body = new JSONObject();
                    body.put("session_id", "poco_c85_session");
                    body.put("role", role);
                    body.put("content", message);

                    try (OutputStream os = conn.getOutputStream()) {
                        os.write(body.toString().getBytes(StandardCharsets.UTF_8));
                    }
                    conn.getResponseCode();
                    conn.disconnect();
                } catch (Exception ignored) {}

                // 2. Storage event backup to /storage/v1/object/pai-vault/
                try {
                    String filename = "chat_event_" + System.currentTimeMillis() + "_" + role + ".json";
                    URL url = new URL(supabaseUrl + "/storage/v1/object/pai-vault/" + filename);
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("apikey", secretKey);
                    conn.setRequestProperty("Authorization", "Bearer " + secretKey);
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setRequestProperty("x-upsert", "true");
                    conn.setDoOutput(true);
                    conn.setConnectTimeout(4000);
                    conn.setReadTimeout(4000);

                    JSONObject payload = new JSONObject();
                    payload.put("timestamp", System.currentTimeMillis());
                    payload.put("role", role);
                    payload.put("message", message);
                    payload.put("device", "POCO C85 HyperOS 3");

                    try (OutputStream os = conn.getOutputStream()) {
                        os.write(payload.toString().getBytes(StandardCharsets.UTF_8));
                    }
                    conn.getResponseCode();
                    conn.disconnect();
                } catch (Exception ignored) {}
            }
        });
    }

    public static void logInteraction(final String role, final String text) {
        syncChat(role, text);
    }
}
