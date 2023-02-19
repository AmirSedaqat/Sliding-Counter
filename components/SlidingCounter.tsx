import React, { useCallback, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";

const BUTTON_WIDTH = 250;
const MAX_SLIDE_OFFSET = BUTTON_WIDTH / 3;

const SlidingCounter = () => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const [count, setCount] = useState(0);

    const clamp = (value: number, min: number, max: number) => {
        "worklet";
        return Math.min(Math.max(value, min), max);
    };

    // wrapper function
    const incrementState = useCallback(() => {
        // external library function
        setCount((prev) => prev + 1);
    }, []);

    const decrementState = useCallback(() => {
        setCount((prev) => prev - 1);
    }, []);

    const resetState = useCallback(() => {
        setCount(0);
    }, []);
    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = clamp(
                e.translationX,
                -MAX_SLIDE_OFFSET,
                MAX_SLIDE_OFFSET
            );
            translateY.value = clamp(e.translationY, 0, MAX_SLIDE_OFFSET);
        })
        .onEnd(() => {
            if (translateX.value === MAX_SLIDE_OFFSET) {
                runOnJS(incrementState)();
            } else if (translateX.value === -MAX_SLIDE_OFFSET) {
                runOnJS(decrementState)();
            } else if (translateY.value === MAX_SLIDE_OFFSET) {
                runOnJS(resetState)();
            }

            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
        });

    const rStyleTransX = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
                { translateY: translateY.value },
            ],
        };
    }, []);

    const rPlusMinusOpacityStyle = useAnimatedStyle(() => {
        const opacityX = interpolate(
            translateX.value,
            [-MAX_SLIDE_OFFSET, 0, MAX_SLIDE_OFFSET],
            [0.2, 0.8, 0.2]
        );

        const opacityY = interpolate(
            translateY.value,
            [0, MAX_SLIDE_OFFSET],
            [1, 0]
        );
        return {
            opacity: opacityX * opacityY,
        };
    }, []);

    const rCloseOpacityStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateY.value,
            [0, MAX_SLIDE_OFFSET],
            [0, 1]
        );
        return {
            opacity,
        };
    }, []);

    const rButtonContainer = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value * 0.1 },
                { translateY: translateY.value * 0.1 },
            ],
        };
    }, []);

    return (
        <Animated.View style={[styles.container, rButtonContainer]}>
            <Animated.View style={rPlusMinusOpacityStyle}>
                <AntDesign name="minus" color={"white"} size={24} />
            </Animated.View>

            <Animated.View style={rCloseOpacityStyle}>
                <AntDesign name="close" color={"white"} size={24} />
            </Animated.View>

            <Animated.View style={rPlusMinusOpacityStyle}>
                <AntDesign name="plus" color={"white"} size={24} />
            </Animated.View>

            <GestureHandlerRootView style={styles.parentCircle}>
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.circle, rStyleTransX]}>
                        <Text style={styles.countText}>{count}</Text>
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </Animated.View>
    );
};
export default SlidingCounter;
const styles = StyleSheet.create({
    container: {
        height: 80,
        width: BUTTON_WIDTH,
        backgroundColor: "#222",
        borderRadius: 50,
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "row",
    },
    countText: {
        fontSize: 25,
        color: "gainsboro",
    },
    circle: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: `#333`,
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    parentCircle: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
});
