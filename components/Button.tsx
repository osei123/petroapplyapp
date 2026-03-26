import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'small' | 'large';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
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
        ${variant === 'primary' ? 'bg-primary' : ''}
        ${variant === 'secondary' ? 'bg-muted' : ''}
        ${variant === 'outline' ? 'border border-primary bg-white' : ''}
        ${size === 'default' ? 'h-12 px-6' : ''}
        ${size === 'small' ? 'h-9 px-4' : ''}
        ${size === 'large' ? 'h-14 px-8' : ''}
      `}
      style={style as any}
      {...props}
    >
      <Text
        className={`
          font-semibold text-center
          ${variant === 'primary' ? 'text-white' : ''}
          ${variant === 'secondary' ? 'text-foreground' : ''}
          ${variant === 'outline' ? 'text-primary' : ''}
          ${size === 'small' ? 'text-sm' : 'text-base'}
        `}
        style={textStyle as any}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
