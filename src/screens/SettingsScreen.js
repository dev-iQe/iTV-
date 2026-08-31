import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAppTheme } from "../context/ThemeContext";

const OPTIONS = [
  { key: "dark", label: "داكن", icon: "moon" },
  { key: "light", label: "فاتح", icon: "sunny" },
];

export default function SettingsScreen({ navigation }) {
  const { theme, mode, setMode } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>الإعدادات</Text>

      <Text style={[styles.sectionLabel, { color: theme.subtext }]}>المظهر</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        {OPTIONS.map((opt, idx) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setMode(opt.key)}
            style={[
              styles.row,
              idx !== OPTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
            ]}
          >
            <Ionicons
              name={mode === opt.key ? "checkmark-circle" : "ellipse-outline"}
              size={20}
              color={mode === opt.key ? theme.accent : theme.subtext}
            />
            <View style={styles.rowTextWrap}>
              <Ionicons name={opt.icon} size={18} color={theme.text} />
              <Text style={[styles.rowText, { color: theme.text }]}>{opt.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { color: theme.subtext, marginTop: 24 }]}>عام</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("Developer")}>
          <Ionicons name="chevron-back" size={18} color={theme.subtext} />
          <View style={styles.rowTextWrap}>
            <Ionicons name="code-slash" size={18} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>عن المطوّر</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 24, fontWeight: "800", textAlign: "right", padding: 16 },
  sectionLabel: { fontSize: 13, textAlign: "right", marginHorizontal: 16, marginBottom: 8 },
  card: { marginHorizontal: 16, borderRadius: 12, overflow: "hidden" },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  rowTextWrap: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  rowText: { fontSize: 15, fontWeight: "600" },
});
