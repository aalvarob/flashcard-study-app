import { View, Text, Pressable, ActivityIndicator, InteractionManager } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { router } from "expo-router";

import { startOAuthLogin } from "@/constants/oauth";

export default function LoginScreen() {
  const colors = useColors();

  // Skip authentication check and go directly to tabs
  useEffect(() => {
    // Use InteractionManager to ensure Root Layout is mounted
    const task = InteractionManager.runAfterInteractions(() => {
      router.replace("/(tabs)/setup");
    });
    return () => task.cancel();
  }, []);

  // No login needed - redirecting automatically
  return (
    <ScreenContainer className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.foreground, marginTop: 16 }}>
        Carregando...
      </Text>
    </ScreenContainer>
  );
}
