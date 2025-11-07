// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  Image
} from "react-native";
import GlassCard from "../components/GlassCard";
import TagPill from "../components/TagPill";
import { loadProjects } from "../storage/projectStorage";
import { loadBanner } from "../storage/settingsStorage";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState({ text: "", color: "#cccccc" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await loadProjects();
      const b = await loadBanner();
      if (mounted) {
        setProjects(data || []);
        setBanner(b || { text: "", color: "#cccccc" });
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  function openProject(p) {
    navigation.navigate("Project", { project: p, isAdmin: false });
  }

  function renderItem({ item }) {
    return (
      <GlassCard style={styles.card}>
        <Pressable onPress={() => openProject(item)} style={styles.press}>
          <View style={styles.row}>
            {item.images && item.images.length > 0 ? (
              <Image source={{ uri: item.images[0] }} style={styles.thumb} />
            ) : (
              <View style={styles.thumbPlaceholder} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.sub}>{item.contactEmail || "No contact"}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
                {item.tag ? <TagPill text={item.tag} /> : null}
              </View>
            </View>
            <View style={{ width: 8 }} />
          </View>
        </Pressable>
      </GlassCard>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.wikiHeader}>
        <Text style={styles.wikiHeaderText}>
          Welcome to GlenNOW — A project archive of Glen’s design and development work.
        </Text>
      </View>

      {banner?.text ? (
        <View style={[styles.banner, { backgroundColor: "#f0f0f0", borderColor: "#dcdcdc" }]}>
          <Text style={styles.bannerText}>{banner.text}</Text>
        </View>
      ) : null}

      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>GlenNOW</Text>
          <Text style={styles.subtitle}>Transparency for Watkins Glen development projects.</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Admin")} style={styles.lock}>
            <MaterialIcons name="lock-outline" size={26} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? <Text style={{ color: "#333" }}>Loading...</Text> : null}

      <FlatList data={projects} keyExtractor={(i) => i.id} renderItem={renderItem} contentContainerStyle={{ paddingTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  wikiHeader: { padding: 8, backgroundColor: "#fff", marginBottom: 8 },
  wikiHeaderText: { textAlign: "center", color: "#333", fontSize: 13, fontFamily: "Arial" },
  banner: { padding: 8, borderRadius: 0, marginBottom: 12, borderWidth: 1 },
  bannerText: { color: "#111", fontWeight: "700", textAlign: "center", fontFamily: "Arial" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  brand: { color: "#111", fontSize: 28, fontWeight: "900", fontFamily: "Arial" },
  subtitle: { color: "#444", marginTop: 4, fontFamily: "Arial" },
  lock: { marginLeft: 12, padding: 6, borderWidth: 1, borderColor: "#000", backgroundColor: "#fff" },
  card: { marginBottom: 12, borderRadius: 0 },
  row: { flexDirection: "row", alignItems: "center" },
  thumb: { width: 80, height: 60, borderWidth: 1, borderColor: "#000", marginRight: 12 },
  thumbPlaceholder: { width: 80, height: 60, borderWidth: 1, borderColor: "#000", marginRight: 12, backgroundColor: "#fff" },
  title: { color: "#111", fontSize: 16, fontWeight: "800", fontFamily: "Arial" },
  sub: { color: "#444", marginTop: 4, fontFamily: "Arial" },
  press: { padding: 6 }
});