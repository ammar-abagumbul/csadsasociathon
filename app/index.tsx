import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BookAFlight from "../appcomponents/BookAFlight"; // Importing the first page
import { OtherPage } from "../appcomponents/OtherPage"; // Importing the first page

const Stack = createStackNavigator();

const Page = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="BookAFlight">
        <Stack.Screen name="BookAFlight" component={BookAFlight} />
        <Stack.Screen name="OtherPage" component={OtherPage} />
        {/* Add more pages here as we go along */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Page;
