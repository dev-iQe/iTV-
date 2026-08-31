import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useAppTheme } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

const ICONS = {
  الرئيسية: "home",
  بحث: "search",
  المفضلة: "heart",
  الإعدادات: "settings",
};

export default function BottomTabs() {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.subtext,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name] || "ellipse"} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="الرئيسية" component={HomeScreen} />
      <Tab.Screen name="بحث" component={SearchScreen} />
      <Tab.Screen name="المفضلة" component={FavoritesScreen} />
      <Tab.Screen name="الإعدادات" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
