import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';

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
        flex-row items-center justify-center rounded-full active:opacity-80
        ${variant === 'primary' ? 'bg-[#0ea5e9]' : ''}
        ${variant === 'secondary' ? 'bg-slate-100' : ''}
        ${variant === 'outline' ? 'border border-[#0ea5e9] bg-white' : ''}
        ${size === 'default' ? 'h-12 px-6' : ''}
        ${size === 'small' ? 'h-9 px-4' : ''}
        ${size === 'large' ? 'h-14 px-8' : ''}
      `}
      style={style}
      {...props}
    >
      <Text
        className={`
          font-semibold text-center
          ${variant === 'primary' ? 'text-white' : ''}
          ${variant === 'secondary' ? 'text-slate-900' : ''}
          ${variant === 'outline' ? 'text-[#0ea5e9]' : ''}
          ${size === 'small' ? 'text-sm' : 'text-base'}
        `}
        style={textStyle}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
