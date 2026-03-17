import { View, Text, Pressable, ActivityIndicator } from "react-native";
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
    router.replace("/(tabs)/setup");
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
