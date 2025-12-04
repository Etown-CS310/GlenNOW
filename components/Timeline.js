import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Timeline({ createdAt, updatedAt, darkMode = false }) {
  const created = new Date(createdAt);
  const updated = new Date(updatedAt || createdAt);

  function fmt(d) {
    return d.toLocaleString();
  }

  const colors = {
    dot: darkMode ? "#fff" : "#333",
    dotEnd: darkMode ? "#aaa" : "#666",
    label: darkMode ? "#ccc" : "#333",
    time: darkMode ? "#fff" : "#111",
    connector: darkMode ? "#555" : "#ddd"
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: colors.dot }]} />
        <View>
          <Text style={[styles.label, { color: colors.label }]}>Created</Text>
          <Text style={[styles.time, { color: colors.time }]}>{fmt(created)}</Text>
        </View>
      </View>

      <View style={[styles.connector, { borderLeftColor: colors.connector }]} />

      <View style={styles.row}>
        <View style={[styles.dot, styles.dotEnd, { backgroundColor: colors.dotEnd }]} />
        <View>
          <Text style={[styles.label, { color: colors.label }]}>Last edited</Text>
          <Text style={[styles.time, { color: colors.time }]}>{fmt(updated)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 16 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dot: { width: 10, height: 10, marginRight: 10 },
  dotEnd: {},
  label: { fontSize: 12, fontFamily: "Arial" },
  time: { fontSize: 13, fontWeight: "700", fontFamily: "Arial" },
  connector: { height: 20, borderLeftWidth: 2, marginLeft: 5, marginBottom: 6 }
});