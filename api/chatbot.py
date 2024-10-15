import os

import google.generativeai as genai
from functionCalls import confirm_booking, look_up_booking
from vertexai.preview.generative_models import GenerativeModel, Part

# Configure the API key from the environment variable
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Initialize the model and start a chat session
model = GenerativeModel("gemini-1.5-pro-001")
chat = model.start_chat(history=[])


def listen_to_user():
    # Placeholder for capturing user input
    return ""


def listen_to_chat(user_prompt):
    try:
        # Send user's message to the chat model and return the response
        response = chat.send_message(user_prompt)
        return response
    except Exception as e:
        print(f"Error in listening to chat: {e}")
        return None


def run_conversation(user_prompt):
    global model, chat

    # Define a dictionary for handling function calls
    function_handlers = {
        "confirm_booking": confirm_booking,
        "look_up_booking": look_up_booking,
    }

    # Capture user input

    # Get chatbot response based on the user input
    bot_response = listen_to_chat(user_prompt)

    if bot_response:
        # Access function call from bot's response
        function_call = bot_response.candidates[0].content.parts[0].function_call

        # Check if the function call exists in the handlers
        if function_call.name in function_handlers:
            function_name = function_call.name
            args = {key: value for key, value in function_call.args.items()}

            # Call the corresponding function
            function_response = function_handlers[function_name](args)

            # Send the function's response back to the chatbot
            bot_response = chat.send_message(
                Part.from_function_response(
                    name=function_name, response={"content": function_response}
                )
            )

        # Print the bot's text response
        print(bot_response.candidates[0].content.parts[0].text)
    else:
        print("No response from the chatbot.")
