import { Text, View, StyleSheet, Dimensions } from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
export default function App() {
    interface PositionProps {
        x: Animated.SharedValue<number>;
        y: Animated.SharedValue<number>;
    }
    const useFollowPosition = ({ x, y }: PositionProps) => {
        const followX = useDerivedValue(() => {
            return withSpring(x.value);
        });

        const followY = useDerivedValue(() => {
            return withSpring(y.value);
        });
        const reanimatedStyle = useAnimatedStyle(() => {
            return {
                transform: [
                    { translateX: followX.value },
                    { translateY: followY.value },
                ],
            };
        });
        return { followX, followY, reanimatedStyle };
    };

    const xTranslate = useSharedValue(0);
    const yTranslate = useSharedValue(0);
    const context = useSharedValue({ x: 0, y: 0 });
    const { width: SCREEN_WIDTH } = Dimensions.get("window");
    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { x: xTranslate.value, y: yTranslate.value };
        })
        .onUpdate((event) => {
            xTranslate.value = event.translationX + context.value.x;
            yTranslate.value = event.translationY + context.value.y;
        })
        .onEnd(() => {
            if (xTranslate.value > SCREEN_WIDTH / 2) {
                xTranslate.value = SCREEN_WIDTH - BOX_WIDTH;
            } else {
                xTranslate.value = 0;
                yTranslate.value = 0;
            }
        });

    const {
        followX: blueFollowX,
        followY: blueFollowY,
        reanimatedStyle: blueCircle,
    } = useFollowPosition({
        x: xTranslate,
        y: yTranslate,
    });
    const {
        followX: redFollowX,
        followY: redFollowY,
        reanimatedStyle: redCircle,
    } = useFollowPosition({
        x: blueFollowX,
        y: blueFollowY,
    });

    const { reanimatedStyle: yellowCircle } = useFollowPosition({
        x: redFollowX,
        y: redFollowY,
    });
    return (
        <GestureHandlerRootView style={styles.container}>
            <Animated.View
                style={[
                    styles.box,
                    { backgroundColor: "yellow" },
                    yellowCircle,
                ]}
            />
            <Animated.View
                style={[styles.box, { backgroundColor: "red" }, redCircle]}
            />
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.box, blueCircle]} />
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const BOX_WIDTH = 100.0;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    box: {
        position: "absolute",
        width: BOX_WIDTH,
        height: 100,
        backgroundColor: "blue",
        borderRadius: BOX_WIDTH / 2,
        opacity: 0.7,
    },
});
