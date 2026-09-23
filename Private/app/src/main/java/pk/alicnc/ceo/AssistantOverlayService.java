package pk.alicnc.ceo;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

/**
 * AssistantOverlayService
 * Keeps the assistant overlay UP and resized above the Android on-screen keyboard.
 * Fully silent, zero audio playback.
 */
public class AssistantOverlayService extends Service {

    private WindowManager windowManager;
    private View overlayView;
    private WindowManager.LayoutParams params;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        startForegroundNotification();
        initOverlay();
    }

    private void startForegroundNotification() {
        String channelId = "pai_overlay_channel";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                channelId, "PAI CEO Overlay", NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }

        Notification.Builder builder = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            ? new Notification.Builder(this, channelId)
            : new Notification.Builder(this);

        Notification notification = builder
            .setContentTitle("Ali CNC CEO AI Active")
            .setContentText("Tap to invoke assistant overlay")
            .setSmallIcon(R.mipmap.ic_launcher)
            .build();

        startForeground(1001, notification);
    }

    private void initOverlay() {
        windowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
        LayoutInflater inflater = LayoutInflater.from(this);
        overlayView = inflater.inflate(R.layout.overlay_assistant, null);

        int layoutType = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            : WindowManager.LayoutParams.TYPE_PHONE;

        // KEY FIX: Flags that allow focus and SOFT_INPUT_ADJUST_RESIZE
        // This ensures when the software keyboard opens, WindowManager resizes and pushes overlay UP!
        params = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL | WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH,
            PixelFormat.TRANSLUCENT
        );

        params.gravity = Gravity.BOTTOM;
        params.softInputMode = WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE | WindowManager.LayoutParams.SOFT_INPUT_STATE_UNCHANGED;

        final TextView tvContent = overlayView.findViewById(R.id.tv_overlay_content);
        final EditText etInput = overlayView.findViewById(R.id.et_overlay_input);
        Button btnSend = overlayView.findViewById(R.id.btn_overlay_send);
        Button btnClose = overlayView.findViewById(R.id.btn_close_overlay);

        // Auto-show keyboard when tapped
        etInput.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                    if (imm != null) {
                        imm.showSoftInput(etInput, InputMethodManager.SHOW_IMPLICIT);
                    }
                }
            }
        });

        btnSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String prompt = etInput.getText().toString().trim();
                if (prompt.isEmpty()) return;

                etInput.setText("");
                tvContent.setText("Thinking: " + prompt + "...");

                // Execute query silently (no TTS audio)
                ReplicateClient.generateResponse(prompt, new ReplicateClient.ReplicateCallback() {
                    @Override
                    public void onSuccess(final String responseText) {
                        overlayView.post(new Runnable() {
                            @Override
                            public void run() {
                                tvContent.setText(responseText);
                            }
                        });
                    }

                    @Override
                    public void onError(final String errorMessage) {
                        overlayView.post(new Runnable() {
                            @Override
                            public void run() {
                                tvContent.setText("Error: " + errorMessage);
                            }
                        });
                    }
                });
            }
        });

        btnClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                stopSelf();
            }
        });

        // Dynamic Keyboard Tracking for Overlay Window (Zero Blind Area)
        overlayView.getViewTreeObserver().addOnGlobalLayoutListener(new android.view.ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                android.graphics.Rect r = new android.graphics.Rect();
                overlayView.getWindowVisibleDisplayFrame(r);
                int screenHeight = overlayView.getContext().getResources().getDisplayMetrics().heightPixels;
                int keypadHeight = screenHeight - r.bottom;

                if (keypadHeight > screenHeight * 0.15) {
                    if (params.y != keypadHeight) {
                        params.y = keypadHeight;
                        try {
                            windowManager.updateViewLayout(overlayView, params);
                        } catch (Exception ignored) {}
                    }
                } else {
                    if (params.y != 0) {
                        params.y = 0;
                        try {
                            windowManager.updateViewLayout(overlayView, params);
                        } catch (Exception ignored) {}
                    }
                }
            }
        });

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            overlayView.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @Override
                public android.view.WindowInsets onApplyWindowInsets(View v, android.view.WindowInsets insets) {
                    int imeHeight = insets.getInsets(android.view.WindowInsets.Type.ime()).bottom;
                    int targetY = (imeHeight > 0) ? imeHeight : 0;
                    if (params.y != targetY) {
                        params.y = targetY;
                        try {
                            windowManager.updateViewLayout(overlayView, params);
                        } catch (Exception ignored) {}
                    }
                    return insets;
                }
            });
        }

        windowManager.addView(overlayView, params);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (overlayView != null && windowManager != null) {
            windowManager.removeView(overlayView);
        }
    }
}
