from scripts.extract_topics import ProcessFile

if __name__ == "__main__":
    # Provide a path to a PDF file for testing
    test_pdf_path = "/Users/USER/Desktop/projects/NeuralNavigate/neural-navigate-server/myproject/data/raw/BoundaryValueCaching1.pdf"

    # Instantiate the ProcessFile object
    process_file = ProcessFile(test_pdf_path)
    
    # Extract topics from the PDF file
    topics = process_file.extract_topics()
    print("Topics extracted:")
    for topic in topics:
        print(topic)

    # Fetch relationships between topics
    relationships = process_file.fetch_topic_relationships(topics)
    print("\nTopic relationships:")
    for relationship in relationships:
        print(" -> ".join(relationship))