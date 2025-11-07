// components/ProjectForm.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProjectForm({ initial = null, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail || "");
  const [sources, setSources] = useState(initial?.sources || []);
  const [sourceText, setSourceText] = useState("");
  const [images, setImages] = useState(initial?.images || []);
  const [imageUrl, setImageUrl] = useState("");

  async function pickImageFromDevice() {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const uri = res.assets[0].uri;
        setImages([uri, ...images]);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Image error", "Could not pick image.");
    }
  }

  function addImageUrl() {
    const s = imageUrl.trim();
    if (!s) return;
    setImages([s, ...images]);
    setImageUrl("");
  }

  function addSource() {
    const s = sourceText.trim();
    if (!s) return;
    if (!/^https?:\/\//i.test(s)) {
      Alert.alert("Validation", "Include http:// or https://");
      return;
    }
    setSources([s, ...sources]);
    setSourceText("");
  }

  function removeSource(idx) {
    setSources(sources.filter((_, i) => i !== idx));
  }

  function removeImage(idx) {
    setImages(images.filter((_, i) => i !== idx));
  }

  function handleSave() {
    if (!title.trim()) {
      Alert.alert("Validation", "Please enter a title.");
      return;
    }
    const project = {
      id: initial?.id || String(Date.now()),
      title: title.trim(),
      description: description.trim(),
      contactEmail: contactEmail.trim(),
      sources,
      images,
      createdAt: initial?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verified: initial?.verified || false,
      inactive: initial?.inactive || false,
      tag: initial?.tag
    };
    onSubmit(project);
  }

  return (
    <ScrollView style={styles.wrapper}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Project title" />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.big]}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        multiline
      />

      <Text style={styles.label}>Images</Text>
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <TouchableOpacity onPress={pickImageFromDevice} style={styles.iconBtn}>
          <MaterialIcons name="photo-library" size={20} color="#000" />
        </TouchableOpacity>
        <TextInput placeholder="Image URL" value={imageUrl} onChangeText={setImageUrl} style={[styles.input, { flex: 1 }]} />
        <TouchableOpacity onPress={addImageUrl} style={[styles.btn, styles.blackBtn]}>
          <Text style={styles.whiteText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
        {images.map((uri, i) => (
          <View key={i} style={{ marginRight: 8, marginBottom: 8 }}>
            <Image source={{ uri }} style={{ width: 90, height: 65, borderWidth: 1, borderColor: "#000" }} />
            <TouchableOpacity onPress={() => removeImage(i)} style={{ marginTop: 6 }}>
              <Text style={{ color: "#111" }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Contact Email</Text>
      <TextInput style={styles.input} value={contactEmail} onChangeText={setContactEmail} placeholder="dev@example.com" />

      <Text style={styles.label}>Sources</Text>
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <TextInput placeholder="https://..." value={sourceText} onChangeText={setSourceText} style={[styles.input, { flex: 1 }]} />
        <TouchableOpacity onPress={addSource} style={[styles.btn, styles.blackBtn]}>
          <Text style={styles.whiteText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 8 }}>
        {sources.map((s, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6
            }}
          >
            <Text style={{ color: "#111", width: "85%" }}>{s}</Text>
            <TouchableOpacity onPress={() => removeSource(i)} style={[styles.btn, styles.whiteBtn]}>
              <Text style={styles.blackText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
        <TouchableOpacity onPress={onCancel} style={[styles.btn, styles.whiteBtn]}>
          <Text style={styles.blackText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={[styles.btn, styles.blackBtn]}>
          <Text style={styles.whiteText}>Save Project</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    marginBottom: 12
  },
  label: {
    color: "#111",
    marginBottom: 6,
    fontSize: 13,
    fontFamily: "Arial"
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    borderRadius: 0,
    marginBottom: 8,
    fontFamily: "Arial"
  },
  big: { height: 90, textAlignVertical: "top" },
  iconBtn: {
    backgroundColor: "#fff",
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center"
  },
  btn: { paddingVertical: 8, paddingHorizontal: 12 },
  blackBtn: { backgroundColor: "#000", borderWidth: 1, borderColor: "#000" },
  whiteBtn: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#000" },
  whiteText: { color: "#fff", fontWeight: "700", fontFamily: "Arial" },
  blackText: { color: "#000", fontWeight: "700", fontFamily: "Arial" }
});