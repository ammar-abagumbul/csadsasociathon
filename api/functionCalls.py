from vertexai.generative_models import FunctionDeclaration

# function to be suggested by gemini when user makes a request

confirm_booking = FunctionDeclaration(
    # TODO : better prompt needed
    name="confirm_booking",
    description="A function be called when the user opts to confirm one of the booking options they are presented with. This is the final stage. The response of the user shall be final",
    parameters={
        "type": "object",
        "properties": {
            "flight_offer": {
                "type": "string",
                "description": "The particular flight the user wants to confirm",
            }
        },
        "required": ["flight_offer"],
    },
)

look_up_booking = FunctionDeclaration(
    name="look_up_booking",
    description="A function to be called when the user requests to be given a list of flights that satisfy their origin, destination, and flight date",
    parameters={
        "type": "object",
        "properties": {
            "destination": {
                "type": "string",
                "description": "The destination city of the flight",
            },
            "origin": {
                "type": "string",
                "description": "The origin city of the destination",
            },
            "date": {
                "type": "string",
                "description": "The date of the flight in the format YYYY-MM-DD",
            },
        },
    },
)
