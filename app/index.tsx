import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BookAFlight from "../appcomponents/BookAFlight"; // Importing the first page
import { OtherPage } from "../appcomponents/OtherPage"; // Importing the first page
import ConfirmationPage from "../appcomponents/ConfirmationPage";

const Stack = createStackNavigator();

const Page = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="BookAFlight">
        <Stack.Screen name="BookAFlight" component={BookAFlight} />
        <Stack.Screen name="OtherPage" component={OtherPage} />
        <Stack.Screen name="ConfirmationPage" component={ConfirmationPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Page;
