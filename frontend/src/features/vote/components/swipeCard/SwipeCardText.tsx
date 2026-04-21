import { QuestionDto } from "@/src/shared/types/generated";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, Animated, View, Pressable } from "react-native";

type SwipeCardTextProps = {
  item: QuestionDto
}

export function SwipeCardText({ item }: SwipeCardTextProps) {

  const [isOpened, setIsOpened] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const animation = useRef(new Animated.Value(0)).current;

  const MIN_HEIGHT = 40;

  const toggle = () => {
    Animated.timing(animation, {
      toValue: isOpened ? 0 : Math.max(contentHeight, MIN_HEIGHT),
      duration: 250,
      useNativeDriver: false,
    }).start();

    setIsOpened(!isOpened);
  };

  return (
    <Pressable style={styles.text} onPress={toggle}>
      <Text style={styles.title}>{item.text}</Text>

      <View
        style={styles.hiddenContent}
        onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
      >
        {item.description && item.description.split('\n').map((line, index) => (
          <Text key={index} style={styles.desc}>{line}</Text>
        ))}
      </View>

      <Animated.View style={{ height: animation, overflow: "hidden" }}>
        {item.description && item.description.split('\n').map((line, index) => (
          <Text key={index} style={styles.desc}>{line}</Text>
        ))}
      </Animated.View>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 15,
    paddingBottom: 20,
    borderEndEndRadius: 8,
    borderEndStartRadius: 8,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 10
  },
  desc: {
    color: '#e0e0e0',
    marginVertical: 5
  },

  hiddenContent: {
    position: "absolute",
    opacity: 0,
    zIndex: -1,
  }
});