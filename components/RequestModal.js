// components/RequestModal.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ADMIN_EMAIL = "lafaceg@etown.edu";

export default function RequestModal({ visible, onClose, onSubmit, title, fields }) {
  const [values, setValues] = useState(
    fields.reduce((acc, f) => ({ ...acc, [f.name]: f.value || "" }), {})
  );

  const handleChange = (name, val) => setValues({ ...values, [name]: val });

  const handleSend = async () => {
    const timestamp = new Date().toISOString();

    // URL validation
    for (let f of fields) {
      if (f.type === "url" && values[f.name] && !values[f.name].startsWith("http")) {
        return Alert.alert("Invalid URL", `${f.label} must start with http or https`);
      }
    }

    const requestData = { ...values, timestamp, type: title };

    try {
      // Save locally
      const stored = await AsyncStorage.getItem("@requests");
      const list = stored ? JSON.parse(stored) : [];
      list.push(requestData);
      await AsyncStorage.setItem("@requests", JSON.stringify(list));

      // Send email using React Native Linking
      const body = Object.entries(requestData)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join("\n");

      const mailto = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
      const supported = await Linking.canOpenURL(mailto);
      if (supported) {
        Linking.openURL(mailto);
      } else {
        Alert.alert("Error", "Could not open email app.");
      }

      onSubmit();
      onClose();
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Could not submit request.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.title}>{title}</Text>
            {fields.map((f, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput
                  placeholder={f.placeholder || ""}
                  value={values[f.name]}
                  onChangeText={(t) => handleChange(f.name, t)}
                  style={styles.input}
                  multiline={f.multiline || false}
                />
              </View>
            ))}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity onPress={onClose} style={[styles.btn, styles.whiteBtn]}>
                <Text style={styles.blackText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSend} style={[styles.btn, styles.blackBtn]}>
                <Text style={styles.whiteText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "#00000099", justifyContent: "center", padding: 16 },
  modal: { backgroundColor: "#fff", borderRadius: 8, padding: 16, maxHeight: "90%" },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#aaa", borderRadius: 6, padding: 8, marginTop: 4 },
  btn: { padding: 10, borderRadius: 6, minWidth: 100, alignItems: "center" },
  whiteBtn: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#000" },
  blackBtn: { backgroundColor: "#000" },
  whiteText: { color: "#fff", fontWeight: "700" },
  blackText: { color: "#000", fontWeight: "700" },
});