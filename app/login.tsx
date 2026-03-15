import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { router } from "expo-router";
import { startOAuthLogin } from "@/constants/oauth";

export default function LoginScreen() {
  const colors = useColors();
  const { isAuthenticated, loading } = useAuth({ autoFetch: true });

  // Redirect to tabs if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/(tabs)/setup");
    }
  }, [isAuthenticated, loading]);

  const handleLogin = async () => {
    try {
      await startOAuthLogin();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.foreground, marginTop: 16 }}>
          Carregando...
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1 items-center justify-center p-6">
      <View className="items-center gap-6">
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: colors.foreground,
            textAlign: "center",
          }}
        >
          Simulado Concílio
        </Text>
        
        <Text
          style={{
            fontSize: 16,
            color: colors.muted,
            textAlign: "center",
          }}
        >
          Faça login para começar a estudar
        </Text>

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => ({
            backgroundColor: colors.primary,
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 8,
            marginTop: 24,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text
            style={{
              color: colors.background,
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Fazer Login
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
