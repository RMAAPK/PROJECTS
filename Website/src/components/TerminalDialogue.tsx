import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '../theme';

interface LogEntry {
  command?: string;
  response: string | React.ReactNode;
  isError?: boolean;
}

export const TerminalDialogue: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<LogEntry[]>([
    {
      response:
        "Ali CNC Interactive Sentinel v3.2 [Node.js / React Native Web]\nType 'help' to inspect commands or click any chip below.",
    },
    {
      command: 'whoami',
      response:
        'Muhammad Ali (Raja Muhammad Ali Asghar) • Solo Founder of Ali CNC & Forge AI.\nINTJ • Estimated IQ 150+ • TITANS of CNC Dual Certified • PSEB Registered.',
    },
  ]);

  const executeCommand = (cmd: string) => {
    const clean = cmd.trim().toLowerCase();
    if (!clean) return;

    if (clean === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    let res: string = '';
    let isErr = false;

    switch (clean) {
      case 'help':
        res = `Available commands:
  • whoami    : Core identity, founder background, IQ & stats
  • punchline : The signature hook
  • boxer     : The difference between the boxer and the spindle founder
  • spindle   : Mingda 1325 specs, RPM, and Weihong PCIMC-3D bus
  • forge     : Forge AI acoustic physics formula & < 5ms sentinel
  • yc        : YC Paxel Report #4 audit metrics & badges
  • biases    : Ultimate music biases (BIBI, Jung Ahyeon, BLACKPINK)
  • dramas    : 500+ K-Drama recommendations
  • fargo     : Fargo the German Shepherd & Cousin Haseeb
  • contact   : Personal & business email channels
  • clear     : Clear terminal screen`;
        break;

      case 'whoami':
        res = `IDENTITY: Raja Muhammad Ali Asghar (Muhammad Ali)
BORN: Dec 24, 2003 (Age 22), Rawalpindi & Islamabad, Pakistan
ROLES: Solo Founder & CEO, CNC Systems Architect, Full-Stack Engineer
ORGANIZATIONS: Ali CNC (alicnc.pk) & Ali CNC Forge AI (forge.alicnc.pk)
INTELLECT: INTJ • Estimated IQ 150+ • 100% Conventional Commits, 0 Reverts`;
        break;

      case 'punchline':
        res = `"Hi, I'm Muhammad Ali. No, not the boxer. The one wrestling 24,000 RPM spindles and saving carbide bits with AI acoustics."`;
        break;

      case 'boxer':
        res = `Boxing Ali: Floats like a butterfly, stings like a bee. Knocked out Sonny Liston.
Spindle Ali: Floats like a butterfly, cuts Sheesham at 3,500 mm/min. Knocked out 2.4 kHz regenerative chatter with PageDown keydown events.`;
        break;

      case 'spindle':
        res = `MACHINE: Hefei Mingda 1325 3-Axis Industrial Wood Router
SPINDLE: 3.2 kW / 5.5 kW Water-Cooled (6,000–24,000 RPM closed-loop)
MOTION CARD: Weihong PCIMC-3D PCI (WCH CH365 bridge + whnc3d.sys driver)
CONTROL: NcStudio v5.56 / v8
MATERIAL FEEDS: 18,000 RPM, 3500 mm/min, 6mm 2-flute carbide endmill`;
        break;

      case 'forge':
        res = `PRODUCT: Ali CNC Forge AI (https://forge.alicnc.pk)
ACOUSTIC LAW: f_tp = (RPM * Flutes) / 60
FUNDAMENTAL: 18,000 RPM * 2 flutes / 60 = 600 Hz
ANOMALY SPIKE: 2.4 kHz chatter resonance
DEFENSE SENTINEL: ForgeAI_NcStudio_Defense.exe (17 KB native C#)
INTERVENTION TIME: < 5ms Win32 WM_KEYDOWN VK_NEXT (drops feed 100% -> 25%)`;
        break;

      case 'yc':
        res = `OFFICIAL YC PAXEL AUDIT (Sep 9, 2026):
  • Archetype: Generalist (adapts pattern dynamically to problem)
  • Work Style: A back-and-forth (16 prompts/session, 15h 1m continuous stretch)
  • Commit Discipline: 100% conventional commits, 0 reverts
  • Error Rate: 0.0 unresolved errors/session when plan precedes execution
  • Badges: Frame Breaker (4), Dances with Robots (17), Architect's Veto (3), Cognitive Breadth (5)`;
        break;

      case 'biases':
        res = `ULTIMATE BIASES:
  1. BIBI (Kim Hyung-seo) — Raw authenticity, razor-sharp lyricism, unmatched edge.
  2. Jung Ahyeon (BABYMONSTER) — All-rounder vocalist/rapper, namesake of trademark AHYEON.
OTHER BIASES: Jennie (2nd bias), Lisa, Rosé, Jisoo.
GROUPS: BABYMONSTER, BLACKPINK, ILLIT, LE SSERAFIM, TWICE, NewJeans, IVE.`;
        break;

      case 'dramas':
        res = `500+ COMPLETED K-DRAMAS:
  • Itaewon Class: DanBam founder grit, relentless persistence against titans.
  • Queen Seondeok: High-stakes court strategy and political brilliance.
  • The Woman Who Swallowed the Sun: Narrative depth and tenacity.
FAVORITE ACTRESSES: Bae Suzy, IU, Kim Ji-soo.`;
        break;

      case 'fargo':
        res = `  / \\__
 (    @\\___
 /         O
/   (_____/
/_____/   U

Fargo: The family German Shepherd in Rawalpindi.
Caretaker: Cousin Haseeb & Muhammad Ali.
Duties: Workshop perimeter protection, companion on late-night code runs.`;
        break;

      case 'contact':
        res = `PERSONAL DIRECT: say@rmaa.pk
BUSINESS EMAIL : ali@alicnc.pk
WHATSAPP       : +92 344 0708494
GITHUB         : https://github.com/thealidev & https://github.com/alicncltd
WEBSITE        : https://alicnc.pk & https://forge.alicnc.pk`;
        break;

      default:
        res = `Command not recognized: '${clean}'. Type 'help' to see valid commands.`;
        isErr = true;
        break;
    }

    setHistory((prev) => [
      ...prev,
      { command: cmd, response: res, isError: isErr },
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    }
  };

  const suggestionChips = [
    'whoami',
    'punchline',
    'boxer',
    'forge',
    'yc',
    'spindle',
    'biases',
    'dramas',
    'fargo',
    'contact',
  ];

  return (
    <View style={styles.sectionWrapper} id="terminal">
      <View style={styles.container}>
        {/* Section Heading */}
        <View style={styles.headerArea}>
          <Text style={styles.sectionTag}>💻 REVENUE &amp; TELEMETRY CONSOLE</Text>
          <Text style={styles.sectionTitle}>
            Interactive <Text style={styles.highlight}>Command Sentinel</Text>
          </Text>
          <Text style={styles.sectionDesc}>
            Direct terminal access to the Muhammad Ali database. Type a command or tap a prompt
            chip below.
          </Text>
        </View>

        {/* Suggestion Chips */}
        <View style={styles.chipsRow}>
          {suggestionChips.map((chip) => (
            <Pressable
              key={chip}
              onPress={() => executeCommand(chip)}
              style={styles.chipButton}
            >
              <Text style={styles.chipText}>$ {chip}</Text>
            </Pressable>
          ))}
        </View>

        {/* Terminal Window */}
        <View style={styles.terminalWindow}>
          {/* Top Bar */}
          <View style={styles.terminalHeader}>
            <View style={styles.windowButtons}>
              <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
              <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
            </View>
            <Text style={styles.terminalTitle}>ali@rawalpindi-sentinel:~ (node 24.15)</Text>
            <Pressable onPress={() => executeCommand('clear')}>
              <Text style={styles.clearBtnText}>clear</Text>
            </Pressable>
          </View>

          {/* Terminal Body */}
          <View style={styles.terminalBody}>
            {history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                {item.command && (
                  <View style={styles.commandLine}>
                    <Text style={styles.promptSign}>$</Text>
                    <Text style={styles.commandText}>{item.command}</Text>
                  </View>
                )}
                <Text
                  style={[
                    styles.responseText,
                    item.isError && styles.errorResponse,
                  ]}
                >
                  {item.response}
                </Text>
              </View>
            ))}

            {/* Input Row */}
            <View style={styles.inputRow}>
              <Text style={styles.promptSign}>$</Text>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type 'help', 'punchline', 'forge'..."
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: theme.colors.cyan,
                  fontFamily: theme.fonts.mono,
                  fontSize: 13,
                  marginLeft: 8,
                }}
              />
            </View>
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
    backgroundColor: theme.colors.bg,
  },
  container: {
    maxWidth: 960,
    width: '100%',
    marginHorizontal: 'auto' as any,
  },
  headerArea: {
    alignItems: 'center',
    textAlign: 'center' as any,
    marginBottom: 28,
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
    marginBottom: 12,
  },
  highlight: {
    color: theme.colors.cyan,
  },
  sectionDesc: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    maxWidth: 680,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 20,
  },
  chipButton: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radii.full,
    cursor: 'pointer' as any,
  },
  chipText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.mono,
  },
  terminalWindow: {
    backgroundColor: '#0A0C13',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)' as any,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121520',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  windowButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  terminalTitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.mono,
  },
  clearBtnText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.mono,
    cursor: 'pointer' as any,
  },
  terminalBody: {
    padding: 20,
    minHeight: 280,
    maxHeight: 460,
    overflowY: 'auto' as any,
  },
  historyItem: {
    marginBottom: 14,
  },
  commandLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  promptSign: {
    color: theme.colors.emerald,
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    fontWeight: '700',
  },
  commandText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    fontWeight: '600',
  },
  responseText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    lineHeight: 18,
    whiteSpace: 'pre-wrap' as any,
  },
  errorResponse: {
    color: theme.colors.rose,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
