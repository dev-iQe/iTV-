import React from "react";
import { View, Text, Image, StyleSheet, Linking, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAppTheme } from "../context/ThemeContext";

// عدّل هذه البيانات ببياناتك
const DEVELOPER = {
  name: "اسم المطوّر",
  bio: "مطوّر تطبيقات موبايل",
  avatar: "https://picsum.photos/seed/dev/200/200",
  email: "you@example.com",
  website: "https://example.com",
  version: "1.0.0",
};

export default function DeveloperScreen() {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: DEVELOPER.avatar }} style={styles.avatar} />
      </View>
      <Text style={[styles.name, { color: theme.text }]}>{DEVELOPER.name}</Text>
      <Text style={[styles.bio, { color: theme.subtext }]}>{DEVELOPER.bio}</Text>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL(`mailto:${DEVELOPER.email}`)}
        >
          <Ionicons name="mail-outline" size={18} color={theme.text} />
          <Text style={[styles.rowText, { color: theme.text }]}>{DEVELOPER.email}</Text>
        </TouchableOpacity>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL(DEVELOPER.website)}
        >
          <Ionicons name="globe-outline" size={18} color={theme.text} />
          <Text style={[styles.rowText, { color: theme.text }]}>{DEVELOPER.website}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.version, { color: theme.subtext }]}>
        إصدار التطبيق {DEVELOPER.version}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 40 },
  avatarWrap: { width: 96, height: 96, borderRadius: 48, overflow: "hidden", marginBottom: 14 },
  avatar: { width: "100%", height: "100%" },
  name: { fontSize: 20, fontWeight: "800" },
  bio: { fontSize: 13, marginTop: 4, marginBottom: 20 },
  card: { width: "88%", borderRadius: 12, overflow: "hidden" },
  row: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 14 },
  rowText: { fontSize: 14 },
  divider: { height: 1, marginHorizontal: 14 },
  version: { marginTop: 30, fontSize: 12 },
});
