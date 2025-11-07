// screens/AdminScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { loadProjects, saveProjects } from "../storage/projectStorage";
import { loadBanner, saveBanner } from "../storage/settingsStorage";
import ProjectForm from "../components/ProjectForm";
import GlassCard from "../components/GlassCard";

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
    return () => {
      mounted = false;
    };
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
    let newList;
    if (exists) {
      newList = projects.map((p) => {
        if (p.id !== project.id) return p;
        const hadNew = p.tag === "NEW";
        return { ...project, tag: hadNew ? undefined : p.tag, inactive: p.inactive || false };
      });
    } else {
      newList = [{ ...project, tag: "NEW", inactive: false }, ...projects];
    }
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
        }
      }
    ]);
  }

  async function toggleInactive(proj) {
    const list = (await loadProjects()) || [];
    const newList = list.map((p) => {
      if (p.id !== proj.id) return p;
      const nowInactive = !p.inactive;
      return {
        ...p,
        inactive: nowInactive,
        tag: nowInactive ? "Inactive" : undefined
      };
    });
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
      <View style={styles.container}>
        <GlassCard>
          <Text style={styles.h1}>Admin Panel</Text>

          <View style={{ height: 14 }} />

          <TextInput placeholder="Username" value={user} onChangeText={setUser} style={styles.input} autoCapitalize="none" />
          <TextInput placeholder="Password" value={pass} onChangeText={setPass} style={styles.input} secureTextEntry />

          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btn, styles.whiteBtn]}>
              <Text style={styles.blackText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={tryLogin} style={[styles.btn, styles.blackBtn]}>
              <Text style={styles.whiteText}>Login</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ color: "#666", marginTop: 10 }}>Use credentials: ECON_ADMIN / 123</Text>
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text style={styles.h1}>Admin Panel</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity onPress={startCreate} style={[styles.iconBtn, styles.blackBtn]}>
            <MaterialIcons name="add" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setLoggedIn(false); navigation.goBack(); }} style={[styles.iconBtn, styles.whiteBtn]}>
            <MaterialIcons name="logout" size={18} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <GlassCard>
        <Text style={styles.label}>Banner Text</Text>
        <TextInput value={banner.text} onChangeText={(t) => setBanner({ ...banner, text: t })} style={styles.input} placeholder="Banner message" />
        <Text style={styles.label}>Banner Color (hex, shown as background)</Text>
        <TextInput value={banner.color} onChangeText={(c) => setBanner({ ...banner, color: c })} style={styles.input} placeholder="#cccccc" />
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8 }}>
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
          renderItem={({ item }) => (
            <GlassCard>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={{ color: "#111", fontWeight: "700", fontSize: 16 }}>{item.title}</Text>
                  <Text style={{ color: "#666", marginTop: 4 }}>{item.contactEmail || "No contact"}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity onPress={() => startEdit(item)} style={[styles.iconBtn, styles.blackBtn]}>
                    <MaterialIcons name="edit" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDelete(item)} style={[styles.iconBtn, styles.whiteBtn]}>
                    <MaterialIcons name="delete" size={16} color="#000" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  h1: { color: "#111", fontSize: 20, fontWeight: "900", fontFamily: "Arial" },
  input: { backgroundColor: "#fff", color: "#000", borderWidth: 1, borderColor: "#000", padding: 8, borderRadius: 0, marginBottom: 8, fontFamily: "Arial" },
  btn: { paddingVertical: 8, paddingHorizontal: 12 },
  blackBtn: { backgroundColor: "#000", borderWidth: 1, borderColor: "#000" },
  whiteBtn: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#000" },
  whiteText: { color: "#fff", fontWeight: "700", fontFamily: "Arial" },
  blackText: { color: "#000", fontWeight: "700", fontFamily: "Arial" },
  label: { color: "#111", marginBottom: 6, fontFamily: "Arial" },
  iconBtn: { padding: 8, borderRadius: 0 }
});