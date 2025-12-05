// components/ProjectCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GlassCard from './GlassCard';

export default function ProjectCard({ project, onPress }) {
  return (
    <GlassCard onPress={onPress}>
      <Text style={styles.title}>{project.title}</Text>
      {project.tag && <Text style={styles.tag}>{project.tag}</Text>}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: 'bold', fontSize: 16 },
  tag: { marginTop: 5, fontSize: 12, color: '#0000ff' }
});