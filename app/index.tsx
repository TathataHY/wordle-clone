import Icon from "@/assets/images/wordle-icon.svg";
import SubscribeModal from "@/components/SubscribeModal";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { Link } from "expo-router";
import { useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function Index() {
  const colorScheme = useColorScheme();
  const { signOut } = useAuth();

  const backgroundColor = Colors[colorScheme ?? "light"].background;
  const textColor = Colors[colorScheme ?? "light"].text;

  const subscribeModalRef = useRef<BottomSheetModal>(null);

  const handlePresentSubscribeModal = () => {
    subscribeModalRef.current?.present();
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SubscribeModal ref={subscribeModalRef} />

      <Animated.View entering={FadeInDown} style={styles.header}>
        <Icon width={100} height={70} />
        <ThemedText style={styles.title}>Wordle</ThemedText>
        <ThemedText style={styles.text}>
          Get 6 chances to guess 5-letter word.
        </ThemedText>
      </Animated.View>

      <View style={styles.menu}>
        <Link
          href="/game"
          style={[
            styles.btn,
            {
              backgroundColor: colorScheme === "light" ? "#000" : "#4a4a4a",
            },
          ]}
          asChild
        >
          <AnimatedTouchableOpacity entering={FadeInLeft}>
            <ThemedText style={[styles.btnText, styles.primaryText]}>
              Play
            </ThemedText>
          </AnimatedTouchableOpacity>
        </Link>

        <SignedOut>
          <Link
            href="/login"
            style={[styles.btn, { borderColor: textColor }]}
            asChild
          >
            <AnimatedTouchableOpacity entering={FadeInLeft.delay(100)}>
              <ThemedText style={styles.btnText}>Login</ThemedText>
            </AnimatedTouchableOpacity>
          </Link>
        </SignedOut>

        <SignedIn>
          <AnimatedTouchableOpacity
            onPress={() => signOut()}
            entering={FadeInLeft.delay(100)}
            style={[styles.btn, { borderColor: textColor }]}
          >
            <ThemedText style={styles.btnText}>Sign Out</ThemedText>
          </AnimatedTouchableOpacity>
        </SignedIn>

        <AnimatedTouchableOpacity
          onPress={handlePresentSubscribeModal}
          entering={FadeInLeft.delay(200)}
          style={[styles.btn, { borderColor: textColor }]}
        >
          <ThemedText style={styles.btnText}>Subscribe</ThemedText>
        </AnimatedTouchableOpacity>
      </View>

      <Animated.View entering={FadeIn.delay(300)} style={styles.footer}>
        <ThemedText style={styles.footerDate}>
          {format(new Date(), "MMMM d, yyyy")}
        </ThemedText>
        <ThemedText style={styles.footerText}>No. 1151</ThemedText>
        <ThemedText style={styles.footerText}>Edited by Simon Grimm</ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 50,
    gap: 40,
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: "FrankRuhlLibre_800ExtraBold",
  },
  text: {
    fontSize: 26,
    textAlign: "center",
    fontFamily: "FrankRuhlLibre_500Medium",
  },
  menu: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
  },
  footerDate: {
    fontSize: 12,
    fontWeight: "bold",
  },
  btn: {
    justifyContent: "center",
    borderRadius: 30,
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 1,
    width: "60%",
    maxWidth: 200,
  },
  btnText: {
    padding: 14,
    fontSize: 16,
    fontWeight: "semibold",
    color: "#333",
  },
  primaryText: {
    color: "#fff",
  },
});
