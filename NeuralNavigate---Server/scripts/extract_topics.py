import os
import PyPDF2
import spacy
import string
from nltk.corpus import stopwords
from nltk.stem.wordnet import WordNetLemmatizer

# Define function
def get_text_from_pdf(file_path):
    pdf_file_obj = open(file_path, 'rb')
    pdf_reader = PyPDF2.PdfReader(pdf_file_obj)
    num_pages = len(pdf_reader.pages)
    text = ''
    for page_number in range(num_pages):
        page_obj = pdf_reader.pages[page_number]
        text += page_obj.extract_text()
    pdf_file_obj.close()
    return text

# Set path
directory_path = '/Users/USER/Desktop/projects/EdGraph/data/raw'
pdf_files = [f for f in os.listdir(directory_path) if f.endswith('.pdf')]
documents = [get_text_from_pdf(os.path.join(directory_path, pdf_file)) for pdf_file in pdf_files]

nlp = spacy.load("en_core_web_sm")

# Entity Recognition before cleaning
entities = []
for doc in documents:
    spacy_doc = nlp(doc)
    entities.append([(entity.text, entity.label_) for entity in spacy_doc.ents])

# You can print the entities of each document if you wish
for i, doc_entities in enumerate(entities):
    print(f"Entities in document {i+1}:")
    for entity, label in doc_entities:
        print(f"{entity} ({label})")

# Text preprocessing
stop = set(stopwords.words('english'))
exclude = set(string.punctuation)
lemma = WordNetLemmatizer()

def clean(doc):
    stop_free = " ".join([word for word in doc.lower().split() if word not in stop])
    punc_free = ''.join(ch for ch in stop_free if ch not in exclude)
    normalized = " ".join(lemma.lemmatize(word) for word in punc_free.split())
    return normalized

documents_clean = [clean(doc).split() for doc in documents]