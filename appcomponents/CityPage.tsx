// App.js
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { searchCity } from "../api/amadeus_api";

const CityPage = () => {
  const [city, setCity] = useState("");

  const handleSearch = async () => {
    const result = await searchCity(city);
    if (result) {
      Alert.alert("City found", JSON.stringify(result));
    } else {
      Alert.alert("Error", "City not found");
    }
  };

  return (
    <View>
      <TextInput placeholder="Enter city" value={city} onChangeText={setCity} />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

export default CityPage;
