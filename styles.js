import { StyleSheet } from "react-native";

const WIDTH_BOX = 100.0;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    box: {
        width: WIDTH_BOX,
        height: 100,
        backgroundColor: "blue",
        borderRadius: WIDTH_BOX / 2,
        opacity: 0.7,
    },
});
export default styles;
