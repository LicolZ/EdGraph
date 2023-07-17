import networkx as nx
import matplotlib.pyplot as plt

# Create a graph
G = nx.DiGraph()

# Add nodes (topics)
topics = ["Grid-free Monte Carlo methods", "Walk on spheres", 
          "Elliptic partial differential equations", "Mesh generation", 
          "Global solves", "Fast caching strategy", 
          "Boundary integral formulation", "Virtual point light methods", 
          "Photorealistic rendering"]


for topic in topics:
    G.add_node(topic)

# Add edges (relationships)
relationships = [
    ("Elliptic partial differential equations", "Grid-free Monte Carlo methods"),
    ("Grid-free Monte Carlo methods", "Walk on spheres"),
    ("Boundary integral formulation", "Fast caching strategy"),
    ("Global solves", "Fast caching strategy"),
    ("Photorealistic rendering", "Virtual point light methods"),
]


for relationship in relationships:
    G.add_edge(*relationship)

# Save the graph to a GraphML file
nx.write_graphml(G, "monte_carlo_walk_on_spheres_graph.graphml")