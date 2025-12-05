// screens/ProjectScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Switch,
  Share,
  Alert,
  Linking,
  Dimensions,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { loadProjects, saveProjects } from "../storage/projectStorage";
import Timeline from "../components/Timeline";
import RequestModal from "../components/RequestModal";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const scale = width / 375;

export default function ProjectScreen({ route, navigation }) {
  const { project, isAdmin: initialAdmin } = route.params || { isAdmin: false };
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin] = useState(initialAdmin);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("darkMode");
      setDarkMode(savedTheme === "true");
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    await AsyncStorage.setItem("darkMode", newMode.toString());
  };

  const contactDev = async () => {
    if (!project.contactEmail) return Alert.alert("No contact", "No developer email provided.");
    const mailto = `mailto:${project.contactEmail}`;
    Linking.openURL(mailto).catch(() => Alert.alert("Error", "Could not open mail app."));
  };

  const handleDelete = async () => {
    Alert.alert("Delete", `Delete "${project.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const list = await loadProjects();
            const newList = (list || []).filter((p) => p.id !== project.id);
            await saveProjects(newList);
            navigation.navigate("Home");
          } catch {
            Alert.alert("Error", "Could not delete project.");
          }
        },
      },
    ]);
  };

  const exportProject = async () => {
    try {
      const text = `GlenNOW Project Export\n\nTitle: ${project.title}\n\nDescription:\n${project.description}\n\nContact: ${project.contactEmail}\n\nSources:\n${(project.sources || []).join(
        "\n"
      )}\n\nCreated: ${project.createdAt}\nLast edited: ${project.updatedAt}\n`;
      await Share.share({ message: text, title: `GlenNOW_${project.title}.txt` });
    } catch {
      Alert.alert("Error", "Could not export project.");
    }
  };

  const openSource = (url) => {
    Linking.openURL(url).catch(() => Alert.alert("Error", "Unable to open link."));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top"]} style={[styles.container, darkMode && styles.containerDark]}>
        {/* Top Controls */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <MaterialIcons name="arrow-back" size={28 * scale} color={darkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>

        {/* Request Edit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, { marginBottom: 12 }]}
          onPress={() => setShowEditModal(true)}
        >
          <Text style={styles.whiteText}>Request Edit</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Project Image */}
          {project.images?.length > 0 && (
            <FlatList
              data={project.images}
              horizontal
              pagingEnabled
              keyExtractor={(i, idx) => idx.toString()}
              renderItem={({ item }) => <Image source={{ uri: item }} style={styles.hero} />}
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 0 }}
            />
          )}

          {/* Title & Description directly under image */}
          <View style={styles.content}>
            <Text style={[styles.title, darkMode && styles.textDark]}>{project.title}</Text>
            <Text style={[styles.desc, darkMode && styles.textDark]}>
              {project.description || "No description provided."}
            </Text>

            {/* Sources */}
            <Text style={[styles.label, darkMode && styles.textDark]}>Sources</Text>
            {project.sources?.length ? (
              project.sources.map((s, idx) => (
                <TouchableOpacity key={idx} onPress={() => openSource(s)} style={styles.source}>
                  <MaterialIcons name="check-circle" size={16} color={darkMode ? "#fff" : "#000"} />
                  <Text style={[styles.sourceText, darkMode && styles.textDark]}>{s}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: darkMode ? "#aaa" : "#666", marginBottom: 8 }}>No sources</Text>
            )}

            {/* Contact */}
            <Text style={[styles.label, darkMode && styles.textDark]}>Contact</Text>
            <TouchableOpacity onPress={contactDev} style={[styles.contactBtn, styles.blackBtn]}>
              <MaterialIcons name="email" size={16} color="#fff" />
              <Text style={styles.contactText}>{project.contactEmail || "No contact provided"}</Text>
            </TouchableOpacity>

            {/* Admin Actions */}
            {isAdmin && (
              <View style={{ flexDirection: "row", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                <TouchableOpacity onPress={handleDelete} style={[styles.iconBtn, styles.whiteBtn]}>
                  <MaterialIcons name="delete" size={20 * scale} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={exportProject} style={[styles.iconBtn, styles.blackBtn]}>
                  <MaterialIcons name="file-download" size={20 * scale} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            {/* Timeline moved right after main content */}
            <Timeline createdAt={project.createdAt} updatedAt={project.updatedAt} darkMode={darkMode} />
          </View>
        </ScrollView>

        <RequestModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={() => alert("Edit request submitted!")}
          title={`Edit Request: ${project.title}`}
          fields={[{ name: "message", label: "What should be changed?", placeholder: "Enter your note", multiline: true }]}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  containerDark: { backgroundColor: "#111" },
  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  iconBtn: { padding: 8 },
  hero: { width: width - 32, height: 180 * scale, borderRadius: 6, marginBottom: 2 },
  content: { marginTop: 0 }, // directly under image
  title: { fontSize: 22 * scale, fontWeight: "800", marginBottom: 2, color: "#111" },
  desc: { fontSize: 14 * scale, marginBottom: 4, color: "#111" },
  label: { fontSize: 14 * scale, fontWeight: "700", marginBottom: 2, color: "#111" },
  source: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  sourceText: { fontSize: 14 * scale, marginLeft: 8, textDecorationLine: "underline", color: "#111" },
  contactBtn: { flexDirection: "row", alignItems: "center", padding: 8, borderRadius: 6, marginTop: 2 },
  contactText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
  blackBtn: { backgroundColor: "#000", borderWidth: 1, borderColor: "#000", borderRadius: 6 },
  whiteBtn: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#000", borderRadius: 6 },
  textDark: { color: "#fff" },
  submitBtn: { backgroundColor: "#000", padding: 10, borderRadius: 6, alignItems: "center", marginBottom: 8 },
  whiteText: { color: "#fff", fontWeight: "700" },
});