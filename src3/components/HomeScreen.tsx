import { Dialogs } from '@nativescript/core';
import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";

import { MainStackParamList } from "../NavigationParamList";

type HomeScreenProps = {
    route: RouteProp<MainStackParamList, "Home">,
    navigation: FrameNavigationProp<MainStackParamList, "Home">,
};

export function HomeScreen({ navigation }: HomeScreenProps) {
    const [flightNumber, setFlightNumber] = React.useState("");

    const handleFlightNumberChange = (args: any) => {
        setFlightNumber(args.object.text);
    };

    const handleSubmit = () => {
        if (flightNumber.trim() === "") {
            Dialogs.alert("Please enter a flight number");
        } else {
            navigation.navigate("FlightInfo", { flightNumber: flightNumber.trim() });
        }
    };

    return (
        <flexboxLayout style={styles.container}>
            <label className="text-2xl mb-4 font-bold text-center">
                Enter Flight Number
            </label>
            <textField
                hint="Flight Number"
                text={flightNumber}
                onTextChange={handleFlightNumberChange}
                returnKeyType="done"
                style={styles.input}
            />
            <button
                style={styles.button}
                onTap={handleSubmit}
            >
                Get Flight Information
            </button>
        </flexboxLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    input: {
        width: "80%",
        fontSize: 18,
        textAlignment: "center",
        marginBottom: 20,
    },
    button: {
        fontSize: 18,
        color: "#ffffff",
        backgroundColor: "#2e6ddf",
        padding: 10,
        borderRadius: 5,
    },
});