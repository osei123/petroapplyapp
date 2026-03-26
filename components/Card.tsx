import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <View
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-border/50"
      style={style}
      {...props}
    >
      {children}
    </View>
  );
};
