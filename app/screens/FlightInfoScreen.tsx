import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { getFlightInfo, subscribeToFlightUpdates } from '../services/flightService';

export default function FlightInfoScreen() {
  const route = useRoute();
  const { flightNumber } = route.params;
  const [flightInfo, setFlightInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlightInfo = async () => {
      try {
        const info = await getFlightInfo(flightNumber);
        setFlightInfo(info);
        setLoading(false);
        speakFlightInfo(info);
      } catch (err) {
        setError('Failed to fetch flight information');
        setLoading(false);
        Speech.speak('Failed to fetch flight information');
      }
    };

    fetchFlightInfo();

    const unsubscribe = subscribeToFlightUpdates(flightNumber, (update) => {
      setFlightInfo((prevInfo) => {
        const newInfo = { ...prevInfo, ...update };
        speakFlightUpdates(prevInfo, newInfo);
        return newInfo;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [flightNumber]);

  const speakFlightInfo = (info) => {
    const speech = `Flight ${info.flightNumber} information: Status ${info.status}, Departure from ${info.departure}, Arrival at ${info.arrival}, Gate ${info.gate}`;
    Speech.speak(speech);
  };

  const speakFlightUpdates = (prevInfo, newInfo) => {
    if (prevInfo.status !== newInfo.status) {
      Speech.speak(`Flight status updated to ${newInfo.status}`);
    }
    if (prevInfo.gate !== newInfo.gate) {
      Speech.speak(`Gate changed to ${newInfo.gate}`);
    }
    if (newInfo.delay > 0 && prevInfo.delay !== newInfo.delay) {
      Speech.speak(`Flight delayed by ${newInfo.delay} minutes`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Paragraph style={styles.errorText}>{error}</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Flight Information</Title>
      <Paragraph>Flight Number: {flightInfo.flightNumber}</Paragraph>
      <Paragraph>Status: {flightInfo.status}</Paragraph>
      <Paragraph>Departure: {flightInfo.departure}</Paragraph>
      <Paragraph>Arrival: {flightInfo.arrival}</Paragraph>
      <Paragraph>Gate: {flightInfo.gate}</Paragraph>
      {flightInfo.delay > 0 && (
        <Paragraph style={styles.alert}>Delay: {flightInfo.delay} minutes</Paragraph>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  alert: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 10,
  },
});