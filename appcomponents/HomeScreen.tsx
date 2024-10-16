// screens/HomeScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import * as Speech from "expo-speech";

// Replace this with your Flask server's IP address and port
// const API_BASE_URL = "http://192.168.1.100:8000";
const API_BASE_URL = "http://127.0.0.1:8000";

function HomeScreen() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [chatbotResponse, setChatbotResponse] = useState<string | null>(null);

  const handleChatbot = async () => {
    try {
      setLoading(true);
      setError(null);

      // Send user input to Flask API
      const response = await axios.post(`${API_BASE_URL}/chatbot`, {
        user_input: "Help me book a flight", // This will be dynamic based on user's voice
      });

      if (response.data.response) {
        const { response: chatbotReply, action } = response.data;
        setChatbotResponse(chatbotReply);

        // Read out the chatbot's response via voice
        Speech.speak(chatbotReply);

        // Handle actions if any (e.g., booking a flight)
        if (action) {
          console.log("Action triggered by chatbot:", action);
        }
      } else {
        setError("No response from chatbot");
      }
    } catch (error) {
      console.error("Error with chatbot:", error);
      setError("An error occurred with the chatbot");
    } finally {
      setLoading(false);
    }
  };
  const searchCity = async (keyword: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/search_city`, {
        city: keyword,
      });
      return response.data.success ? [{ iataCode: response.data.code }] : null;
    } catch (error) {
      console.error("Error searching city:", error);
      return null;
    }
  };

  const getAirportInfo = async (airportCode: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/airport_info`, {
        airport_code: encodeURIComponent(airportCode),
      });
      return response.data.success ? { name: response.data.name } : null;
    } catch (error) {
      console.error("Error getting airport info:", error);
      return null;
    }
  };

  const searchFlights = async (
    origin: string,
    destination: string,
    departureDate: string,
    adults: number,
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/search_flights`, {
        origin: encodeURIComponent(origin),
        destination: encodeURIComponent(destination),
        departure_date: departureDate,
        adults,
      });
      return response.data.success ? response.data.flights : null;
    } catch (error) {
      console.error("Error searching flights:", error);
      return null;
    }
  };

  const confirmPrice = async (flightOffer: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/confirm_price`,
        flightOffer,
      );
      return response.data.success
        ? { flightOffers: [{ price: response.data.price }] }
        : null;
    } catch (error) {
      console.error("Error confirming price:", error);
      return null;
    }
  };

  const bookFlight = async (flightOffer: string, traveler: object) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/book_flight`, {
        flightOffer,
        traveler,
      });
      return response.data.success ? response.data.booking : null;
    } catch (error) {
      console.error("Error booking flight:", error);
      return null;
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    setError(null);
    setBookingDetails(null);

    try {
      // Search for origin city
      console.log("Searching for origin city...");
      const originInfo = await searchCity(origin);
      const originCode = originInfo ? originInfo[0].iataCode : origin;

      // Get destination airport info
      console.log("Getting destination airport info...");
      const destInfo = await getAirportInfo(destination);
      if (destInfo) {
        console.log(`Destination Airport: ${destInfo.name}`);
      }

      // Search for flights
      console.log(
        `Searching for flights from ${originCode} to ${destination} on ${departureDate}...`,
      );
      const flightOffers = await searchFlights(
        originCode,
        destination,
        departureDate,
        1,
      );

      if (flightOffers && flightOffers.length > 0) {
        console.log(`Found ${flightOffers.length} flight offers`);

        // Confirm price of the first offer
        console.log("Confirming price for the first offer...");
        const priceConfirmation = await confirmPrice(flightOffers[0]);

        if (priceConfirmation) {
          console.log(
            `Price confirmed: ${priceConfirmation.flightOffers[0].price.total} ${priceConfirmation.flightOffers[0].price.currency}`,
          );

          // Book the flight
          console.log("Attempting to book the flight...");
          const traveler = {
            id: "1",
            dateOfBirth: "1982-01-16",
            name: { firstName: "John", lastName: "Doe" },
            gender: "MALE",
            contact: {
              emailAddress: "john.doe@example.com",
              phones: [
                {
                  deviceType: "MOBILE",
                  countryCallingCode: "1",
                  number: "2025550180",
                },
              ],
            },
            documents: [
              {
                documentType: "PASSPORT",
                number: "00000000",
                expiryDate: "2025-04-14",
                issuanceCountry: "US",
                nationality: "US",
                holder: true,
              },
            ],
          };

          const booking = await bookFlight(flightOffers[0], traveler);

          if (booking) {
            console.log(`Booking successful! Booking reference: ${booking.id}`);
            setBookingDetails(booking);
          } else {
            setError("Booking failed");
          }
        } else {
          setError("Price confirmation failed");
        }
      } else {
        setError("No flight offers found");
      }
    } catch (error) {
      console.error("Error during booking process:", error);
      setError("An error occurred during the booking process");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Origin:</Text>
      <TextInput
        style={styles.input}
        value={origin}
        onChangeText={setOrigin}
        placeholder="Enter origin city"
      />
      <Text style={styles.label}>Destination:</Text>
      <TextInput
        style={styles.input}
        value={destination}
        onChangeText={setDestination}
        placeholder="Enter destination airport code"
      />
      <Text style={styles.label}>Departure Date:</Text>
      <TextInput
        style={styles.input}
        value={departureDate}
        onChangeText={setDepartureDate}
        placeholder="YYYY-MM-DD"
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {chatbotResponse && <Text>Chatbot says: {chatbotResponse}</Text>}

      {/* Chatbot Trigger Button */}
      <TouchableOpacity style={styles.chatbotButton} onPress={handleChatbot}>
        <Text style={styles.chatbotText}>Talk to Chatbot</Text>
      </TouchableOpacity>

      <Button title="Book Flight" onPress={handleBooking} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {bookingDetails && (
        <View style={styles.bookingDetails}>
          <Text style={styles.bookingTitle}>Booking Confirmed!</Text>
          <Text>Booking Reference: {bookingDetails.id}</Text>
          <Text>Status: {bookingDetails.status}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  bookingDetails: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e6f7ff",
    borderRadius: 5,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chatbotButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  chatbotText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HomeScreen;
