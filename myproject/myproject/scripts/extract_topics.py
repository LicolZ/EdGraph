
import os
import PyPDF2
import string
import nltk
from nltk import sent_tokenize
import openai
import re

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
        text = text.lower()
        words = nltk.word_tokenize(text)
        words = [''.join(ch for ch in word if ch.isalnum() or ch == '-') for word in words]  # Keep hyphens within words
        return words

    def extract_topics(self):
        print("entering extract_topics")
        text = self.extract_text_from_pdf()
        print("extracted text from pdf")
        sentences = sent_tokenize(text)
        print("sent tokenized")

        topics = set()
        openai.api_key = os.getenv("OPENAI_API_KEY")
        print("openai key gen")

        for sentence in sentences[0:1]:
            preprocessed_string = ' '.join(self.preprocess_text(sentence))
            print("preprocessed text")
            response = openai.Completion.create(
                model="text-davinci-003",
                prompt=f"Given the following sentence, extract all the topics related to Machine Learning and Artificial Intelligence. {preprocessed_string}",
                max_tokens=100, 
                temperature=0)

            response_text = response.choices[0].text.strip().lower()
            extracted_topics = re.split(' - |\n', re.sub(r'\d+\.\s*', '', response_text))
            print("finished extracting topics")
            # Remove 'abstract ' from the start of each topic and '-' at the beginning
            processed_topics = [topic.lstrip('- ').replace('abstract ', '') for topic in extracted_topics if topic and not topic.isspace()]

            topics.update(processed_topics)
            print("updated topics")
        return list(topics)
    
    def fetch_topic_relationships(self, topics):
        openai.api_key = os.getenv("OPENAI_API_KEY")

        # fetch topics relationships (edges)

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt = 
            f"""Given the following topics: {', '.join(topics)},
                Please provide the learning paths, starting from the most fundamental topics to the more advanced ones. Each path should only contain unique topics and should be presented as follows:
                1. Topic A -> Topic B
                2. Topic B -> Topic C -> Topic D
                Note that a topic can have multiple independent prerequisites. 
            """,
            max_tokens=400,
            temperature=0.2)

        relationships_text = response.choices[0].text.strip()

        # Split by lines, remove the numbers and extra spaces
        relationships = [re.sub(r'\d+\.\s*', '', line).strip() for line in relationships_text.split('\n')]

        # Create pairs of relationships
        relationships_pairs = []
        for relationship in relationships:
            topics_in_path = relationship.split(" -> ")
            for i in range(len(topics_in_path) - 1):
                relationships_pairs.append([topics_in_path[i], topics_in_path[i+1]])
            
        return relationships_pairs


        
