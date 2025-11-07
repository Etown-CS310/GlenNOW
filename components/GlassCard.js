// components/GlassCard.js
import React from "react";
import { View, StyleSheet } from "react-native";

export default function GlassCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f3f3f3",
    borderRadius: 0,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dcdcdc"
  }
});