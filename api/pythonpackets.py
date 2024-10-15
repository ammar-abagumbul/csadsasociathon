import logging
from datetime import datetime, timedelta

from amadeus import Client, Location, ResponseError
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

from . import chatbot

app = Flask(__name__)
CORS(app)

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


def retrieve_booking(booking_id):
    try:
        return amadeus.booking.flight_order(booking_id).get().data
    except ResponseError as error:
        logger.error(f"An error occurred while retrieving the booking: {error}")
        return None


@app.route("/")
def index():
    return "Welcome to the Flight Booking API"


@app.route("/search_city", methods=["POST"])
def search_city_route():
    city = request.json["city"]
    city_info = search_city(city)
    if city_info:
        return jsonify({"success": True, "code": city_info[0]["iataCode"]})
    return jsonify({"success": False, "message": "City not found"})


@app.route("/airport_info", methods=["POST"])
def airport_info_route():
    airport_code = request.json["airport_code"]
    airport_info = get_airport_info(airport_code)
    if airport_info:
        return jsonify({"success": True, "name": airport_info["name"]})
    return jsonify({"success": False, "message": "Airport info not found"})


@app.route("/search_flights", methods=["POST"])
def search_flights_route():
    origin = request.json["origin"]
    destination = request.json["destination"]
    departure_date = request.json["departure_date"]
    adults = int(request.json["adults"])

    flight_offers = search_flights(origin, destination, departure_date, adults)
    if flight_offers:
        return jsonify({"success": True, "flights": flight_offers})
    return jsonify({"success": False, "message": "No flights found"})


@app.route("/confirm_price", methods=["POST"])
def confirm_price_route():
    flight_offer = request.json
    price_confirmation = confirm_price(flight_offer)
    if price_confirmation:
        return jsonify(
            {"success": True, "price": price_confirmation["flightOffers"][0]["price"]}
        )
    return jsonify({"success": False, "message": "Price confirmation failed"})


@app.route("/book_flight", methods=["POST"])
def book_flight_route():
    flight_offer = request.json["flightOffer"]
    traveler = request.json["traveler"]

    booking = book_flight(flight_offer, traveler)
    if booking:
        booking_details = retrieve_booking(booking["id"])
        if booking_details:
            return jsonify({"success": True, "booking": booking_details})
    return jsonify({"success": False, "message": "Booking failed"})


@app.route("/chatbot", methods=["POST"])
def triggerChatBot():
    chatbot()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
