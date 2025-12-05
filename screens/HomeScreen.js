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
import RequestModal from "../components/RequestModal";

const { width } = Dimensions.get("window");
const scale = width / 375;

export default function HomeScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [banner, setBanner] = useState({ text: "", color: "#cccccc" });
  const [darkMode, setDarkMode] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

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
      {banner.text && (
        <View style={[styles.banner, { backgroundColor: banner.color }]}>
          <Text style={styles.bannerText}>{banner.text}</Text>
        </View>
      )}

      {/* App Title */}
      <Text style={[styles.title, darkMode && styles.textDark]}>GlenNOW</Text>
      <Text style={[styles.subtitle, darkMode && styles.textDark]}>
        Explore projects in Watkins Glen.
      </Text>

      {/* Submit Project Button */}
      <TouchableOpacity
        style={[styles.submitBtn, { marginBottom: 12 }]}
        onPress={() => setShowSubmitModal(true)}
      >
        <Text style={styles.whiteText}>Submit a Project</Text>
      </TouchableOpacity>

      {/* Projects List */}
      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <GlassCard style={[darkMode && styles.cardDark, { padding: 12 }]}>
            {/* Tags */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 6 }}>
              {item.tag === "NEW" && (
                <View style={[styles.statusTag, darkMode && styles.statusTagDark]}>
                  <Text style={[styles.statusText, darkMode && styles.statusTextDark]}>New</Text>
                </View>
              )}
              {item.inactive && (
                <View style={[styles.statusTagInactive, darkMode && styles.statusTagInactiveDark]}>
                  <Text style={[styles.statusText, darkMode && styles.statusTextDark]}>Inactive</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Project", { project: item })}
              style={{ flex: 1 }}
            >
              <Text style={[styles.projectTitle, darkMode && styles.textDark]}>{item.title}</Text>
              <Text style={[styles.projectDesc, darkMode && styles.textDark]}>
                {item.description || "No description provided."}
              </Text>
            </TouchableOpacity>
          </GlassCard>
        )}
      />

      <RequestModal
        visible={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={() => alert("Project request submitted!")}
        title="Submit a Project"
        fields={[
          { name: "title", label: "Project Title", placeholder: "Enter project title" },
          { name: "description", label: "Description", placeholder: "Enter description", multiline: true },
          { name: "sources", label: "Sources (comma-separated URLs)", placeholder: "http://..." },
          { name: "contactEmail", label: "Your Email", placeholder: "Enter your email" },
          { name: "images", label: "Images (comma-separated URLs)", placeholder: "http://..." },
        ]}
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
  submitBtn: { backgroundColor: "#000", padding: 10, borderRadius: 6, alignItems: "center" },
  whiteText: { color: "#fff", fontWeight: "700" },
  projectTitle: { fontSize: 18 * scale, fontWeight: "700", color: "#111", marginBottom: 4 },
  projectDesc: { fontSize: 12 * scale, color: "#666" },
  textDark: { color: "#fff" },
  cardDark: { backgroundColor: "#222", borderColor: "#555" },

  // Tag Styles
  statusTag: {
    backgroundColor: "#ffcc00",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  statusTagInactive: {
    backgroundColor: "#ccc",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  statusText: { fontSize: 10, fontWeight: "700", color: "#111" },
  statusTagDark: { backgroundColor: "#ffaa00" },
  statusTagInactiveDark: { backgroundColor: "#555" },
  statusTextDark: { color: "#fff" },
});