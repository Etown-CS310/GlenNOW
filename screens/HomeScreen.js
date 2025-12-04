// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { loadProjects } from "../storage/projectStorage";
import { loadBanner } from "../storage/settingsStorage";
import GlassCard from "../components/GlassCard";

const { width } = Dimensions.get("window");
const scale = width / 375;

export default function HomeScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [banner, setBanner] = useState({ text: "", color: "#cccccc" });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    refreshAll();
  }, []);

  const refreshAll = async () => {
    const list = await loadProjects();
    setProjects(list || []);

    const b = await loadBanner();
    setBanner(b || { text: "", color: "#cccccc" });
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      {/* Top Controls */}
      <View style={styles.topRow}>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
        <TouchableOpacity onPress={() => navigation.navigate("Admin")} style={styles.iconBtn}>
          <MaterialIcons name="shield" size={24 * scale} color={darkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={refreshAll} style={styles.iconBtn}>
          <MaterialIcons name="refresh" size={24 * scale} color={darkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      {banner.text ? (
        <View style={[styles.banner, { backgroundColor: banner.color }]}>
          <Text style={styles.bannerText}>{banner.text}</Text>
        </View>
      ) : null}

      {/* App Title */}
      <Text style={[styles.title, darkMode && styles.textDark]}>GlenNOW</Text>
      <Text style={[styles.subtitle, darkMode && styles.textDark]}>
        Explore projects curated for you
      </Text>

      {/* Projects List */}
      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <GlassCard style={[darkMode && styles.cardDark]}>
            <TouchableOpacity onPress={() => navigation.navigate("Project", { project: item })}>
              <Text style={[styles.projectTitle, darkMode && styles.textDark]}>{item.title}</Text>
              <Text style={[styles.projectDesc, darkMode && styles.textDark]}>
                {item.description || "No description provided."}
              </Text>
            </TouchableOpacity>
          </GlassCard>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  containerDark: { backgroundColor: "#111" },
  topRow: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 12, marginBottom: 16 },
  iconBtn: { padding: 8 },
  banner: { padding: 10, marginBottom: 12, borderRadius: 8 },
  bannerText: { color: "#fff", fontWeight: "700", fontSize: 14 * scale },
  title: { fontSize: 28 * scale, fontWeight: "900", color: "#111", marginBottom: 4 },
  subtitle: { fontSize: 14 * scale, color: "#666", marginBottom: 12 },
  projectTitle: { fontSize: 18 * scale, fontWeight: "700", color: "#111", marginBottom: 4 },
  projectDesc: { fontSize: 12 * scale, color: "#666" },
  textDark: { color: "#fff" },
  cardDark: { backgroundColor: "#222", borderColor: "#555" },
});