import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BookAFlight from "../appcomponents/BookAFlight"; // Importing the first page
import ConfirmationPage from "../appcomponents/ConfirmationPage";
import HomeScreen from "../appcomponents/HomeScreen";

const Stack = createStackNavigator();

const Page = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="BookAFlight" component={BookAFlight} />
        <Stack.Screen name="ConfirmationPage" component={ConfirmationPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Page;
