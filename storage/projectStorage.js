// storage/projectStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROJECTS_KEY = "@glen_projects_v1";

export async function saveProjects(projects) {
  try {
    await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(projects || []));
  } catch (e) {
    console.error("saveProjects error", e);
    throw e;
  }
}

export async function loadProjects() {
  try {
    const json = await AsyncStorage.getItem(PROJECTS_KEY);
    if (!json) return [];
    return JSON.parse(json);
  } catch (e) {
    console.error("loadProjects error", e);
    return [];
  }
}