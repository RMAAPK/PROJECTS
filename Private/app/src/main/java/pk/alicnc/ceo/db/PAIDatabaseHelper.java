package pk.alicnc.ceo.db;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import java.util.ArrayList;
import java.util.List;
import pk.alicnc.ceo.MemoryFabric;

/**
 * High-Performance Local SQLite Database Engine
 * Houses full offline memories, conversation threads, safety ledgers, and shell execution logs.
 */
public class PAIDatabaseHelper extends SQLiteOpenHelper {

    private static final String DATABASE_NAME = "pai_ceo_vault.db";
    private static final int DATABASE_VERSION = 2;

    public static final String TABLE_MEMORIES = "memories";
    public static final String TABLE_CHAT = "chat_history";
    public static final String TABLE_LEDGER = "pending_ledger";
    public static final String TABLE_SHELL_LOGS = "shell_logs";

    private static PAIDatabaseHelper instance;

    public static synchronized PAIDatabaseHelper getInstance(Context context) {
        if (instance == null) {
            instance = new PAIDatabaseHelper(context.getApplicationContext());
        }
        return instance;
    }

    private PAIDatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        // 1. Memories Table with exact Sneak Keys & Lexical fields
        db.execSQL("CREATE TABLE " + TABLE_MEMORIES + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "sneak_key TEXT UNIQUE NOT NULL, " +
                "category TEXT NOT NULL, " +
                "title TEXT NOT NULL, " +
                "content TEXT NOT NULL, " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                ");");

        db.execSQL("CREATE INDEX idx_mem_sneak ON " + TABLE_MEMORIES + "(sneak_key);");
        db.execSQL("CREATE INDEX idx_mem_cat ON " + TABLE_MEMORIES + "(category);");

        // 2. Chat History Table
        db.execSQL("CREATE TABLE " + TABLE_CHAT + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "role TEXT NOT NULL, " +
                "message TEXT NOT NULL, " +
                "timestamp INTEGER NOT NULL" +
                ");");

        // 3. Safety Boundary Pending Ledger
        db.execSQL("CREATE TABLE " + TABLE_LEDGER + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "action_type TEXT NOT NULL, " +
                "target TEXT NOT NULL, " +
                "amount REAL, " +
                "currency TEXT DEFAULT 'PKR', " +
                "status TEXT DEFAULT 'PENDING', " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                ");");

        // 4. Real Shell Execution Logs
        db.execSQL("CREATE TABLE " + TABLE_SHELL_LOGS + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "command TEXT NOT NULL, " +
                "output TEXT, " +
                "exit_code INTEGER, " +
                "timestamp INTEGER NOT NULL" +
                ");");

        // Pre-populate with all 25 core dossier nodes
        seedMemories(db);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_MEMORIES);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_CHAT);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_LEDGER);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_SHELL_LOGS);
        onCreate(db);
    }

    private void seedMemories(SQLiteDatabase db) {
        for (MemoryFabric.MemoryNode node : MemoryFabric.getAll()) {
            insertMemory(db, node.sneakKey, node.category, node.title, node.content);
        }
    }

    private void insertMemory(SQLiteDatabase db, String sneakKey, String category, String title, String content) {
        ContentValues cv = new ContentValues();
        cv.put("sneak_key", sneakKey);
        cv.put("category", category);
        cv.put("title", title);
        cv.put("content", content);
        db.insertWithOnConflict(TABLE_MEMORIES, null, cv, SQLiteDatabase.CONFLICT_REPLACE);
    }

    public void upsertMemory(String sneakKey, String category, String title, String content) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("sneak_key", sneakKey);
        cv.put("category", category);
        cv.put("title", title);
        cv.put("content", content);
        db.insertWithOnConflict(TABLE_MEMORIES, null, cv, SQLiteDatabase.CONFLICT_REPLACE);
    }

    /**
     * Search memories with multi-token keyword relevance scoring engine
     */
    public List<String> searchMemoryContext(String query) {
        List<String> results = new ArrayList<>();
        if (query == null || query.trim().isEmpty()) return results;

        // 1. Primary: MemoryFabric multi-token relevance scoring engine
        List<MemoryFabric.MemoryNode> fabricNodes = MemoryFabric.search(query);
        for (MemoryFabric.MemoryNode node : fabricNodes) {
            results.add("[" + node.sneakKey + "] " + node.title + ": " + node.content);
        }

        // 2. Secondary fallback: Query dynamic SQLite table for custom user additions
        if (results.isEmpty()) {
            try {
                SQLiteDatabase db = getReadableDatabase();
                String clean = query.trim().toLowerCase();
                String[] tokens = clean.split("[^a-zA-Z0-9_\\-]+");
                for (String token : tokens) {
                    if (token.length() > 2) {
                        String like = "%" + token + "%";
                        Cursor c = db.rawQuery("SELECT title, content, sneak_key FROM " + TABLE_MEMORIES + 
                                               " WHERE sneak_key LIKE ? OR title LIKE ? OR content LIKE ? LIMIT 3",
                                               new String[]{like, like, like});
                        while (c.moveToNext()) {
                            String entry = "[" + c.getString(2) + "] " + c.getString(0) + ": " + c.getString(1);
                            if (!results.contains(entry)) {
                                results.add(entry);
                            }
                        }
                        c.close();
                    }
                }
            } catch (Exception ignored) {}
        }

        return results;
    }

    public void logChat(String role, String message) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("role", role);
        cv.put("message", message);
        cv.put("timestamp", System.currentTimeMillis());
        db.insert(TABLE_CHAT, null, cv);
    }

    public void logShell(String command, String output, int exitCode) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("command", command);
        cv.put("output", output);
        cv.put("exit_code", exitCode);
        cv.put("timestamp", System.currentTimeMillis());
        db.insert(TABLE_SHELL_LOGS, null, cv);
    }
}
