import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <View
      className="bg-background rounded-xl p-6 shadow-md"
      style={style}
      {...props}
    >
      {children}
    </View>
  );
};
