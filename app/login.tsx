import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { startOAuthLogin, getApiBaseUrl } from "@/constants/oauth";
import * as Auth from "@/lib/_core/auth";
import { Platform } from "react-native";

export default function LoginScreen() {
  const colors = useColors();
  const { isAuthenticated, loading, refresh } = useAuth({ autoFetch: true });
  const [devLoading, setDevLoading] = useState(false);

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

  const handleDevLogin = async () => {
    try {
      setDevLoading(true);
      const apiBaseUrl = getApiBaseUrl();

      // Try simple POST request first
      const response = await fetch(`${apiBaseUrl}/api/dev/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: "test@example.com",
          name: "Test User",
        }),
      });

      console.log("[DevLogin] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[DevLogin] Error response:", errorText);
        throw new Error(`Dev login failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("[DevLogin] Response data:", data);

      // Save user info
      if (data.user) {
        await Auth.setUserInfo({
          id: data.user.id,
          openId: data.user.openId,
          name: data.user.name,
          email: data.user.email,
          loginMethod: data.user.loginMethod,
          lastSignedIn: new Date(data.user.lastSignedIn),
        });
      }

      // Save session token for native
      if (data.app_session_id && Platform.OS !== "web") {
        await Auth.setSessionToken(data.app_session_id);
      }

      // Wait a moment for cookie to be set, then refresh auth
      await new Promise(resolve => setTimeout(resolve, 500));
      await refresh?.();

      console.log("[DevLogin] Login successful, redirecting...");
      router.replace("/(tabs)/setup");
    } catch (error) {
      console.error("[DevLogin] Error:", error);
      Alert.alert(
        "Erro",
        `Falha ao fazer login: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
      setDevLoading(false);
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

        {/* Development login button - only for testing */}
        <Pressable
          onPress={handleDevLogin}
          disabled={devLoading}
          style={({ pressed }) => ({
            backgroundColor: colors.surface,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            marginTop: 12,
            borderWidth: 1,
            borderColor: colors.border,
            opacity: pressed ? 0.7 : devLoading ? 0.6 : 1,
          })}
        >
          {devLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text
              style={{
                color: colors.foreground,
                fontSize: 14,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Login de Desenvolvimento
            </Text>
          )}
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
