import OnScreenKeyboard, {
  BACKSPACE,
  ENTER,
} from "@/components/OnScreenKeyboard";
import SettingsModal from "@/components/SettingsModal";
import { Colors } from "@/constants/colors";
import { allWords } from "@/utils/all-words";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

const ROWS = 6;

const Game = () => {
  const [rows, setRows] = React.useState<string[][]>(
    new Array(ROWS).fill(new Array(5).fill(""))
  );
  const [currentRow, setCurrentRow] = React.useState(0);
  const [currentCol, _setCurrentCol] = React.useState(0);
  const [greenLetters, setGreenLetters] = React.useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = React.useState<string[]>([]);
  const [grayLetters, setGrayLetters] = React.useState<string[]>([]);
  // const [word, setWord] = React.useState<string>(
  //   words[Math.floor(Math.random() * words.length)]
  // );
  const [word, setWord] = React.useState<string>("simon");

  const colStateRef = React.useRef(currentCol);
  const settingsModalRef = React.useRef<BottomSheetModal>(null);

  const router = useRouter();
  const colorScheme = useColorScheme();

  const wordLetters = word.split("");
  const backgroundColor = Colors[colorScheme ?? "light"].gameBg;
  const textColor = Colors[colorScheme ?? "light"].text;
  const grayColor = Colors[colorScheme ?? "light"].gray;
  const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0));
  const rowStyles = Array.from({ length: ROWS }, (_, i) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offsetShakes[i].value }],
      };
    })
  );
  const tileRotates = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(0))
  );
  const cellBackgrounds = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue("transparent"))
  );
  const cellBorders = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(Colors.light.gray))
  );
  const tileStyles = Array.from({ length: ROWS }, (_, index) => {
    return Array.from({ length: 5 }, (_, tileIndex) =>
      useAnimatedStyle(() => {
        return {
          transform: [{ rotateX: `${tileRotates[index][tileIndex].value}deg` }],
          borderColor: cellBorders[index][tileIndex].value,
          backgroundColor: cellBackgrounds[index][tileIndex].value,
        };
      })
    );
  });

  const setCurrentCol = (col: number) => {
    colStateRef.current = col;
    _setCurrentCol(col);
  };
  const onKeyPress = (key: string) => {
    const newRows = [...rows.map((row) => [...row])];

    if (key === ENTER) {
      checkWord();
    } else if (key === BACKSPACE) {
      if (colStateRef.current === 0) {
        return;
      }
      newRows[currentRow][colStateRef.current - 1] = "";
      setRows(newRows);
      setCurrentCol(colStateRef.current - 1);
    } else if (colStateRef.current >= newRows[currentRow].length) {
      return;
    } else {
      newRows[currentRow][colStateRef.current] = key;
      setRows(newRows);
      setCurrentCol(colStateRef.current + 1);
    }
  };
  const checkWord = () => {
    const currentWord = rows[currentRow].join("");

    if (currentWord.length < word.length) {
      shakeRow();
      return;
    }

    if (!allWords.includes(currentWord)) {
      shakeRow();
      // return;
    }

    flipRow();

    const newGreenLetters: string[] = [];
    const newYellowLetters: string[] = [];
    const newGrayLetters: string[] = [];

    currentWord.split("").forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newGreenLetters.push(letter);
      } else if (wordLetters.includes(letter)) {
        newYellowLetters.push(letter);
      } else {
        newGrayLetters.push(letter);
      }
    });

    setGreenLetters([...greenLetters, ...newGreenLetters]);
    setYellowLetters([...yellowLetters, ...newYellowLetters]);
    setGrayLetters([...grayLetters, ...newGrayLetters]);

    setTimeout(() => {
      if (currentWord === word) {
        // TODO: add a sound for correct word
        console.log("correct word", currentWord);

        router.push(
          `/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}`
        );
      } else if (currentRow + 1 >= rows.length) {
        // TODO: add a sound for wrong word
        console.log("wrong word", currentWord);

        router.push(
          `/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}`
        );
      }
    }, 1500);

    setCurrentRow(currentRow + 1);
    setCurrentCol(0);
  };
  const setLetterColor = (letter: string, row: number, col: number) => {
    if (currentRow > row) {
      if (wordLetters[col] === letter) {
        cellBackgrounds[row][col].value = withDelay(
          col * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(letter)) {
        cellBackgrounds[row][col].value = withDelay(
          col * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBackgrounds[row][col].value = withDelay(
          col * 200,
          withTiming(grayColor)
        );
      }
    } else {
      cellBackgrounds[row][col].value = withTiming("transparent", {
        duration: 100,
      });
    }
  };
  const setBorderColor = (letter: string, row: number, col: number) => {
    if (currentRow > row && letter !== "") {
      if (wordLetters[col] === letter) {
        cellBorders[row][col].value = withDelay(
          col * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(letter)) {
        cellBorders[row][col].value = withDelay(
          col * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBorders[row][col].value = withDelay(
          col * 200,
          withTiming(grayColor)
        );
      }
    }
    return grayColor;
  };
  const handlePresentSettingsModal = () => {
    settingsModalRef.current?.present();
  };
  const shakeRow = () => {
    const TIME = 80;
    const OFFSET = 10;

    offsetShakes[currentRow].value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    );
  };
  const flipRow = () => {
    const TIME = 300;
    const OFFSET = 90;

    tileRotates[currentRow].forEach((value, index) => {
      value.value = withDelay(
        index * 100,
        withSequence(
          withTiming(OFFSET, { duration: TIME }, () => {}),
          withTiming(0, { duration: TIME })
        )
      );
    });
  };

  React.useEffect(() => {
    if (currentRow === 0) return;

    rows[currentRow - 1].map((cell, cellIndex) => {
      setLetterColor(cell, currentRow - 1, cellIndex);
      setBorderColor(cell, currentRow - 1, cellIndex);
    });
  }, [currentRow]);
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onKeyPress(ENTER);
      } else if (e.key === "Backspace") {
        onKeyPress(BACKSPACE);
      } else if (e.key.length === 1) {
        onKeyPress(e.key);
      }
    };

    if (Platform.OS === "web") {
      document.addEventListener("keydown", handleKeyDown);
    }

    // Don't forget to clean up
    return () => {
      if (Platform.OS === "web") {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [currentCol]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SettingsModal ref={settingsModalRef} />
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerIcon}>
              <Ionicons
                name="help-circle-outline"
                size={28}
                color={textColor}
              />
              <Ionicons name="podium-outline" size={28} color={textColor} />
              <TouchableOpacity onPress={handlePresentSettingsModal}>
                <Ionicons name="settings-sharp" size={28} color={textColor} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <Animated.View
            key={`row-${rowIndex}`}
            entering={ZoomIn.delay(50 * rowIndex)}
            style={[styles.gameFieldRow, rowStyles[rowIndex]]}
          >
            {row.map((letter, index) => (
              <View
                key={`letter-${rowIndex}-${index}`}
                style={[styles.letter, tileStyles[rowIndex][index]]}
              >
                <Text
                  style={[
                    styles.letterText,
                    { color: currentRow > rowIndex ? "#fff" : textColor },
                  ]}
                >
                  {letter}
                </Text>
              </View>
            ))}
          </Animated.View>
        ))}
      </View>
      <OnScreenKeyboard
        onKeyPress={onKeyPress}
        greenLetters={greenLetters}
        yellowLetters={yellowLetters}
        grayLetters={grayLetters}
      />
    </View>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
  },
  headerIcon: {
    flexDirection: "row",
    gap: 10,
  },
  gameField: {
    alignItems: "center",
    gap: 8,
  },
  gameFieldRow: {
    flexDirection: "row",
    gap: 8,
  },
  letter: {
    width: 62,
    height: 62,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  letterText: {
    fontSize: 30,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
