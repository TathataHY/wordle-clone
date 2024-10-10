import { Colors } from "@/constants/colors";
import React from "react";
import { Text, TextProps, useColorScheme } from "react-native";

const ThemedText = (props: TextProps) => {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"].text;

  return (
    <Text {...props} style={[{ color }, props.style]}>
      {props.children}
    </Text>
  );
};

export default ThemedText;
