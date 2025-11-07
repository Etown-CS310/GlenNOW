// screens/ProjectScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  FlatList,
  Share
} from "react-native";
import GlassCard from "../components/GlassCard";
import Timeline from "../components/Timeline";
import { MaterialIcons } from "@expo/vector-icons";
import { loadProjects, saveProjects } from "../storage/projectStorage";

export default function ProjectScreen({ route, navigation }) {
  const { project, isAdmin } = route.params || { isAdmin: false };

  async function contactDev() {
    if (!project.contactEmail) return Alert.alert("No contact", "No developer email provided.");
    const mailto = `mailto:${project.contactEmail}`;
    Linking.openURL(mailto).catch(() => Alert.alert("Error", "Could not open mail app."));
  }

  async function handleDelete() {
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
          } catch (e) {
            Alert.alert("Error", "Could not delete project.");
          }
        }
      }
    ]);
  }

  async function exportProject() {
    try {
      const text =
        `GlenNOW Project Export\n\nTitle: ${project.title}\n\nDescription:\n${project.description}\n\nContact: ${project.contactEmail}\n\nSources:\n${(project.sources || []).join("\n")}\n\nCreated: ${project.createdAt}\nLast edited: ${project.updatedAt}\n`;
      await Share.share({ message: text, title: `GlenNOW_${project.title}.txt` });
    } catch (e) {
      Alert.alert("Error", "Could not export project.");
    }
  }

  function openSource(url) {
    Linking.openURL(url).catch(() => Alert.alert("Error", "Unable to open link."));
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {isAdmin ? (
            <>
              <TouchableOpacity onPress={() => navigation.navigate("Admin", { editProject: project })} style={[styles.iconBtn, styles.blackBtn]}>
                <MaterialIcons name="edit" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={[styles.iconBtn, styles.whiteBtn]}>
                <MaterialIcons name="delete" size={16} color="#000" />
              </TouchableOpacity>
            </>
          ) : null}

          <TouchableOpacity onPress={exportProject} style={[styles.iconBtn, styles.blackBtn]}>
            <MaterialIcons name="file-download" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <GlassCard>
        {project.images && project.images.length > 0 ? (
          <FlatList
            data={project.images}
            horizontal
            pagingEnabled
            keyExtractor={(i, idx) => idx.toString()}
            renderItem={({ item }) => <Image source={{ uri: item }} style={styles.hero} />}
            showsHorizontalScrollIndicator={false}
          />
        ) : null}

        <Text style={styles.title}>{project.title}</Text>

        <Text style={styles.desc}>{project.description || "No description provided."}</Text>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.label}>Sources</Text>
          {project.sources?.length ? (
            project.sources.map((s, idx) => (
              <TouchableOpacity key={idx} onPress={() => openSource(s)} style={styles.source}>
                <MaterialIcons name="check-circle" size={14} color="#000" />
                <Text style={styles.sourceText}>{s}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: "#666" }}>No sources</Text>
          )}
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.label}>Contact</Text>
          <TouchableOpacity onPress={contactDev} style={[styles.contactBtn, styles.blackBtn]}>
            <MaterialIcons name="email" size={14} color="#fff" />
            <Text style={styles.contactText}>{project.contactEmail || "No contact provided"}</Text>
          </TouchableOpacity>
        </View>

        <Timeline createdAt={project.createdAt} updatedAt={project.updatedAt} />

        {project.inactive ? <Text style={styles.inactiveFooter}>This project is inactive.</Text> : null}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  hero: { width: 320, height: 180, borderWidth: 1, borderColor: "#000", marginRight: 12 },
  title: { color: "#111", fontSize: 20, fontWeight: "800", marginBottom: 6, fontFamily: "Arial" },
  desc: { color: "#111", marginBottom: 8, fontFamily: "Arial" },
  label: { color: "#111", fontSize: 13, marginBottom: 6, fontFamily: "Arial" },
  source: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  sourceText: { color: "#111", marginLeft: 8, textDecorationLine: "underline" },
  contactBtn: { flexDirection: "row", alignItems: "center", padding: 8, borderRadius: 0, marginTop: 6 },
  contactText: { color: "#fff", marginLeft: 8, fontWeight: "700", fontFamily: "Arial" },
  iconBtn: { padding: 8, borderRadius: 0 },
  blackBtn: { backgroundColor: "#000", borderWidth: 1, borderColor: "#000" },
  whiteBtn: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#000" },
  inactiveFooter: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#e0e0e0", color: "#111", fontWeight: "700", fontFamily: "Arial" }
});