import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors } from "@/theme";




export function NextRefreshCountdown({percent, totalDots = 10}: {percent: number, totalDots?: number}) {
  
  // We need two sets of animations:
  // 1. Opacity: To fade dots in/out based on progress
  // 2. Scale: To pulse the active dots
  const dotOps = useRef(Array(totalDots).fill(null).map(() => new Animated.Value(0))).current;
  const dotScales = useRef(Array(totalDots).fill(null).map(() => new Animated.Value(1))).current;

  useEffect(() => {
    dotOps.forEach((anim, index) => {
      const threshold = (index + 1) / totalDots;
      const isActive = percent >= threshold;
      const targetOpacity = isActive ? 1 : 0.3;

      // 1. Animate Opacity
      Animated.timing(anim, {
        toValue: targetOpacity,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // 2. Handle Pulse for Active Dots
      if (isActive) {
        // Start a loop for the pulse effect
        Animated.loop(
          Animated.sequence([
            Animated.timing(dotScales[index], {
              toValue: 1.2, // Scale up
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(dotScales[index], {
              toValue: 1, // Scale back down
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        // Reset scale to normal if inactive
        Animated.timing(dotScales[index], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [percent]);

  return (
    <View style={countdownStyles.container}>
      {dotOps.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            countdownStyles.dot,
            {
              opacity: anim,
              transform: [{ scale: dotScales[index] }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const countdownStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.loading,
  },
});
