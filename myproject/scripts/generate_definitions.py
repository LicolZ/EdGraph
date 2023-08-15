# NeuralNavigate/myproject/scripts/generate_definitions.py

import os
import openai

import django

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings.development")
django.setup()
# from django.conf import settings
# print(settings.DATABASES)

from user.models import CustomUser

def get_user_details_by_email(email):
    print("getting user")
    try:
        user = CustomUser.objects.get(email=email)
        return user.name, user.about
    except CustomUser.DoesNotExist:
        return None, None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None, None



def generate_personalized_definition(topic, email):
    OPENAI_API_KEY='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' 

    print(email)

    # Fetch user details
    name, about = get_user_details_by_email(email)
    if not name or not about:
        return "User details not found!"
    
    # Construct the prompt for the chat model
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": f"Given the topic '{topic}' and considering {name}'s description '{about}', provide a definition of the topic in a context that relates to {name}'s description."}
    ]
    
    # Use the chat completion API
    response = openai.ChatCompletion.create(
        model="gpt-4", 
        messages=messages,
        max_tokens=200
    )


    # Extract the assistant's response
    definition = response.choices[0].message['content'].strip()

    return definition