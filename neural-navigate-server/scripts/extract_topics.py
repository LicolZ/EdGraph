import os
import PyPDF2
import string
import string
from nltk.stem.wordnet import WordNetLemmatizer

import certifi
import os
import ssl

if not os.environ.get('SSL_CERT_FILE'):
    os.environ['SSL_CERT_FILE'] = certifi.where()

import nltk
nltk.download('punkt')

import openai

from django.http import JsonResponse
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage


### text extraction ###

# function to extract text from pdf
def extract_text_from_pdf(file_path):
    pdf_file = open(file_path, 'rb')
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    num_pages = len(pdf_reader.pages)
    text = ""
    for page_number in range(num_pages):
        page_obj = pdf_reader.pages[page_number]
        text += page_obj.extract_text()
    pdf_file.close()
    return text

# set path
pdf_file_path = '/Users/USER/Desktop/projects/NeuralNavigate/neural-navigate-server/data/raw/BoundaryValueCaching1.pdf'

# extract text from pdf
text = extract_text_from_pdf(pdf_file_path)


### text preprocessing and segmentation ###

def preprocess_text(text):
    # lowercase text
    text = text.lower()

    # remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))

    # tokenize text
    words = nltk.word_tokenize(text)

    return words

words = preprocess_text(text)


### NLU and topic extraction ###

# for each preprocessed sentence, use GPT model to extract topics
# create Django view to handle file uploads
class FileUploadView(APIView):
    parser_class = (FileUploadParser)
    def post(self, request, *args, **kwags):
        if 'file' not in request.data:
            return Response({"error": "No file was included in the request"}, status=400)
        file = request.data['file']
        path = default_storage.save('tmp/' + file.name, file)

        text = extract_text_from_pdf(path)
        words = preprocess_text(text)

        # split the text into sentences (i.e. "segments")
        sentences = text.split('. ')
        topics = []

        for sentence in sentences[1:5]:
            openai.api_key = os.getenv("OPENAI_API_KEY")
            response = openai.Completion.create(
            model="text-davinci-003",
            prompt="Given the following sentence, extract all the topics related to Machine Learning and Artificial Intelligence." + sentence,
                max_tokens=100, temperature=0)
            
            # Add the extracted topics to the list
            topics.append(response.choices[0].text.strip())

        # Django view is reached via POST requests at /process/ 
        # return a JSON response containing the topics
        return JsonResponse({"topics": topics})

# # Check the topics
# for topic in topics:
#     print(topic)


# nlp = spacy.load("en_core_web_sm")

# # Entity Recognition before cleaning
# entities = []
# for doc in documents:
#     spacy_doc = nlp(doc)
#     entities.append([(entity.text, entity.label_) for entity in spacy_doc.ents])

# # You can print the entities of each document if you wish
# for i, doc_entities in enumerate(entities):
#     print(f"Entities in document {i+1}:")
#     for entity, label in doc_entities:
#         print(f"{entity} ({label})")

# # Text preprocessing
# stop = set(stopwords.words('english'))
# exclude = set(string.punctuation)
# lemma = WordNetLemmatizer()

# def clean(doc):
#     stop_free = " ".join([word for word in doc.lower().split() if word not in stop])
#     punc_free = ''.join(ch for ch in stop_free if ch not in exclude)
#     normalized = " ".join(lemma.lemmatize(word) for word in punc_free.split())
#     return normalized

# documents_clean = [clean(doc).split() for doc in documents]