// BookAFlight.tsx
import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { ScreenNavProps } from "@/types";

const BookAFlight = ({ navigation }: ScreenNavProps) => {
  const [flightNumber, setFlightNumber] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Flight</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Flight Number"
        value={flightNumber}
        onChangeText={setFlightNumber}
      />
      <Button
        title="Book Flight"
        onPress={() => navigation.navigate("ConfirmationPage")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default BookAFlight;
