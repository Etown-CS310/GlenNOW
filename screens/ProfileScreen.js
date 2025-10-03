import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GlassCard from "../components/GlassCard";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation, route }) {
  const { project } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#555" />
      </TouchableOpacity>

      <GlassCard>
        <Text style={styles.projectTitle}>{project.name}</Text>
        <View style={styles.row}>
          <Text style={styles.projectDeveloper}>{project.developer}</Text>
          {project.verified && (
            <MaterialIcons name="check-circle" size={18} style={styles.checkmark} />
          )}
        </View>
        <Text style={styles.projectDescription}>{project.description}</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", padding: 20 },
  backButton: { marginBottom: 10 },
  projectTitle: { fontSize: 24, fontWeight: "bold", color: "#222", marginBottom: 8 },
  projectDeveloper: { fontSize: 16, color: "#555", marginRight: 6 },
  projectDescription: { fontSize: 14, color: "#333", marginTop: 10 },
  row: { flexDirection: "row", alignItems: "center" },
  checkmark: { color: "orange" },
});