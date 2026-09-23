package pk.alicnc.ceo;

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import pk.alicnc.ceo.db.PAIDatabaseHelper;

/**
 * AssistantActivity
 * Real Gemini-style translucent bottom-sheet assistant.
 * Handles on-screen keyboard insets automatically with zero blind area.
 */
public class AssistantActivity extends Activity {

    private TextView tvOutput;
    private EditText etInput;
    private Button btnSend;
    private Button btnClose;
    private View bottomSheetContainer;
    private PAIDatabaseHelper dbHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
        }

        setContentView(R.layout.activity_assistant);

        dbHelper = PAIDatabaseHelper.getInstance(this);

        tvOutput = findViewById(R.id.tv_assistant_output);
        etInput = findViewById(R.id.et_assistant_input);
        btnSend = findViewById(R.id.btn_assistant_send);
        btnClose = findViewById(R.id.btn_close_assistant);
        bottomSheetContainer = findViewById(R.id.bottom_sheet_container);

        findViewById(R.id.view_scrim_dismiss).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        btnClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        // Dual-Layer Keyboard & Insets Pinning (Zero Blind Area)
        final View root = findViewById(R.id.assistant_root_layout);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @Override
                public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
                    int imeHeight = insets.getInsets(WindowInsets.Type.ime()).bottom;
                    int navHeight = insets.getInsets(WindowInsets.Type.navigationBars()).bottom;
                    int bottom = (imeHeight > 0) ? (imeHeight + dpToPx(12)) : (navHeight + dpToPx(12));
                    bottomSheetContainer.setPadding(
                        bottomSheetContainer.getPaddingLeft(),
                        bottomSheetContainer.getPaddingTop(),
                        bottomSheetContainer.getPaddingRight(),
                        bottom
                    );
                    return insets;
                }
            });
        }

        final View decorView = getWindow().getDecorView();
        decorView.getViewTreeObserver().addOnGlobalLayoutListener(new android.view.ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                android.graphics.Rect r = new android.graphics.Rect();
                decorView.getWindowVisibleDisplayFrame(r);
                int screenHeight = decorView.getRootView().getHeight();
                int keypadHeight = screenHeight - r.bottom;

                if (keypadHeight > screenHeight * 0.15) {
                    int targetPad = keypadHeight + dpToPx(12);
                    if (bottomSheetContainer.getPaddingBottom() < targetPad) {
                        bottomSheetContainer.setPadding(
                            bottomSheetContainer.getPaddingLeft(),
                            bottomSheetContainer.getPaddingTop(),
                            bottomSheetContainer.getPaddingRight(),
                            targetPad
                        );
                    }
                }
            }
        });

        btnSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String query = etInput.getText().toString().trim();
                if (query.isEmpty()) return;

                etInput.setText("");
                tvOutput.setText("Processing directive: " + query + "...");

                dbHelper.logChat("user", query);
                SupabaseSyncService.syncChat("user", query);

                ReplicateClient.generateResponse(query, new ReplicateClient.ReplicateCallback() {
                    @Override
                    public void onSuccess(final String responseText) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                tvOutput.setText(responseText);
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
                                tvOutput.setText("Error: " + errorMessage);
                            }
                        });
                    }
                });
            }
        });
    }

    private int dpToPx(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density);
    }
}
