import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { QuestionDto } from "../../../../shared/types/generated";

const { width } = Dimensions.get("window");

type Props = {
  item: QuestionDto;
  index: number;
  activeIndex: number;
  onSwipe: (dir: "left" | "right") => void;
  triggerSwipe?: "left" | "right" | null;
};

export function SwipeCard({
  item,
  index,
  activeIndex,
  onSwipe,
  triggerSwipe,
}: Props) {
  const translateX = useSharedValue(0);

  const isActive = index === activeIndex;

  const animatedShadow = useAnimatedStyle(() => {
    const isMiddle = translateX.value == 0;
    const isRight = translateX.value > 0;
    const progress = Math.min(Math.abs(translateX.value) / 120, 1);

    return {
      shadowColor: isMiddle ? "#000" : isRight ? "#15b400" : "#ff0000",
      shadowOpacity: isMiddle ? 0.2 : 0.2 + progress * 0.6,
      shadowRadius: isMiddle ? 6 : 6 + progress * 4,
      shadowOffset: { width: 0, height: 4 },
      transform: [
        { translateX: translateX.value },
        { rotate: `${translateX.value / 20}deg` },
      ],
    };
  });

  const handleSwipe = useCallback(
    (dir: "left" | "right") => {
      onSwipe(dir);
    },
    [onSwipe],
  );

  useEffect(() => {
    if (!triggerSwipe || !isActive) return;

    if (triggerSwipe === "right") {
      translateX.value = withTiming(width * 1.5, {}, () => {
        runOnJS(handleSwipe)("right");
      });
    }

    if (triggerSwipe === "left") {
      translateX.value = withTiming(-width * 1.5, {}, () => {
        runOnJS(handleSwipe)("left");
      });
    }
  }, [triggerSwipe]);

  const gesture = Gesture.Pan()
    .enabled(isActive)
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (translateX.value > 100) {
        translateX.value = withTiming(width * 1.5, {}, () => {
          runOnJS(handleSwipe)("right");
        });
      } else if (translateX.value < -100) {
        translateX.value = withTiming(-width * 1.5, {}, () => {
          runOnJS(handleSwipe)("left");
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = `${translateX.value / 20}deg`;

    const scale = 1;
    const translateY = 0;

    return {
      transform: [
        { translateX: translateX.value },
        { translateY },
        { scale },
        { rotate },
      ],
      opacity: 1,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.card,
          animatedStyle,
          { zIndex: 100 - index },
          isActive ? animatedShadow : {},
        ]}
      >
        <ImageBackground
          source={
            item.imageUrl
              ? { uri: item.imageUrl }
              : { uri: "https://placecats.com/250/400" }
          }
          style={styles.image}
          imageStyle={{ borderRadius: 12 }}
          resizeMode="cover"
        >
          <Text style={styles.text}>{item.text}</Text>
        </ImageBackground>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: "100%",
    height: "75%",
    borderRadius: 14,
    top: 20,
  },
  shadowGreen: {
    shadowColor: "#15b400",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,

    elevation: 5,
  },
  shadowRed: {
    shadowColor: "#ff0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,

    elevation: 5,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    backgroundColor: "#000",
    objectFit: "fill",
    borderRadius: 12,
  },
  text: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 8,
  },
});
