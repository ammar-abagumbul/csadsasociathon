// BookAFlight.tsx
import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

const BookAFlight = () => {
  const [flightNumber, setFlightNumber] = useState("");

  const handleFlightBooking = () => {
    // Add functionality for booking a flight
    alert(`Flight booked with number: ${flightNumber}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Flight</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Flight Number"
        value={flightNumber}
        onChangeText={setFlightNumber}
      />
      <Button title="Book Flight" onPress={handleFlightBooking} />
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
