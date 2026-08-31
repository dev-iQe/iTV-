import React from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";
import DetailsScreen from "../screens/DetailsScreen";
import PlayerScreen from "../screens/PlayerScreen";
import DeveloperScreen from "../screens/DeveloperScreen";
import { useAppTheme } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { theme, mode } = useAppTheme();

  const navTheme = {
    ...(mode === "light" ? DefaultTheme : DarkTheme),
    colors: {
      ...(mode === "light" ? DefaultTheme.colors : DarkTheme.colors),
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      primary: theme.accent,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={BottomTabs} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{ presentation: "fullScreenModal", animation: "fade" }}
        />
        <Stack.Screen
          name="Developer"
          component={DeveloperScreen}
          options={{ headerShown: true, title: "عن المطوّر", headerBackTitle: "رجوع" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
