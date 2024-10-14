import logging
from datetime import datetime, timedelta

from amadeus import Client, Location, ResponseError

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize Amadeus client
amadeus = Client(
    client_id="cZqihrXpvYbVqIFfb1GJqb7jFQuXxJ3O",
    client_secret="CRZbLcL088pVvHcJ",
    logger=logger,
)


def search_flights(origin, destination, departure_date, adults):
    try:
        return amadeus.shopping.flight_offers_search.get(
            originLocationCode=origin,
            destinationLocationCode=destination,
            departureDate=departure_date,
            adults=adults,
        ).data
    except ResponseError as error:
        logger.error(f"An error occurred during flight search: {error}")
        return None


def confirm_price(flight_offer):
    try:
        return amadeus.shopping.flight_offers.pricing.post(flight_offer).data
    except ResponseError as error:
        logger.error(f"An error occurred during price confirmation: {error}")
        return None


def book_flight(flight_offer, traveler):
    try:
        return amadeus.booking.flight_orders.post(flight_offer, traveler).data
    except ResponseError as error:
        logger.error(f"An error occurred during flight booking: {error}")
        return None


def get_airport_info(airport_code):
    try:
        return amadeus.reference_data.location(airport_code).get().data
    except ResponseError as error:
        logger.error(f"An error occurred while fetching airport info: {error}")
        return None


def search_city(keyword):
    try:
        return amadeus.reference_data.locations.get(
            keyword=keyword, subType=Location.CITY
        ).data
    except ResponseError as error:
        logger.error(f"An error occurred during city search: {error}")
        return None


def main():
    # Example traveler data
    traveler = {
        "id": "1",
        "dateOfBirth": "1982-01-16",
        "name": {"firstName": "John", "lastName": "Doe"},
        "gender": "MALE",
        "contact": {
            "emailAddress": "john.doe@example.com",
            "phones": [
                {
                    "deviceType": "MOBILE",
                    "countryCallingCode": "1",
                    "number": "2025550180",
                }
            ],
        },
        "documents": [
            {
                "documentType": "PASSPORT",
                "birthPlace": "New York",
                "issuanceLocation": "New York",
                "issuanceDate": "2015-04-14",
                "number": "00000000",
                "expiryDate": "2025-04-14",
                "issuanceCountry": "US",
                "validityCountry": "US",
                "nationality": "US",
                "holder": True,
            }
        ],
    }

    # Search for a city
    print("Searching for Madrid...")
    madrid_info = search_city("Madrid")
    if madrid_info:
        madrid_code = madrid_info[0]["iataCode"]
        print(f"Found Madrid with IATA code: {madrid_code}")
    else:
        madrid_code = "MAD"
        print("City search failed, using default code MAD for Madrid")

    # Get airport info
    print("\nGetting airport info for Athens (ATH)...")
    ath_info = get_airport_info("ATH")
    if ath_info:
        print(f"Athens Airport: {ath_info['name']}")
    else:
        print("Failed to get Athens airport info")

    # Set up flight search parameters
    origin = madrid_code
    destination = "ATH"
    departure_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    adults = 1

    # Search for flights
    print(
        f"\nSearching for flights from {origin} to {destination} on {departure_date}..."
    )
    flight_offers = search_flights(origin, destination, departure_date, adults)

    if flight_offers:
        print(f"Found {len(flight_offers)} flight offers")

        # Confirm price of the first offer
        print("\nConfirming price for the first offer...")
        price_confirmation = confirm_price(flight_offers[0])

        if price_confirmation:
            print(
                f"Price confirmed: {price_confirmation['flightOffers'][0]['price']['total']} {price_confirmation['flightOffers'][0]['price']['currency']}"
            )

            # Book the flight
            print("\nAttempting to book the flight...")
            booking = book_flight(flight_offers[0], traveler)

            if booking:
                print(f"Booking successful! Booking reference: {booking['id']}")
            else:
                print("Booking failed")
        else:
            print("Price confirmation failed")
    else:
        print("No flight offers found")


if __name__ == "__main__":
    main()
