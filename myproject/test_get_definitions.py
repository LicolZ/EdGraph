# NeuralNavigate/myproject/test/test_get_definitions.py

import os
import openai
import unittest
from unittest.mock import patch, Mock
from user.models import CustomUser
from scripts.generate_definitions import get_user_details_by_email, generate_personalized_definition
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings.base")

class TestGenerateDefinitions(unittest.TestCase):

    @patch('scripts.generate_definitions.CustomUser.objects.get')
    def test_get_user_details_by_email(self, mock_custom_user_get):
        mock_custom_user_get.return_value = CustomUser(name="John", about="Software Developer")
        
        name, about = get_user_details_by_email("john@example.com")
        self.assertEqual(name, "John")
        self.assertEqual(about, "Software Developer")

    @patch('scripts.generate_definitions.openai.ChatCompletion.create')
    def test_generate_personalized_definition(self, mock_chat_completion_create):
        mock_response = Mock()
        mock_response.choices[0].message['content'].strip.return_value = "Definition for AI"
        mock_chat_completion_create.return_value = mock_response
        
        definition = generate_personalized_definition("Artificial Intelligence", "john@example.com")
        self.assertEqual(definition, "Definition for AI")


if __name__ == '__main__':
    unittest.main()
