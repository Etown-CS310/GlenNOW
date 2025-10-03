import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import GlassCard from "../components/GlassCard";
import { MaterialIcons } from "@expo/vector-icons";

const projects = [
  {
    id: "1",
    name: "Verizon, 800 N Franklin St",
    developer: "TCC",
    description: "A project by TCC to bring a Verizon store to Watkins Glen, New York.",
    verified: true,
  },
  {
    id: "2",
    name: "Edward Jones, 211 N Franklin St",
    developer: "Erin Shawkey",
    description: "A project by Erin Shawkey to bring an Edward Jones office to Watkins Glen, New York.",
    verified: false,
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GlenNOW</Text>
      <Text style={styles.subtitle}>
        An application developed to provide transparency for development projects.
      </Text>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GlassCard>
            <Text style={styles.projectName}>{item.name}</Text>
            <View style={styles.row}>
              <Text style={styles.developer}>{item.developer}</Text>
              {item.verified && (
                <MaterialIcons name="check-circle" size={18} style={styles.checkmark} />
              )}
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Profile", { project: item })}
            >
              <Text style={styles.buttonText}>View Project</Text>
            </TouchableOpacity>
          </GlassCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#222", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 20 },
  projectName: { fontSize: 20, fontWeight: "bold", color: "#222", marginBottom: 4 },
  developer: { fontSize: 14, color: "#555", marginRight: 6 },
  description: { fontSize: 14, color: "#333", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  checkmark: { color: "orange" },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});