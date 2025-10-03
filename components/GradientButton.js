import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GradientButton({ text, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonWrapper}>
      <LinearGradient
        colors={["#7b2ff7", "#f107a3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.text}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: 20,
    width: "70%",
    borderRadius: 25,
    overflow: "hidden",
  },
  button: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 25,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});