import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type OnScreenKeyboardProps = {
  onKeyPress: (key: string) => void;
  greenLetters: string[];
  yellowLetters: string[];
  grayLetters: string[];
};

export const ENTER = "ENTER";
export const BACKSPACE = "BACKSPACE";

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  [ENTER, "z", "x", "c", "v", "b", "n", "m", BACKSPACE],
];

const OnScreenKeyboard = ({
  onKeyPress,
  greenLetters,
  yellowLetters,
  grayLetters,
}: OnScreenKeyboardProps) => {
  const { width } = useWindowDimensions();

  const keyWidth = Platform.OS === "web" ? 58 : (width - 60) / keys[0].length;
  const keyHeight = 60;

  const isSpecialKey = (key: string) => {
    return key === ENTER || key === BACKSPACE;
  };
  const isInLetters = (key: string) => {
    return (
      greenLetters.includes(key) ||
      yellowLetters.includes(key) ||
      grayLetters.includes(key)
    );
  };

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key, colIndex) => (
            <Pressable
              key={`key-${rowIndex}-${colIndex}`}
              onPress={() => onKeyPress(key)}
              style={({ pressed }) => [
                styles.key,
                { width: keyWidth, height: keyHeight, backgroundColor: "#ddd" },
                isSpecialKey(key) && { width: keyWidth * 1.5 },
                {
                  backgroundColor: greenLetters.includes(key)
                    ? Colors.light.green
                    : yellowLetters.includes(key)
                    ? Colors.light.yellow
                    : grayLetters.includes(key)
                    ? Colors.light.gray
                    : "#ddd",
                },
                pressed && { backgroundColor: "#868686" },
              ]}
            >
              <Text
                style={[
                  styles.keyText,
                  key === ENTER && { fontSize: 12 },
                  isInLetters(key) && { color: "#fff" },
                ]}
              >
                {isSpecialKey(key) ? (
                  key === ENTER ? (
                    ENTER
                  ) : (
                    <Ionicons
                      name="backspace-outline"
                      size={24}
                      color="black"
                    />
                  )
                ) : (
                  key
                )}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

export default OnScreenKeyboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    gap: 4,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
  },
  key: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  keyText: {
    fontWeight: "bold",
    fontSize: 20,
    textTransform: "uppercase",
  },
});
