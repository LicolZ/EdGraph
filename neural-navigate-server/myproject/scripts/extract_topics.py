import os
import PyPDF2
import string
import nltk
from nltk import sent_tokenize
import openai

class ProcessFile:
    def __init__(self, file_path):
        self.file_path = file_path

    def extract_text_from_pdf(self):
        pdf_file = open(self.file_path, 'rb')
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        num_pages = len(pdf_reader.pages)
        text = ""
        for page_number in range(num_pages):
            page_obj = pdf_reader.pages[page_number]
            text += page_obj.extract_text()
        pdf_file.close()
        return text

    def preprocess_text(self, text):
        # Lowercase text
        text = text.lower()
        # Remove punctuation
        text = text.translate(str.maketrans('', '', string.punctuation))
        # Tokenize text
        words = nltk.word_tokenize(text)
        return words

    def extract_topics(self):
        # Extract text from pdf
        text = self.extract_text_from_pdf()
        preprocessed_words = self.preprocess_text(text)

        # join the words back into a string
        preprocessed_text = ' '.join(preprocessed_words)

        # Split the text into sentences (i.e. "segments")
        sentences = sent_tokenize(preprocessed_text)

        topics = []
        openai.api_key = os.getenv("OPENAI_API_KEY")

        for sentence in sentences[1:5]:
            response = openai.Completion.create(
                model="text-davinci-003",
                prompt="Given the following sentence, extract all the topics related to Machine Learning and Artificial Intelligence." + sentence,
                max_tokens=100, 
                temperature=0)
            # Add the extracted topics to the list
            topics.append(response.choices[0].text.strip())

            print(topics)

        return topics
