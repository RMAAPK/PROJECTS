import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { theme } from '../theme';

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      if (data.id) {
        // Poll for completion
        const poll = setInterval(async () => {
          const pollRes = await fetch(/api/chat/);
          const pollData = await pollRes.json();
          if (pollData.reply) {
            clearInterval(poll);
            setMessages(prev => [...prev, { role: 'ai', text: pollData.reply }]);
            setLoading(false);
          } else if (pollData.error) {
            clearInterval(poll);
            setLoading(false);
          }
        }, 2000);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Pressable style={styles.fab} onPress={() => setIsOpen(true)}>
        <Text style={styles.fabIcon}>🤖</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.chatWindow}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatTitle}>RMAA AI Proxy</Text>
        <Pressable onPress={() => setIsOpen(false)}>
          <Text style={styles.closeBtn}>✕</Text>
        </Pressable>
      </View>
      <View style={styles.chatBody}>
        {messages.map((m, i) => (
          <View key={i} style={m.role === 'user' ? styles.userMsg : styles.aiMsg}>
            <Text style={styles.msgText}>{m.text}</Text>
          </View>
        ))}
        {loading && <Text style={styles.loading}>AI is thinking...</Text>}
      </View>
      <View style={styles.inputArea}>
        <TextInput 
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything..."
          placeholderTextColor={theme.colors.textMuted}
          onSubmitEditing={sendMessage}
        />
        <Pressable style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendBtnText}>➤</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'fixed' as any,
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.cyan,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)'
  },
  fabIcon: { fontSize: 24 },
  chatWindow: {
    position: 'fixed' as any,
    bottom: 24,
    right: 24,
    width: 320,
    height: 400,
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.bgCardHover,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
  },
  chatTitle: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
    fontFamily: theme.fonts.mono
  },
  closeBtn: { color: theme.colors.textSecondary, fontSize: 16 },
  chatBody: {
    flex: 1,
    padding: 16,
    overflowY: 'auto' as any,
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.cyan,
    padding: 10,
    borderRadius: 12,
    borderBottomRightRadius: 2,
    maxWidth: '80%'
  },
  aiMsg: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.border,
    padding: 10,
    borderRadius: 12,
    borderBottomLeftRadius: 2,
    maxWidth: '80%'
  },
  msgText: { color: '#F3F4F6', fontSize: 14, lineHeight: 20 },
  loading: { color: theme.colors.cyan, fontSize: 12, fontFamily: theme.fonts.mono, marginTop: 8 },
  inputArea: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.bg,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    outlineStyle: 'none' as any
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: theme.colors.cyan,
    padding: 10,
    borderRadius: 6,
  },
  sendBtnText: { color: '#090A0F', fontWeight: '900' }
});
