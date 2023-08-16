# NeuralNavigate/myproject/scripts/generate_definitions.py

import openai
import django
import json

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

    # fetch user details
    name, about = get_user_details_by_email(email)
    if not name or not about:
        return "User details not found!"
    
    # construct prompt for the chat model
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": f"Given the Machine Learning and AI topic '{topic}' and considering {name}'s description '{about}', provide a definition of the topic in a context that relates to {name}'s description."}
    ]
    
    # chat completion API
    response = openai.ChatCompletion.create(
        model="gpt-4", 
        messages=messages,
        max_tokens=200,
        stream=True
    )


    definition = ""
    try:
        for chunk in response:
            # Check if chunk is an OpenAIObject and get the JSON representation if it is
            if hasattr(chunk, 'to_dict'):
                parsed_data = chunk.to_dict()
            elif isinstance(chunk, bytes):
                chunk_decoded = chunk.decode('utf-8', errors='replace')
                parsed_data = json.loads(chunk_decoded)
            elif isinstance(chunk, str):
                parsed_data = json.loads(chunk)
            else:
                raise ValueError(f"Unsupported type: {type(chunk)}")

            # Extract content from parsed data
            choices = parsed_data.get("choices", [])
            if choices:
                delta = choices[0].get("delta", {})
                content = delta.get("content")
                if content:
                    definition += content              

    except Exception as e:
        print(f"Error: {e}")

    return definition

    # CHAT-GPT: here, rather than printing a chunk, i want to immiditely retrieve 
    #       in my front end-end react code and stream it in my TopicsDefinitons modal
    #       