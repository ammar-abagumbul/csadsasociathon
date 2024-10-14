import { createStackNavigator } from "@react-navigation/stack";

type RootStackParamList = {
  BookAFlight: undefined;
  ConfirmationPage: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

import { StackNavigationProp } from "@react-navigation/stack";
type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  string
>;

export type ScreenNavProps = {
  navigation: ProfileScreenNavigationProp;
};
