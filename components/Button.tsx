import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'small' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  size = 'default',
  style,
  textStyle,
  ...props 
}) => {
  return (
    <TouchableOpacity
      className={`
        flex-row items-center justify-center rounded-lg active:opacity-80
        ${variant === 'primary' ? 'bg-cta' : ''}
        ${variant === 'secondary' ? 'bg-transparent border-2 border-primary' : ''}
        ${variant === 'outline' ? 'bg-transparent border border-border' : ''}
        ${size === 'default' ? 'h-12 px-6' : ''}
        ${size === 'small' ? 'h-9 px-4' : ''}
        ${size === 'large' ? 'h-14 px-8' : ''}
      `}
      style={style}
      {...props}
    >
      <Text
        className={`
          font-outfit-sb text-center
          ${variant === 'primary' ? 'text-white' : ''}
          ${variant === 'secondary' ? 'text-primary' : ''}
          ${variant === 'outline' ? 'text-foreground' : ''}
          ${size === 'small' ? 'text-sm' : 'text-base'}
        `}
        style={textStyle}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
