import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { startOAuthLogin, getApiBaseUrl } from "@/constants/oauth";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

export default function LoginScreen() {
  const colors = useColors();
  const { isAuthenticated, loading } = useAuth({ autoFetch: true });
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

      if (Platform.OS === "web") {
        // On web, use window.location to trigger redirect with cookie
        const apiBaseUrl = getApiBaseUrl();
        const redirectUrl = window.location.origin;
        const devLoginUrl = `${apiBaseUrl}/api/dev/login?redirect=${encodeURIComponent(redirectUrl)}`;
        console.log("[DevLogin] Redirecting to:", devLoginUrl);
        window.location.href = devLoginUrl;
      } else {
        // On native, open browser for dev login
        const apiBaseUrl = getApiBaseUrl();
        const devLoginUrl = `${apiBaseUrl}/api/dev/login`;
        console.log("[DevLogin] Opening browser for:", devLoginUrl);
        const result = await WebBrowser.openBrowserAsync(devLoginUrl);
        console.log("[DevLogin] Browser result:", result);
      }
    } catch (error) {
      console.error("Dev login error:", error);
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
