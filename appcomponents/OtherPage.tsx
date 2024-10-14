import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export const OtherPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>This is another page!</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
