// import axios from 'axios';

const FLIGHTAWARE_API_KEY = 'YOUR_FLIGHTAWARE_API_KEY';
const BASE_URL = 'https://flightxml.flightaware.com/json/FlightXML2';

export const getFlightInfo = async (flightNumber: string) => {
    // Simulated flight data for demonstration purposes
    return {
        flightNumber: flightNumber,
        status: 'On Time',
        departure: 'New York (JFK)',
        arrival: 'London (LHR)',
        gate: 'A1',
        delay: 0,
    };
};

export const subscribeToFlightUpdates = (flightNumber: string, callback: (update: any) => void) => {
    // Simulated updates
    const interval = setInterval(() => {
        const updatedInfo = {
            flightNumber: flightNumber,
            status: Math.random() > 0.8 ? 'Delayed' : 'On Time',
            departure: 'New York (JFK)',
            arrival: 'London (LHR)',
            gate: Math.random() > 0.5 ? 'A1' : 'A2',
            delay: Math.random() > 0.8 ? Math.floor(Math.random() * 60) : 0,
        };
        callback(updatedInfo);
    }, 60000); // Check for updates every minute

    return () => {
        clearInterval(interval);
    };
};