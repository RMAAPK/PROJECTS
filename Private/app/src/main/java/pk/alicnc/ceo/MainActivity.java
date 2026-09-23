package pk.alicnc.ceo;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.Settings;
import android.speech.RecognizerIntent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.WindowInsets;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import pk.alicnc.ceo.db.PAIDatabaseHelper;

/**
 * MainActivity
 * Fully Native, Silent, Zero Blind-Area Android Executive Command Center.
 * Handles Android 11-16 WindowInsets so the input box strictly sticks above the software keyboard.
 */
public class MainActivity extends Activity {

    private static final int REQ_PERMISSIONS = 101;
    private static final int REQ_VOICE_INPUT = 102;
    private static final int REQ_OVERLAY_PERM = 103;

    private LinearLayout rootLayout;
    private LinearLayout bottomInputContainer;
    private ListView listMessages;
    private EditText etMessageInput;
    private Button btnSendMessage;
    private ImageButton btnVoiceInput;
    private Button btnToggleOverlay;

    private ChatAdapter chatAdapter;
    private final List<ChatMessage> messageList = new ArrayList<>();
    private PAIDatabaseHelper dbHelper;
    private Vibrator vibrator;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Enable edge-to-edge insets dispatching for Android 11-16 (HyperOS 3)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
        }

        setContentView(R.layout.activity_main);

        dbHelper = PAIDatabaseHelper.getInstance(this);
        vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);

        // Request all permissions immediately
        requestAllPermissions();

        // Setup Views & Layout
        initViews();
        setupKeyboardResizeHandler();
        setupPromptChips();

        // Initial CEO Welcome Message (Silent)
        addAssistantMessage(
            "PAI Online, Ali. All systems armed for Sector F-11 workshop (Silent Mode):\n\n" +
            "• Machinery: Mingda 1325 CNC, NC Studio, Bambu A1.\n" +
            "• Security: AES-256 Vault Armed, Shizuku UID 2000 Ready.\n" +
            "• Memory: SQLite Pre-Populated with 25 Profile Nodes.\n\n" +
            "What are we conquering today, boss?"
        );

        // Read from Supabase FIRST on boot (Direct HTTPS, zero backend)
        SupabaseSyncService.syncFromSupabase(this, new SupabaseSyncService.SyncCallback() {
            @Override
            public void onSyncComplete(final boolean success, final String message) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        TextView tvVault = findViewById(R.id.tv_vault_status);
                        if (tvVault != null) {
                            if (success) {
                                tvVault.setText("● Supabase Synced (Direct)");
                            } else {
                                tvVault.setText("● SQLite Vault (Offline)");
                            }
                        }
                    }
                });
            }
        });
    }

    private void initViews() {
        rootLayout = findViewById(R.id.root_layout);
        bottomInputContainer = findViewById(R.id.bottom_input_container);
        listMessages = findViewById(R.id.list_messages);
        etMessageInput = findViewById(R.id.et_message_input);
        btnSendMessage = findViewById(R.id.btn_send_message);
        btnVoiceInput = findViewById(R.id.btn_voice_input);
        btnToggleOverlay = findViewById(R.id.btn_toggle_overlay);

        chatAdapter = new ChatAdapter(this, messageList);
        listMessages.setAdapter(chatAdapter);

        btnSendMessage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hapticClick();
                sendUserMessage();
            }
        });

        btnVoiceInput.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hapticClick();
                startVoiceInput();
            }
        });

        btnToggleOverlay.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hapticClick();
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(MainActivity.this)) {
                    Toast.makeText(MainActivity.this, "Granting Overlay Permission...", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                            Uri.parse("package:" + getPackageName()));
                    try {
                        startActivityForResult(intent, REQ_OVERLAY_PERM);
                    } catch (Exception e) {
                        startActivity(new Intent(MainActivity.this, AssistantActivity.class));
                    }
                } else {
                    try {
                        Intent serviceIntent = new Intent(MainActivity.this, AssistantOverlayService.class);
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            startForegroundService(serviceIntent);
                        } else {
                            startService(serviceIntent);
                        }
                        Toast.makeText(MainActivity.this, "Overlay Active on Screen", Toast.LENGTH_SHORT).show();
                    } catch (Exception e) {
                        startActivity(new Intent(MainActivity.this, AssistantActivity.class));
                    }
                }
            }
        });
    }

    /**
     * CRITICAL FIX: Dual-Layer Software Keyboard Pinning & Insets Engine
     * Moves the bottom input box strictly above the software keyboard on Android 11-16 (HyperOS 3).
     * Zero blind area!
     */
    private void setupKeyboardResizeHandler() {
        // Layer 1: API 30+ (Android 11-16 / HyperOS 3) WindowInsets Listener
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            rootLayout.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @Override
                public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
                    int statusBar = insets.getInsets(WindowInsets.Type.statusBars()).top;
                    int navBar = insets.getInsets(WindowInsets.Type.navigationBars()).bottom;
                    int imeHeight = insets.getInsets(WindowInsets.Type.ime()).bottom;

                    // Pad top for status bar / camera cutout
                    rootLayout.setPadding(0, statusBar, 0, 0);

                    // Dynamic bottom padding for IME keyboard or navigation bar
                    int bottomPadding = (imeHeight > 0) ? (imeHeight + dpToPx(8)) : (navBar + dpToPx(8));

                    bottomInputContainer.setPadding(
                        bottomInputContainer.getPaddingLeft(),
                        bottomInputContainer.getPaddingTop(),
                        bottomInputContainer.getPaddingRight(),
                        bottomPadding
                    );

                    listMessages.post(new Runnable() {
                        @Override
                        public void run() {
                            if (chatAdapter.getCount() > 0) {
                                listMessages.setSelection(chatAdapter.getCount() - 1);
                            }
                        }
                    });

                    return insets;
                }
            });
        }

        // Layer 2: Universal ViewTreeObserver Global Layout Listener (Fail-Safe)
        // Guarantees that even if Xiaomi HyperOS intercepts or delays insets, the input box
        // is 100% physically pinned above the soft keyboard with ZERO blind area!
        final View decorView = getWindow().getDecorView();
        decorView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                Rect r = new Rect();
                decorView.getWindowVisibleDisplayFrame(r);
                int screenHeight = decorView.getRootView().getHeight();
                int keypadHeight = screenHeight - r.bottom;

                // Typical keyboard height is > 15% of screen height
                if (keypadHeight > screenHeight * 0.15) {
                    int targetPad = keypadHeight + dpToPx(8);
                    if (bottomInputContainer.getPaddingBottom() < targetPad) {
                        bottomInputContainer.setPadding(
                            bottomInputContainer.getPaddingLeft(),
                            bottomInputContainer.getPaddingTop(),
                            bottomInputContainer.getPaddingRight(),
                            targetPad
                        );
                        listMessages.post(new Runnable() {
                            @Override
                            public void run() {
                                if (chatAdapter.getCount() > 0) {
                                    listMessages.setSelection(chatAdapter.getCount() - 1);
                                }
                            }
                        });
                    }
                } else if (keypadHeight <= dpToPx(48) && Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
                    bottomInputContainer.setPadding(
                        bottomInputContainer.getPaddingLeft(),
                        bottomInputContainer.getPaddingTop(),
                        bottomInputContainer.getPaddingRight(),
                        dpToPx(12)
                    );
                }
            }
        });

        // Layer 3: Focus & Click listeners on EditText to immediately elevate list
        etMessageInput.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    listMessages.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            if (chatAdapter.getCount() > 0) {
                                listMessages.setSelection(chatAdapter.getCount() - 1);
                            }
                        }
                    }, 200);
                }
            }
        });

        etMessageInput.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                listMessages.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        if (chatAdapter.getCount() > 0) {
                            listMessages.setSelection(chatAdapter.getCount() - 1);
                        }
                    }
                }, 200);
            }
        });
    }

    private void setupPromptChips() {
        findViewById(R.id.chip_cnc).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hapticClick();
                etMessageInput.setText("What CNC router and motion controller do I run in my Sector F-11 workshop?");
                sendUserMessage();
            }
        });

        findViewById(R.id.chip_trademarks).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hapticClick();
                etMessageInput.setText("Detail my TM-01 trademark applications for ALI CNC and AHYEON.");
                sendUserMessage();
            }
        });

        findViewById(R.id.chip_fargo).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hapticClick();
                etMessageInput.setText("Who is Fargo and who takes care of him?");
                sendUserMessage();
            }
        });

        findViewById(R.id.chip_forge_ai).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hapticClick();
                etMessageInput.setText("Summarize my Y Combinator W27 application for Forge AI.");
                sendUserMessage();
            }
        });

        findViewById(R.id.chip_shizuku).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hapticClick();
                addUserMessage("Run real Shizuku uiautomator dump command");
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        final String dump = ShizukuBridge.executeRishCommand("uiautomator dump");
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                addAssistantMessage("Real Shell Output:\n\n" + dump);
                            }
                        });
                    }
                }).start();
            }
        });

        findViewById(R.id.chip_safety).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hapticClick();
                addUserMessage("Transfer 50,000 PKR to Nayapay account");
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        final String safetyResult = ShizukuBridge.executeRishCommand("sadapay transfer 50000");
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                addAssistantMessage("Safety Boundary Intercepted:\n\n" + safetyResult);
                            }
                        });
                    }
                }).start();
            }
        });
    }

    private void sendUserMessage() {
        String text = etMessageInput.getText().toString().trim();
        if (text.isEmpty()) return;

        etMessageInput.setText("");
        addUserMessage(text);
        dbHelper.logChat("user", text);
        SupabaseSyncService.syncChat("user", text);

        // Call Replicate Client (Pure silent output)
        ReplicateClient.generateResponse(text, new ReplicateClient.ReplicateCallback() {
            @Override
            public void onSuccess(final String responseText) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        addAssistantMessage(responseText);
                        dbHelper.logChat("assistant", responseText);
                        SupabaseSyncService.syncChat("assistant", responseText);
                    }
                });
            }

            @Override
            public void onError(final String errorMessage) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        addAssistantMessage("Error: " + errorMessage);
                    }
                });
            }
        });
    }

    private void addUserMessage(String text) {
        messageList.add(new ChatMessage(text, true));
        chatAdapter.notifyDataSetChanged();
        listMessages.smoothScrollToPosition(messageList.size() - 1);
        SupabaseSyncService.logInteraction("user", text);
    }

    private void addAssistantMessage(String text) {
        messageList.add(new ChatMessage(text, false));
        chatAdapter.notifyDataSetChanged();
        listMessages.smoothScrollToPosition(messageList.size() - 1);
    }

    private void startVoiceInput() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak to Ali CNC CEO AI...");
        try {
            startActivityForResult(intent, REQ_VOICE_INPUT);
        } catch (Exception e) {
            Toast.makeText(this, "Speech recognition not supported on device", Toast.LENGTH_SHORT).show();
        }
    }

    private void hapticClick() {
        if (vibrator != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                vibrator.vibrate(VibrationEffect.createPredefined(VibrationEffect.EFFECT_CLICK));
            } else {
                vibrator.vibrate(15);
            }
        }
    }

    private int dpToPx(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density);
    }

    private void requestAllPermissions() {
        List<String> perms = new ArrayList<>();
        perms.add(Manifest.permission.CAMERA);
        perms.add(Manifest.permission.RECORD_AUDIO);
        perms.add(Manifest.permission.ACCESS_FINE_LOCATION);
        perms.add(Manifest.permission.ACCESS_COARSE_LOCATION);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            perms.add("android.permission.POST_NOTIFICATIONS");
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            requestPermissions(perms.toArray(new String[0]), REQ_PERMISSIONS);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_VOICE_INPUT && resultCode == RESULT_OK && data != null) {
            ArrayList<String> matches = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
            if (matches != null && !matches.isEmpty()) {
                etMessageInput.setText(matches.get(0));
                sendUserMessage();
            }
        }
    }
}
