// components/Banner.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Banner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>GlenNOW Archive</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: "#cccccc", padding: 10 },
  text: { fontWeight: "bold", textAlign: "center" },
});