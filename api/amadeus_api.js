// const Amadeus = require("amadeus");
import { Amadeus } from "amadeus";
// const { createLogger, transports, format } = require("winston"); // Using winston for logging
import { Logger } from "react-native-logs";

// Set up logging
// const logger = createLogger({
//   level: "debug",
//   format: format.combine(format.timestamp(), format.json()),
//   transports: [new transports.Console()],
// });

const logger = Logger.createLogger();

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: "cZqihrXpvYbVqIFfb1GJqb7jFQuXxJ3O",
  clientSecret: "CRZbLcL088pVvHcJ",
  logger,
});

/**
 * Search for cities based on a keyword.
 * @param {string} keyword - The keyword for searching cities.
 * @returns {Promise<Object|null>} - The search results or null in case of error.
 */
async function searchCity(keyword) {
  try {
    const response = await amadeus.referenceData.locations.get({
      keyword: keyword,
      subType: Amadeus.Location.CITY,
    });
    return response.data;
  } catch (error) {
    logger.error(`An error occurred during city search: ${error.message}`);
    return null;
  }
}

/**
 * Get airport information by airport code.
 * @param {string} airportCode - The IATA code of the airport.
 * @returns {Promise<Object|null>} - The airport information or null in case of error.
 */
async function getAirportInfo(airportCode) {
  try {
    const response = await amadeus.referenceData.location(airportCode).get();
    return response.data;
  } catch (error) {
    logger.error(
      `An error occurred while fetching airport info: ${error.message}`,
    );
    return null;
  }
}

/**
 * Search for flights between two locations.
 * @param {string} origin - The origin IATA code.
 * @param {string} destination - The destination IATA code.
 * @param {string} departureDate - The departure date in YYYY-MM-DD format.
 * @param {number} adults - The number of adults traveling.
 * @returns {Promise<Object|null>} - The flight offers or null in case of error.
 */
async function searchFlights(origin, destination, departureDate, adults) {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: adults,
    });
    return response.data;
  } catch (error) {
    logger.error(`An error occurred during flight search: ${error.message}`);
    return null;
  }
}

/**
 * Confirm the price of a flight offer.
 * @param {Object} flightOffer - The flight offer object.
 * @returns {Promise<Object|null>} - The pricing confirmation or null in case of error.
 */
async function confirmPrice(flightOffer) {
  try {
    const response =
      await amadeus.shopping.flightOffers.pricing.post(flightOffer);
    return response.data;
  } catch (error) {
    logger.error(
      `An error occurred during price confirmation: ${error.message}`,
    );
    return null;
  }
}

/**
 * Book a flight.
 * @param {Object} flightOffer - The flight offer object.
 * @param {Object} traveler - The traveler details object.
 * @returns {Promise<Object>} - The booking result.
 */
async function bookFlight(flightOffer, traveler) {
  try {
    const response = await amadeus.booking.flightOrders.post(
      flightOffer,
      traveler,
    );
    const bookingData = response.data;

    if (bookingData.id && bookingData.type === "flight-order") {
      return {
        success: true,
        booking_id: bookingData.id,
        status: bookingData.flightOffers[0]?.status || "Unknown",
        created_at: bookingData.associatedRecords[0]?.creationDate || "Unknown",
        total_price: bookingData.flightOffers[0]?.price.total || "Unknown",
        currency: bookingData.flightOffers[0]?.price.currency || "Unknown",
      };
    } else {
      return {
        success: false,
        message: "Booking response did not contain expected data",
      };
    }
  } catch (error) {
    logger.error(`An error occurred during flight booking: ${error.message}`);
    return {
      success: false,
      message: error.message,
    };
  }
}

module.exports = {
  searchCity,
  getAirportInfo,
  searchFlights,
  confirmPrice,
  bookFlight,
};
