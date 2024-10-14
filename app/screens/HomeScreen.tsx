import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';

export default function HomeScreen() {
  const [flightNumber, setFlightNumber] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (flightNumber.trim() === '') {
      Speech.speak('Please enter a flight number');
    } else {
      navigation.navigate('FlightInfo', { flightNumber: flightNumber.trim() });
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Enter Flight Number</Title>
      <TextInput
        label="Flight Number"
        value={flightNumber}
        onChangeText={setFlightNumber}
        style={styles.input}
        accessibilityLabel="Enter flight number"
      />
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Get Flight Information
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});