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


def search_city(keyword):
    try:
        return amadeus.reference_data.locations.get(
            keyword=keyword, subType=Location.CITY
        ).data
    except ResponseError as error:
        logger.error(f"An error occurred during city search: {error}")
        return None


def get_airport_info(airport_code):
    try:
        return amadeus.reference_data.location(airport_code).get().data
    except ResponseError as error:
        logger.error(f"An error occurred while fetching airport info: {error}")
        return None


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
        response = amadeus.booking.flight_orders.post(flight_offer, traveler)
        booking_data = response.data

        if booking_data.get("id") and booking_data.get("type") == "flight-order":
            return {
                "success": True,
                "booking_id": booking_data["id"],
                "status": booking_data.get("flightOffers", [{}])[0].get(
                    "status", "Unknown"
                ),
                "created_at": booking_data.get("associatedRecords", [{}])[0].get(
                    "creationDate", "Unknown"
                ),
                "total_price": booking_data.get("flightOffers", [{}])[0]
                .get("price", {})
                .get("total", "Unknown"),
                "currency": booking_data.get("flightOffers", [{}])[0]
                .get("price", {})
                .get("currency", "Unknown"),
            }
        else:
            return {
                "success": False,
                "message": "Booking response did not contain expected data",
            }
    except ResponseError as error:
        logger.error(f"An error occurred during flight booking: {error}")
        return {"success": False, "message": str(error)}


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

    # Search for origin city
    print("Searching for Madrid...")
    madrid_info = search_city("Madrid")
    if madrid_info:
        origin_code = madrid_info[0]["iataCode"]
        print(f"Found Madrid with IATA code: {origin_code}")
    else:
        origin_code = "MAD"
        print("City search failed, using default code MAD for Madrid")

    # Search for destination city
    print("\nSearching for Athens...")
    athens_info = search_city("Athens")
    if athens_info:
        destination_code = athens_info[0]["iataCode"]
        print(f"Found Athens with IATA code: {destination_code}")
    else:
        destination_code = "ATH"
        print("City search failed, using default code ATH for Athens")

    # Get airport info for origin
    print(f"\nGetting airport info for {origin_code}...")
    origin_airport_info = get_airport_info(origin_code)
    if origin_airport_info:
        print(f"Origin Airport: {origin_airport_info['name']}")
    else:
        print(f"Failed to get airport info for {origin_code}")

    # Get airport info for destination
    print(f"\nGetting airport info for {destination_code}...")
    destination_airport_info = get_airport_info(destination_code)
    if destination_airport_info:
        print(f"Destination Airport: {destination_airport_info['name']}")
    else:
        print(f"Failed to get airport info for {destination_code}")

    # Set up flight search parameters
    departure_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    adults = 1

    # Search for flights
    print(
        f"\nSearching for flights from {origin_code} to {destination_code} on {departure_date}..."
    )
    flight_offers = search_flights(
        origin_code, destination_code, departure_date, adults
    )

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
            booking_result = book_flight(flight_offers[0], traveler)

            if booking_result["success"]:
                print(f"Booking successful!")
                print(f"Booking ID: {booking_result['booking_id']}")
                print(f"Status: {booking_result['status']}")
                print(f"Created at: {booking_result['created_at']}")
                print(
                    f"Total price: {booking_result['total_price']} {booking_result['currency']}"
                )
            else:
                print(f"Booking failed: {booking_result['message']}")
        else:
            print("Price confirmation failed")
    else:
        print("No flight offers found")


if __name__ == "__main__":
    main()
