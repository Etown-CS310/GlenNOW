// storage/settingsStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const BANNER_KEY = "@glen_banner_v1";

export async function saveBanner(banner) {
  try {
    await AsyncStorage.setItem(BANNER_KEY, JSON.stringify(banner || {}));
  } catch (e) {
    console.error("saveBanner error", e);
    throw e;
  }
}

export async function loadBanner() {
  try {
    const json = await AsyncStorage.getItem(BANNER_KEY);
    if (!json) return { text: "", color: "#cccccc" };
    return JSON.parse(json);
  } catch (e) {
    console.error("loadBanner error", e);
    return { text: "", color: "#cccccc" };
  }
}