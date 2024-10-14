import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { getFlightInfo, subscribeToFlightUpdates } from "../services/flightService";

type FlightInfoScreenProps = {
    route: RouteProp<MainStackParamList, "FlightInfo">,
    navigation: FrameNavigationProp<MainStackParamList, "FlightInfo">,
};

export function FlightInfoScreen({ route }: FlightInfoScreenProps) {
    const { flightNumber } = route.params;
    const [flightInfo, setFlightInfo] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchFlightInfo = async () => {
            try {
                const info = await getFlightInfo(flightNumber);
                setFlightInfo(info);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch flight information");
                setLoading(false);
            }
        };

        fetchFlightInfo();

        const unsubscribe = subscribeToFlightUpdates(flightNumber, (update) => {
            setFlightInfo((prevInfo: any) => ({ ...prevInfo, ...update }));
        });

        return () => {
            unsubscribe();
        };
    }, [flightNumber]);

    if (loading) {
        return (
            <flexboxLayout style={styles.container}>
                <activityIndicator busy={true} />
            </flexboxLayout>
        );
    }

    if (error) {
        return (
            <flexboxLayout style={styles.container}>
                <label style={styles.errorText}>{error}</label>
            </flexboxLayout>
        );
    }

    return (
        <scrollView style={styles.container}>
            <flexboxLayout style={styles.infoContainer}>
                <label style={styles.title}>Flight Information</label>
                <label style={styles.info}>Flight Number: {flightInfo.flightNumber}</label>
                <label style={styles.info}>Status: {flightInfo.status}</label>
                <label style={styles.info}>Departure: {flightInfo.departure}</label>
                <label style={styles.info}>Arrival: {flightInfo.arrival}</label>
                <label style={styles.info}>Gate: {flightInfo.gate}</label>
                {flightInfo.delay && (
                    <label style={styles.alert}>Delay: {flightInfo.delay} minutes</label>
                )}
            </flexboxLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
    infoContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
    },
    alert: {
        fontSize: 18,
        color: "red",
        fontWeight: "bold",
        marginTop: 10,
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlignment: "center",
    },
});