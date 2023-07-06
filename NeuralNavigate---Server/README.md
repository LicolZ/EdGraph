# NeuralNavigate---Server
EdTech tool leveraging machine learning to deconstruct complex research papers and generate interactive learning graphs. These graphs serve as intuitive roadmaps, guiding users through the learning journey by mapping key sequential patterns between necessary foundational concepts within any given research paper.

Phase 1: Ideation and Conceptualization

Identified a problem space in the realm of academic research, where complex research papers can be hard to understand without background knowledge.
Brainstormed potential solutions and decided to create a machine learning-based tool that can analyze research papers and produce interactive learning graphs.
Drafted project proposal, identifying key objectives and potential challenges.

Phase 2: Research and Tool Selection

Conducted research on available machine learning, NLP, and graph visualization technologies.
Decided to use technologies such as TensorFlow, PyTorch, Hugging Face's Transformers, Gensim, SpaCy, Networks, etc.

Phase 3: Data Collection and Preprocessing 

Gathered a dataset of research papers from various academic sources (primarily utilising Nvidia's graphic simulation publications).

**Currently** preprocessing the text data, including tasks like tokenization, removal of stop words, and lemmatization using SpaCy.
Breaking down concepts in research papers and creating edge/node relationships between those concepts. 
This is the most time-consuming part of the project as I  have to preprocess many, many papers before I can begin training the model.

---------- TO DO ----------

Phase 4: Machine Learning and NLP Model Training

Used TensorFlow and PyTorch to train machine learning models on the dataset.
Leveraged Transformer models for summarizing complex research papers and extracting key concepts.
Validated the model's performance and made necessary adjustments.

Phase 5: Knowledge Graph Construction (partially completed)

Applied the trained models to extract key concepts and their relationships from research papers.
Began developing algorithms to construct knowledge graphs based on these relationships using NetworkX.

Phase 6: Graph Visualization and UI Design (to be started)

Plan to use D3.js and React.js to build an interactive front-end that can display the learning graphs and provide intuitive navigation.
Aiming to involve potential users in the design process to ensure usability and effectiveness.

Phase 7: Backend Development and Database Management (to be started)

Will develop a robust backend using a suitable server-side language.
Planning to set up a database system for managing user data and storing graph data.

Phase 8: Testing and Iteration (to be started)

Will conduct rigorous testing to identify and fix bugs.
Plan to gather user feedback and make iterative improvements based on this feedback.

Phase 9: Deployment and Maintenance (to be started)

Will deploy the final product and provide ongoing maintenance and updates.
Aiming to ensure high reliability and user satisfaction.

Phase 10: Integration with Existing Learning Management Systems (future scope)

In the long run, planning to integrate the tool with existing Learning Management Systems (LMS) using standards like xAPI, LTI, and SCORM.
