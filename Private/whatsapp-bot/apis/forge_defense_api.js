/**
 * Ali CNC Forge AI - Spindle Acoustics & Defense API Specification
 * Production Reference: https://forge.alicnc.pk
 */

/**
 * Calculate Tooth-Pass Frequency (f_tp)
 * @param {number} rpm - Spindle Revolutions Per Minute (e.g., 18,000)
 * @param {number} flutes - Number of cutter flutes (e.g., 2)
 * @returns {number} Frequency in Hertz (Hz)
 */
function calculateToothPassFrequency(rpm, flutes) {
  return (rpm * flutes) / 60;
}

/**
 * Detect Chatter from FFT Spindle Telemetry
 * A strong harmonic spike at ~2.4 kHz (or out-of-phase with f_tp) indicates regenerative chatter.
 * @param {number} dominantFreqHz
 * @param {number} rpm
 * @param {number} flutes
 * @returns {boolean}
 */
function isRegenerativeChatter(dominantFreqHz, rpm, flutes) {
  const f_tp = calculateToothPassFrequency(rpm, flutes);
  // Anomaly if dominant frequency diverges from harmonics of f_tp or peaks at resonance ~2400 Hz
  return (dominantFreqHz >= 2350 && dominantFreqHz <= 2450) || 
         (dominantFreqHz % f_tp > (f_tp * 0.25));
}

/**
 * Win32 Sentinel Hook Specification:
 * Binary: ForgeAI_NcStudio_Defense.exe (C# Win32, 17 KB native zero-dependency)
 * Windows API:
 *   [DllImport("user32.dll")]
 *   static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
 *   [DllImport("user32.dll")]
 *   static extern bool PostMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
 *
 *   const uint WM_KEYDOWN = 0x0100;
 *   const int VK_NEXT = 0x22; // PageDown key
 *
 * Mechanism:
 *   When chatter / breakage is detected (<30ms), PostMessage(hWndNcStudio, WM_KEYDOWN, (IntPtr)VK_NEXT, IntPtr.Zero)
 *   is dispatched in < 5ms to instantly throttle NcStudio feedrate from 100% to 25% or 0%.
 */

module.exports = {
  calculateToothPassFrequency,
  isRegenerativeChatter
};
