import Logo from "@/assets/images/nyt-logo.svg";
import { Colors } from "@/constants/colors";
import { tokenCache } from "@/utils/cache";
import { storage } from "@/utils/storage";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import {
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_900Black,
  useFonts,
} from "@expo-google-fonts/frank-ruhl-libre";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import {
  Appearance,
  LogBox,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMMKVBoolean } from "react-native-mmkv";

LogBox.ignoreAllLogs();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  const [dark] = useMMKVBoolean("dark-mode", storage);

  const router = useRouter();
  const colorScheme = useColorScheme();
  let [fontsLoaded] = useFonts({
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_900Black,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  React.useEffect(() => {
    if (Platform.OS !== "web") {
      Appearance.setColorScheme(dark ? "dark" : "light");
    }
  }, [dark]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="login"
                  options={{
                    presentation: "modal",
                    headerShadowVisible: false,
                    headerTitle: () => <Logo width={150} height={40} />,
                    headerLeft: () => (
                      <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons
                          name="close"
                          size={26}
                          color={Colors.light.gray}
                        />
                      </TouchableOpacity>
                    ),
                  }}
                />
                <Stack.Screen
                  name="game"
                  options={{
                    headerBackTitle: "Wordle",
                    headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
                    headerBackTitleStyle: {
                      fontSize: 26,
                      fontFamily: "FrankRuhlLibre_800ExtraBold",
                    },
                    title: "",
                  }}
                />
                <Stack.Screen
                  name="end"
                  options={{
                    presentation: "fullScreenModal",
                    headerShadowVisible: false,
                    title: "",
                  }}
                />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
