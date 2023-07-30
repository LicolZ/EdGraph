from scripts.extract_topics import ProcessFile

if __name__ == "__main__":
    # Provide a path to a PDF file for testing
    test_pdf_path = "/Users/USER/Desktop/projects/NeuralNavigate/neural-navigate-server/myproject/data/raw/BoundaryValueCaching1.pdf"
    process_file = ProcessFile(test_pdf_path)
    topics = process_file.extract_topics()
    print(topics)