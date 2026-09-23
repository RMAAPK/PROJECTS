import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '../theme';

export const AcousticSimulator: React.FC = () => {
  const [rpm, setRpm] = useState<number>(18000);
  const [flutes, setFlutes] = useState<number>(2);
  const [isChatter, setIsChatter] = useState<boolean>(false);
  const [isOverridden, setIsOverridden] = useState<boolean>(false);
  const [feedRate, setFeedRate] = useState<number>(100);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const chatterOscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Calculate fundamental tooth-pass frequency
  const toothPassFreq = Math.round((rpm * flutes) / 60);

  // Audio synthesizer control
  const toggleAudio = () => {
    if (isPlayingAudio) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtxClass();
        const mainGain = ctx.createGain();
        mainGain.gain.setValueAtTime(0.04, ctx.currentTime);
        mainGain.connect(ctx.destination);

        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(toothPassFreq, ctx.currentTime);
        osc.connect(mainGain);
        osc.start();

        const chatterOsc = ctx.createOscillator();
        chatterOsc.type = 'square';
        chatterOsc.frequency.setValueAtTime(2400, ctx.currentTime);

        const chatterGain = ctx.createGain();
        chatterGain.gain.setValueAtTime(isChatter ? 0.08 : 0.0, ctx.currentTime);
        chatterOsc.connect(chatterGain);
        chatterGain.connect(ctx.destination);
        chatterOsc.start();

        audioCtxRef.current = ctx;
        oscRef.current = osc;
        chatterOscRef.current = chatterOsc;
        gainNodeRef.current = chatterGain;
        setIsPlayingAudio(true);
      } catch (err) {
        console.error('Web Audio error:', err);
      }
    }
  };

  // Update audio frequency if active
  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(toothPassFreq, audioCtxRef.current.currentTime);
    }
  }, [toothPassFreq]);

  // Update chatter audio gain
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isChatter && !isOverridden ? 0.08 : 0.0,
        audioCtxRef.current.currentTime
      );
    }
  }, [isChatter, isOverridden]);

  // Handle Forge AI Override
  const triggerOverride = () => {
    setIsOverridden(true);
    setFeedRate(25);
    setTimeout(() => {
      setIsChatter(false);
    }, 400);
  };

  const resetCut = () => {
    setIsOverridden(false);
    setIsChatter(false);
    setFeedRate(100);
  };

  // Canvas Oscilloscope Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.fillStyle = '#0E1017';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw acoustic waveform
      ctx.beginPath();
      const centerY = canvas.height / 2;
      ctx.lineWidth = 2;
      ctx.strokeStyle = isChatter && !isOverridden ? '#F43F5E' : isOverridden ? '#10B981' : '#38BDF8';

      const wavelength = 50000 / (toothPassFreq || 1);

      for (let x = 0; x < canvas.width; x++) {
        const fundamental = Math.sin(x / wavelength + phase) * 26;
        let chatter = 0;
        if (isChatter && !isOverridden) {
          // Add harsh 2.4 kHz harmonic spikes
          chatter = (Math.sin(x / 4 + phase * 4) + Math.random() * 0.4) * 35;
        } else if (isOverridden) {
          // Clean suppressed harmonic
          chatter = Math.sin(x / 12 + phase) * 6;
        }

        const y = centerY + fundamental + chatter;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Animate phase
      phase += 0.08 * (feedRate / 100);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [toothPassFreq, isChatter, isOverridden, feedRate]);

  return (
    <View style={styles.sectionWrapper} id="simulator">
      <View style={styles.container}>
        {/* Section Heading */}
        <View style={styles.headerArea}>
          <Text style={styles.sectionTag}>🔬 ACOUSTIC TELEMETRY &amp; HARDWARE DSP</Text>
          <Text style={styles.sectionTitle}>
            The Spindle Tooth-Pass <Text style={styles.highlight}>Acoustic Lab</Text>
          </Text>
          <Text style={styles.sectionDesc}>
            In physical CNC machining, tooth-pass resonance governs cutter stability. Adjust RPM,
            inject 2.4 kHz regenerative chatter, and test the Forge AI PageDown feed throttle.
          </Text>
        </View>

        {/* The Mathematical Law Card */}
        <View style={styles.formulaCard}>
          <Text style={styles.formulaLabel}>FUNDAMENTAL CUTTING FREQUENCY THEOREM:</Text>
          <Text style={styles.formulaText}>
            f_tp = (Spindle RPM × Flutes) / 60
          </Text>
          <Text style={styles.formulaSub}>
            At {rpm.toLocaleString()} RPM with {flutes} flutes, the acoustic tooth-pass fundamental is exactly{' '}
            <Text style={styles.formulaFreq}>{toothPassFreq} Hz</Text>.
          </Text>
        </View>

        {/* Interactive Lab Dashboard */}
        <View style={styles.dashboardCard}>
          {/* Controls Bar */}
          <View style={styles.controlsRow}>
            {/* RPM Slider */}
            <View style={styles.controlGroup}>
              <View style={styles.labelValueRow}>
                <Text style={styles.controlLabel}>Spindle Speed:</Text>
                <Text style={styles.controlValue}>{rpm.toLocaleString()} RPM</Text>
              </View>
              <input
                type="range"
                min="6000"
                max="24000"
                step="1000"
                value={rpm}
                onChange={(e) => setRpm(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: theme.colors.cyan,
                  cursor: 'pointer',
                }}
              />
            </View>

            {/* Flutes Selection */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Endmill Flutes:</Text>
              <View style={styles.fluteButtonGroup}>
                {[1, 2, 3, 4].map((f) => (
                  <Pressable
                    key={f}
                    onPress={() => setFlutes(f)}
                    style={[styles.fluteBtn, flutes === f && styles.fluteBtnActive]}
                  >
                    <Text
                      style={[styles.fluteBtnText, flutes === f && styles.fluteBtnTextActive]}
                    >
                      {f}F
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Audio Toggle */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Audio Synthesizer:</Text>
              <Pressable
                onPress={toggleAudio}
                style={[styles.audioToggleBtn, isPlayingAudio && styles.audioToggleActive]}
              >
                <Text style={styles.audioToggleText}>
                  {isPlayingAudio ? '🔊 Mute Spindle Audio' : '🔈 Synthesize Spindle Hum'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Canvas Waveform Display */}
          <View style={styles.canvasContainer}>
            <canvas
              ref={canvasRef}
              width={800}
              height={180}
              style={{
                width: '100%',
                height: 180,
                borderRadius: 8,
                backgroundColor: '#0E1017',
              }}
            />

            {/* Live Telemetry Overlay */}
            <View style={styles.canvasOverlay}>
              <View style={styles.telemetryPill}>
                <Text style={styles.telemetryLabel}>Tooth-Pass:</Text>
                <Text style={styles.telemetryVal}>{toothPassFreq} Hz</Text>
              </View>
              <View style={styles.telemetryPill}>
                <Text style={styles.telemetryLabel}>NcStudio Feed Rate:</Text>
                <Text
                  style={[
                    styles.telemetryVal,
                    { color: feedRate === 100 ? theme.colors.cyan : theme.colors.emerald },
                  ]}
                >
                  {feedRate}%
                </Text>
              </View>
              <View style={styles.telemetryPill}>
                <Text style={styles.telemetryLabel}>Anomaly State:</Text>
                <Text
                  style={[
                    styles.telemetryVal,
                    {
                      color:
                        isChatter && !isOverridden
                          ? theme.colors.rose
                          : isOverridden
                          ? theme.colors.emerald
                          : theme.colors.textMuted,
                    },
                  ]}
                >
                  {isChatter && !isOverridden
                    ? '⚠️ 2.4 kHz CHATTER'
                    : isOverridden
                    ? '🛡️ SENTINEL OVERRIDE (<5ms)'
                    : 'NORMAL CUT'}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Triggers */}
          <View style={styles.actionsBar}>
            <Pressable
              onPress={() => {
                setIsChatter(true);
                setIsOverridden(false);
              }}
              style={styles.chatterBtn}
            >
              <Text style={styles.chatterBtnText}>💥 Inject 2.4 kHz Harmonic Chatter</Text>
            </Pressable>

            <Pressable onPress={triggerOverride} style={styles.overrideBtn}>
              <Text style={styles.overrideBtnText}>
                🛡️ Fire Forge AI Sentinel (VK_NEXT / PageDown)
              </Text>
            </Pressable>

            <Pressable onPress={resetCut} style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>↺ Reset</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: '#0B0D14',
  },
  container: {
    maxWidth: 1040,
    width: '100%',
    marginHorizontal: 'auto' as any,
  },
  headerArea: {
    alignItems: 'center',
    textAlign: 'center' as any,
    marginBottom: 36,
  },
  sectionTag: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    letterSpacing: -1,
    marginBottom: 14,
  },
  highlight: {
    color: theme.colors.cyan,
  },
  sectionDesc: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    maxWidth: 720,
    lineHeight: 24,
  },
  formulaCard: {
    backgroundColor: 'rgba(56, 189, 248, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderRadius: theme.radii.lg,
    padding: 20,
    alignItems: 'center',
    textAlign: 'center' as any,
    marginBottom: 24,
  },
  formulaLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  formulaText: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.mono,
    marginBottom: 6,
  },
  formulaSub: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  formulaFreq: {
    color: theme.colors.cyan,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
  },
  dashboardCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: 24,
  },
  controlsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  controlGroup: {
    flex: 1,
    minWidth: 200,
  },
  labelValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.mono,
    marginBottom: 6,
  },
  controlValue: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
  },
  fluteButtonGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  fluteBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: theme.radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    alignItems: 'center',
    cursor: 'pointer' as any,
  },
  fluteBtnActive: {
    backgroundColor: theme.colors.cyan,
    borderColor: theme.colors.cyan,
  },
  fluteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.mono,
  },
  fluteBtnTextActive: {
    color: '#090A0F',
  },
  audioToggleBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: theme.radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    alignItems: 'center',
    cursor: 'pointer' as any,
  },
  audioToggleActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: theme.colors.emerald,
  },
  audioToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  canvasContainer: {
    position: 'relative' as any,
    marginBottom: 20,
  },
  canvasOverlay: {
    position: 'absolute' as any,
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    pointerEvents: 'none' as any,
  },
  telemetryPill: {
    backgroundColor: 'rgba(9, 10, 15, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  telemetryLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.mono,
  },
  telemetryVal: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
  },
  actionsBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  chatterBtn: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radii.md,
    cursor: 'pointer' as any,
  },
  chatterBtnText: {
    color: theme.colors.rose,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
  },
  overrideBtn: {
    backgroundColor: theme.colors.emerald,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: theme.radii.md,
    cursor: 'pointer' as any,
  },
  overrideBtnText: {
    color: '#090A0F',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: theme.fonts.mono,
  },
  resetBtn: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radii.md,
    cursor: 'pointer' as any,
  },
  resetBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
