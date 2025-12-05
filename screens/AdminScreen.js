// screens/AdminScreen.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { loadProjects, saveProjects } from "../storage/projectStorage";
import { loadBanner, saveBanner } from "../storage/settingsStorage";
import ProjectForm from "../components/ProjectForm";
import GlassCard from "../components/GlassCard";

const { width: screenWidth } = Dimensions.get("window");
const scale = screenWidth / 375;

export default function AdminScreen({ navigation, route }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [banner, setBanner] = useState({ text: "", color: "#cccccc" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const p = await loadProjects();
      const b = await loadBanner();
      if (mounted) {
        setProjects(p || []);
        setBanner(b || { text: "", color: "#cccccc" });
      }
      if (route.params?.editProject) {
        setEditing(route.params.editProject);
        setShowForm(true);
        navigation.setParams({ editProject: null });
      }
    })();
    return () => (mounted = false);
  }, []);

  async function persist(list) {
    setProjects(list);
    try {
      await saveProjects(list);
    } catch (e) {
      Alert.alert("Error", "Could not save projects.");
    }
  }

  function tryLogin() {
    if (user === "ECON_ADMIN" && pass === "123") {
      setLoggedIn(true);
      setPass("");
    } else {
      Alert.alert("Unauthorized", "Incorrect username or password.");
    }
  }

  function startCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(proj) {
    setEditing(proj);
    setShowForm(true);
  }

  async function handleSubmit(project) {
    const exists = projects.find((p) => p.id === project.id);
    const newList = exists
      ? projects.map((p) =>
          p.id !== project.id
            ? p
            : { ...project, tag: p.tag === "NEW" ? undefined : p.tag, inactive: p.inactive || false }
        )
      : [{ ...project, tag: "NEW", inactive: false }, ...projects];
    await persist(newList);
    setShowForm(false);
    setEditing(null);
  }

  async function confirmDelete(proj) {
    Alert.alert("Delete project", `Delete "${proj.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const list = (await loadProjects()) || [];
          const newList = list.filter((p) => p.id !== proj.id);
          await persist(newList);
        },
      },
    ]);
  }

  async function toggleInactive(proj) {
    const list = (await loadProjects()) || [];
    const newList = list.map((p) =>
      p.id !== proj.id ? p : { ...p, inactive: !p.inactive, tag: !p.inactive ? "Inactive" : undefined }
    );
    await persist(newList);
  }

  async function saveBannerAndKeep(b) {
    setBanner(b);
    try {
      await saveBanner(b);
      Alert.alert("Saved", "Banner updated.");
    } catch (e) {
      Alert.alert("Error", "Could not save banner.");
    }
  }

  if (!loggedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <GlassCard>
            <Text style={[styles.h1, { fontSize: 22 * scale }]}>Admin Panel</Text>

            <View style={{ height: 12 * scale }} />

            <TextInput
              placeholder="Username"
              value={user}
              onChangeText={setUser}
              style={[styles.input, { fontSize: 14 * scale }]}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              value={pass}
              onChangeText={setPass}
              style={[styles.input, { fontSize: 14 * scale }]}
              secureTextEntry
            />

            <View style={{ flexDirection: "row", justifyContent: "flex-end", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btn, styles.whiteBtn]}>
                <Text style={styles.blackText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={tryLogin} style={[styles.btn, styles.blackBtn]}>
                <Text style={styles.whiteText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLoggedIn(true)} style={[styles.btn, styles.redBtn]}>
                <Text style={styles.whiteText}>BYPASS</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: "#666", marginTop: 10, fontSize: 12 * scale }}>Use credentials: ECON_ADMIN / 123</Text>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 * scale, flexWrap: "wrap" }}>
          <Text style={[styles.h1, { fontSize: 22 * scale }]}>Admin Panel</Text>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <TouchableOpacity onPress={startCreate} style={[styles.iconBtn, styles.blackBtn]}>
              <MaterialIcons name="add" size={18 * scale} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setLoggedIn(false); navigation.goBack(); }} style={[styles.iconBtn, styles.whiteBtn]}>
              <MaterialIcons name="logout" size={18 * scale} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <GlassCard>
          <Text style={[styles.label, { fontSize: 14 * scale }]}>Banner Text</Text>
          <TextInput
            value={banner.text}
            onChangeText={(t) => setBanner({ ...banner, text: t })}
            style={[styles.input, { fontSize: 14 * scale }]}
            placeholder="Banner message"
          />
          <Text style={[styles.label, { fontSize: 14 * scale }]}>Banner Color (hex)</Text>
          <TextInput
            value={banner.color}
            onChangeText={(c) => setBanner({ ...banner, color: c })}
            style={[styles.input, { fontSize: 14 * scale }]}
            placeholder="#cccccc"
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8 * scale, flexWrap: "wrap" }}>
            <TouchableOpacity onPress={() => saveBannerAndKeep(banner)} style={[styles.btn, styles.blackBtn]}>
              <Text style={styles.whiteText}>Save Banner</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {showForm ? (
          <ProjectForm initial={editing} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditing(null); }} />
        ) : (
          <FlatList
            data={projects}
            keyExtractor={(p) => p.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <GlassCard>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <View>
                    <Text style={{ color: "#111", fontWeight: "700", fontSize: 16 * scale }}>{item.title}</Text>
                    <Text style={{ color: "#666", marginTop: 4, fontSize: 12 * scale }}>{item.contactEmail || "No contact"}</Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    <TouchableOpacity onPress={() => startEdit(item)} style={[styles.iconBtn, styles.blackBtn]}>
                      <MaterialIcons name="edit" size={16 * scale} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmDelete(item)} style={[styles.iconBtn, styles.whiteBtn]}>
                      <MaterialIcons name="delete" size={16 * scale} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleInactive(item)} style={[styles.iconBtn, item.inactive ? styles.whiteBtn : styles.blackBtn]}>
                      <Text style={item.inactive ? styles.blackText : styles.whiteText}>{item.inactive ? "Activate" : "Mark inactive"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassCard>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 20, paddingTop: 40 }, // push everything down from notifications
  h1: { color: "#111", fontWeight: "900", fontFamily: "Arial" },
  input: { backgroundColor: "#fff", color: "#000", borderWidth: 1, borderColor: "#000", padding: 8, borderRadius: 4, marginBottom: 8, fontFamily: "Arial" },
  btn: { paddingVertical: 8, paddingHorizontal: 12, marginBottom: 8 },
  blackBtn: { backgroundColor: "#000", borderWidth: 1, borderColor: "#000" },
  whiteBtn: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#000" },
  redBtn: { backgroundColor: "#c00", borderWidth: 1, borderColor: "#900" },
  whiteText: { color: "#fff", fontWeight: "700", fontFamily: "Arial" },
  blackText: { color: "#000", fontWeight: "700", fontFamily: "Arial" },
  label: { color: "#111", marginBottom: 6, fontFamily: "Arial" },
  iconBtn: { padding: 8, borderRadius: 4 }
});