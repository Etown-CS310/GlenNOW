// components/Timeline.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Timeline({ createdAt, updatedAt }) {
  const created = new Date(createdAt);
  const updated = new Date(updatedAt || createdAt);
  function fmt(d) {
    return d.toLocaleString();
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <View style={styles.dot} />
        <View>
          <Text style={styles.label}>Created</Text>
          <Text style={styles.time}>{fmt(created)}</Text>
        </View>
      </View>

      <View style={styles.connector} />

      <View style={styles.row}>
        <View style={[styles.dot, styles.dotEnd]} />
        <View>
          <Text style={styles.label}>Last edited</Text>
          <Text style={styles.time}>{fmt(updated)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 16 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dot: { width: 10, height: 10, backgroundColor: "#333", marginRight: 10 },
  dotEnd: { backgroundColor: "#666" },
  label: { fontSize: 12, color: "#333", fontFamily: "Arial" },
  time: { fontSize: 13, color: "#111", fontWeight: "700", fontFamily: "Arial" },
  connector: { height: 20, borderLeftWidth: 2, borderLeftColor: "#ddd", marginLeft: 5, marginBottom: 6 }
});