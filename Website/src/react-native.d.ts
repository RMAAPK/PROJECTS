declare module 'react-native' {
  import * as React from 'react';

  export interface ViewProps {
    id?: string;
    style?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface TextProps {
    style?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface PressableProps {
    onPress?: () => void;
    style?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface ScrollViewProps {
    contentContainerStyle?: any;
    style?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;
  export const Pressable: React.FC<PressableProps>;
  export const ScrollView: React.FC<ScrollViewProps>;
  export const StyleSheet: {
    create: <T extends Record<string, any>>(styles: T) => T;
  };
  export const Animated: any;
}

declare module 'react-native-web';
