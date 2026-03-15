import { View, Text, Pressable, ActivityIndicator, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

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
      if (Platform.OS === "web") {
        // Web: redirect to OAuth login
        const redirectUrl = `${window.location.origin}/oauth/callback`;
        const loginUrl = `${process.env.EXPO_PUBLIC_API_URL || "https://api.manus.im"}/oauth/authorize?redirect_uri=${encodeURIComponent(redirectUrl)}`;
        window.location.href = loginUrl;
      } else {
        // Native: use WebBrowser for OAuth
        const redirectUrl = Linking.createURL("oauth/callback");
        const loginUrl = `${process.env.EXPO_PUBLIC_API_URL || "https://api.manus.im"}/oauth/authorize?redirect_uri=${encodeURIComponent(redirectUrl)}`;
        
        const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUrl);
        
        if (result.type === "success") {
          // OAuth callback will handle token storage
          router.replace("/(tabs)/setup");
        }
      }
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
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 8,
            marginTop: 24,
          }}
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
