package pk.alicnc.ceo;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Replicate Client
 * Replaces Gemini completely. Executes inference via Replicate's API (Meta Llama 3 / DeepSeek)
 * with multi-token knowledge retrieval and private zero-training headers.
 */
public class ReplicateClient {

    // Default high-caliber model on Replicate
    private static final String MODEL_PREDICTION_URL = 
        "https://api.replicate.com/v1/models/meta/meta-llama-3-70b-instruct/predictions";

    private static final ExecutorService executor = Executors.newSingleThreadExecutor();

    private static final String CEO_SYSTEM_PROMPT = 
        "You are Ali CNC Private CEO AI (PAI), the private autonomous AI assistant and strategic CEO copilot " +
        "for Raja Muhammad Ali Asghar (professionally Ali CNC / Muhammad Ali), solo founder & CEO of Ali CNC (alicnc.pk, forge.alicnc.pk).\n\n" +
        "CORE FACTS & DOSSIER CONTEXT:\n" +
        "- Founder: Raja Muhammad Ali Asghar, Age 22 (born Dec 24, 2003), Rawalpindi & Sector F-11 Islamabad. INTJ (Estimated IQ 150+). " +
        "Coding since age 4, hardware assembly since age 7, professional CNC designing on Sep 7, 2025. Dual certified in CAD/CAM (TITAN-2M, TITAN-3M).\n" +
        "- Workshop & Machinery: Sector F-11 CNC workshop. Hefei Mingda 1325 (3-Axis router) running NcStudio (PCIMC-3D DB15 J1 controller, WCH CH365 PCI), Bambu Lab A1 3D printer, " +
        "custom ESP32 wireless Bluetooth pendant to Python Windows service. Materials: MDF, Lasani, HDF, HDX, super-gloss acrylic, hardwoods.\n" +
        "- People: Iftikhar Bhai (Mentor & Boss, master craftsman), Ghulam Asghar (Father, Saddar Tajran Pindora), Cousin Haseeb & Fargo (German Shepherd), " +
        "workshop crew: Muneeb, Usama, Merab, Chacha.\n" +
        "- Ventures: Forge AI (Y Combinator W27 application, <30ms acoustic tool breakage protection, ForgeAI_NcStudio_Defense.exe PageDown override), " +
        "TM-01 Trademark ALI CNC (Class 42 #890258) & AHYEON (Class 9 #890259), SVGV binary vector format (encoder.js).\n" +
        "- Personal & Cultural: Ultimate Biases: BIBI & Jung Ahyeon (BABYMONSTER). BLACKPINK, 500+ K-dramas (Itaewon Class, Queen Seondeok, Suzy, Jisoo, IU), F1.\n" +
        "- Device: POCO C85 (HyperOS, Termux, Shizuku UID 2000, KZ Castor Pro IEMs + CX31993 DAC).\n\n" +
        "TONE & DIRECTIVES:\n" +
        "1. Style: Direct, razor-sharp INTJ CEO caliber, zero fluff, extreme technical precision, witty humor.\n" +
        "2. Privacy: You are a strictly private agent. No data is shared or used to train external models.\n" +
        "3. Silent: Do not ask for voice playback; you operate in quiet mode for a quiet listener.\n" +
        "4. Loyalty: Ali is the boss. Speak with familiar respect and deep domain mastery.";

    public interface ReplicateCallback {
        void onSuccess(String responseText);
        void onError(String errorMessage);
    }

    public static void generateResponse(final String userPrompt, final ReplicateCallback callback) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    // 1. Retrieve local memory context via multi-token keyword engine
                    List<MemoryFabric.MemoryNode> memories = MemoryFabric.search(userPrompt);
                    StringBuilder contextBuilder = new StringBuilder();
                    if (!memories.isEmpty()) {
                        contextBuilder.append("\n\n[RECALLED EXECUTIVE MEMORY & DOSSIER FACTS]:\n");
                        for (MemoryFabric.MemoryNode node : memories) {
                            contextBuilder.append("• [").append(node.sneakKey).append("] ")
                                          .append(node.title).append(": ").append(node.content).append("\n");
                        }
                        contextBuilder.append("\nDirective: Ground your response strictly in the recalled facts above. Speak with domain mastery and familiar respect to Raja Muhammad Ali Asghar (Ali CNC).");
                    }

                    String augmentedPrompt = userPrompt + contextBuilder.toString();

                    // 2. Build JSON Request Payload for Replicate
                    JSONObject root = new JSONObject();
                    JSONObject input = new JSONObject();
                    input.put("prompt", augmentedPrompt);
                    input.put("system_prompt", CEO_SYSTEM_PROMPT);
                    input.put("max_new_tokens", 1024);
                    input.put("temperature", 0.7);
                    root.put("input", input);

                    // 3. Execute HTTP Call to Replicate
                    String apiToken = EncryptedVault.getReplicateApiKey();
                    URL url = new URL(MODEL_PREDICTION_URL);
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setRequestProperty("Authorization", "Bearer " + apiToken);
                    conn.setRequestProperty("Prefer", "wait=60");
                    conn.setRequestProperty("User-Agent", "PAI-CEO-Assistant/3.0");
                    conn.setDoOutput(true);
                    conn.setConnectTimeout(20000);
                    conn.setReadTimeout(65000);

                    try (OutputStream os = conn.getOutputStream()) {
                        os.write(root.toString().getBytes(StandardCharsets.UTF_8));
                    }

                    int code = conn.getResponseCode();
                    InputStream is = (code >= 200 && code < 300) ? conn.getInputStream() : conn.getErrorStream();
                    BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
                    StringBuilder responseStr = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        responseStr.append(line);
                    }
                    reader.close();
                    conn.disconnect();

                    if (code != 200 && code != 201) {
                        if (code == 402) {
                            callback.onError("Replicate Error (402): Insufficient credit on account. Please add billing credits at replicate.com/account/billing");
                        } else {
                            callback.onError("Replicate API Error (" + code + "): " + responseStr.toString());
                        }
                        return;
                    }

                    JSONObject resJson = new JSONObject(responseStr.toString());
                    String status = resJson.optString("status", "");

                    // If already completed synchronously
                    if ("succeeded".equals(status)) {
                        String reply = extractOutput(resJson);
                        callback.onSuccess(reply);
                        return;
                    }

                    // If still processing, poll prediction URL
                    JSONObject urls = resJson.optJSONObject("urls");
                    if (urls != null) {
                        String getUrl = urls.optString("get");
                        if (!getUrl.isEmpty()) {
                            String reply = pollPrediction(getUrl, apiToken);
                            if (reply != null) {
                                callback.onSuccess(reply);
                                return;
                            }
                        }
                    }

                    callback.onError("Replicate prediction did not finish: status = " + status);

                } catch (Exception e) {
                    callback.onError("Connection exception: " + e.getMessage());
                }
            }
        });
    }

    private static String extractOutput(JSONObject json) {
        Object out = json.opt("output");
        if (out instanceof JSONArray) {
            JSONArray arr = (JSONArray) out;
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < arr.length(); i++) {
                sb.append(arr.optString(i, ""));
            }
            return sb.toString().trim();
        } else if (out instanceof String) {
            return ((String) out).trim();
        }
        return "Prediction complete, no text returned.";
    }

    private static String pollPrediction(String getUrlStr, String token) {
        for (int i = 0; i < 20; i++) {
            try {
                Thread.sleep(2000);
                URL url = new URL(getUrlStr);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("User-Agent", "PAI-CEO-Assistant/3.0");
                conn.setConnectTimeout(10000);
                conn.setReadTimeout(15000);

                int code = conn.getResponseCode();
                if (code == 200) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        sb.append(line);
                    }
                    reader.close();
                    conn.disconnect();

                    JSONObject obj = new JSONObject(sb.toString());
                    String status = obj.optString("status", "");
                    if ("succeeded".equals(status)) {
                        return extractOutput(obj);
                    } else if ("failed".equals(status) || "canceled".equals(status)) {
                        return "Prediction failed: " + obj.optString("error", "Unknown error");
                    }
                } else {
                    conn.disconnect();
                }
            } catch (Exception ignored) {}
        }
        return null;
    }
}
