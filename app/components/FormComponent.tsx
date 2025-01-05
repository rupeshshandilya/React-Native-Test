import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { FC } from "react";

interface FormComponentProps {
    value: string;
    onChangeText: (text: string) => void;
    label: string;
}

const FormComponent:FC<FormComponentProps> = ({
    value,
    onChangeText,
    label
}) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});

export default FormComponent;
