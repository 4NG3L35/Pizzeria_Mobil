import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomInputProps extends TextInputProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({ iconName, isPassword, ...props }) => {
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View style={styles.container}>
      {iconName && <Ionicons name={iconName} size={20} color="#888" style={styles.icon} />}
      <TextInput
        style={styles.input}
        secureTextEntry={isSecure}
        placeholderTextColor="#999"
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={styles.eyeIcon}>
          <Ionicons name={isSecure ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    marginLeft: 10,
  },
});
