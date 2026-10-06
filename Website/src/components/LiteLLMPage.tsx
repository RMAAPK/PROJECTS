import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export const LiteLLMPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LiteLLM Model Gateway</Text>
      <Text style={styles.subtitle}>
        Centralized AI routing, fallback configurations, and load balancing.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});

export default LiteLLMPage;
