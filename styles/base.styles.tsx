import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      flex: 1,
      paddingTop: Constants.statusBarHeight,
    },
    heading: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    flexRow: {
      alignContent: "center",
      alignItems: "center",
    },
    input: {
      borderColor: "#4630eb",
      flex: 1,
      height: 48,
      margin: 16,
      padding: 8,
    },
    listArea: {
      backgroundColor: "#f0f0f0",
      flex: 1,
    },
    sectionContainer: {
      borderColor: "#4630eb",

      marginBottom: 16,
      marginHorizontal: 16,
      top: 20,
      borderWidth: 1,
      padding: 10,
      borderRadius: 10
    },
    sectionHeading: {
      fontSize: 18,
    },
  });

export default styles