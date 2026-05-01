import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-work-sans-md text-foreground mb-1.5 ml-1">{label}</Text>}
      <TextInput
        className={`
          h-12 bg-white border border-border rounded-lg px-4 
          text-base text-foreground font-work-sans focus:border-primary
          ${error ? 'border-red-500' : ''}
        `}
        placeholderTextColor="#0C4A6E80"
        style={style}
        {...props}
      />
      {error && <Text className="text-sm text-red-500 mt-1.5 ml-1 font-work-sans">{error}</Text>}
    </View>
  );
};
