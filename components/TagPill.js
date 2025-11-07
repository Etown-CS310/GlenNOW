// components/TagPill.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TagPill({ text }) {
  if (!text) return null;
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: "#2B6CB0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 0,
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Arial"
  }
});