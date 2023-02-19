import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SlidingCounter from "./components/SlidingCounter";

const App = () => {
    return (
        <GestureHandlerRootView style={styles.container}>
            <SlidingCounter />
        </GestureHandlerRootView>
    );
};
export default App;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
});
