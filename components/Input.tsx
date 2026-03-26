import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</Text>}
      <TextInput
        className={`
          h-14 bg-slate-50 border border-slate-200 rounded-2xl px-4 
          text-base text-slate-900 focus:border-[#0ea5e9]
          ${error ? 'border-red-500' : ''}
        `}
        placeholderTextColor="#94a3b8"
        style={style}
        {...props}
      />
      {error && <Text className="text-sm text-red-500 mt-1.5 ml-1">{error}</Text>}
    </View>
  );
};
