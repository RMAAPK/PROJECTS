package pk.alicnc.ceo;

import android.os.Environment;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

/**
 * Real Shell & Shizuku Bridge
 * Directly invokes Android /system/bin/sh, rish, or native shell commands.
 * Zero mocked strings — executes actual binaries and reads actual filesystem buffers.
 */
public class ShizukuBridge {

    /**
     * Executes real shell commands on Android
     */
    public static String executeRishCommand(String command) {
        StringBuilder output = new StringBuilder();
        try {
            // Determine shell binary: check for rish, su, or standard sh
            String shell = "/system/bin/sh";
            File rishBin = new File("/data/local/tmp/rish");
            if (rishBin.exists() && rishBin.canExecute()) {
                shell = rishBin.getAbsolutePath();
            }

            // Real execution of uiautomator dump
            if (command.contains("uiautomator dump")) {
                File dumpTarget = new File(Environment.getExternalStorageDirectory(), "window_dump.xml");
                Process p = Runtime.getRuntime().exec(new String[]{shell, "-c", "uiautomator dump " + dumpTarget.getAbsolutePath()});
                p.waitFor();

                if (dumpTarget.exists() && dumpTarget.length() > 0) {
                    output.append(">>> REAL UI DUMP [").append(dumpTarget.length()).append(" bytes]:\n");
                    BufferedReader fr = new BufferedReader(new InputStreamReader(new FileInputStream(dumpTarget), StandardCharsets.UTF_8));
                    String line;
                    int count = 0;
                    while ((line = fr.readLine()) != null && count < 25) {
                        output.append(line).append("\n");
                        count++;
                    }
                    fr.close();
                    if (count >= 25) {
                        output.append("... [Full XML stored at ").append(dumpTarget.getAbsolutePath()).append("]");
                    }
                    return output.toString();
                }
            }

            // Real execution of screencap
            if (command.contains("screencap")) {
                File capFile = new File(Environment.getExternalStorageDirectory(), "pai_screencap.png");
                Process p = Runtime.getRuntime().exec(new String[]{shell, "-c", "screencap -p " + capFile.getAbsolutePath()});
                p.waitFor();
                if (capFile.exists()) {
                    return ">>> REAL SCREENCAP CAPTURED: " + capFile.getAbsolutePath() + " (" + capFile.length() + " bytes)";
                }
            }

            // Generic real command execution
            Process process = Runtime.getRuntime().exec(new String[]{shell, "-c", command});
            
            // Capture standard output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            reader.close();

            // Capture error output if any
            BufferedReader errReader = new BufferedReader(new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8));
            StringBuilder errOutput = new StringBuilder();
            while ((line = errReader.readLine()) != null) {
                errOutput.append(line).append("\n");
            }
            errReader.close();

            int exitCode = process.waitFor();
            if (output.length() == 0 && errOutput.length() > 0) {
                return "[Shell Exit " + exitCode + "]:\n" + errOutput.toString();
            }

            return output.length() > 0 ? output.toString().trim() : "[Shell Exit " + exitCode + " OK - No Stdout]";

        } catch (Exception e) {
            return "[Shell Exception]: " + e.getMessage();
        }
    }
}
