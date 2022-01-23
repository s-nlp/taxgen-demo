from collections import defaultdict

from nltk.corpus import wordnet as wn
from string import punctuation


def get_graph_with_node(start_node):
    hyponyms = [(i.name(), 4) for i in wn.synset(start_node).hyponyms()]
    second_hyponyms = [(j.name(), 5) for i, _ in hyponyms for j in wn.synset(i).hyponyms()]
    co_hypernyms = [(j.name(), 2) for i, _ in hyponyms for j in wn.synset(i).hypernyms()]

    hypernyms = [(i.name(), 2) for i in wn.synset(start_node).hypernyms()]
    second_hypernyms = [(j.name(), 1) for i, _ in hypernyms for j in wn.synset(i).hypernyms()]
    co_hyponyms = [(j.name(), 3) for i, _ in hypernyms for j in wn.synset(i).hyponyms()]

    all_nodes = hyponyms + second_hyponyms + co_hypernyms + hypernyms + second_hypernyms + co_hyponyms

    nodes, relations = _get_relations(all_nodes)

    return {
        'currentWord': start_node,
        'words': [
            {
            'id': node, 
            'word': node, 
            'level': level, 
            'definition': wn.synset(node).definition(), 
            'lemmas': [i.name().replace("_", " ") for i in wn.synset(node).lemmas()],
            }
            for (node, level) in nodes.items()
        ],
        'relations': relations
    }


def _get_relations(all_nodes):
    all_nodes = sorted(all_nodes, key=lambda x: x[1])
    graph = set()
    nodes = defaultdict(lambda: -1)

    for node1, level1 in all_nodes:
        level1 = max(nodes[node1], level1)
        for node2, level2 in all_nodes:
            level2 = max(nodes[node2], level2)
            if wn.synset(node1) in wn.synset(node2).hypernyms():
                graph.add((node1, node2))
                if level1 == level2:
                    level2 += 1

            elif wn.synset(node1) in wn.synset(node2).hyponyms():
                graph.add((node2, node1))
                if level1 == level2:
                    level1 += 1

            nodes[node1] = max(nodes[node1], level1)
            nodes[node2] = max(nodes[node2], level2)

    return nodes, [{'parent': parent, 'child': child} for (parent, child) in graph]


def predict_new_nodes(fasttext_model, start_node, all_lemmas):
    word = [i.name() for i in wn.synset(start_node).lemmas()][0]
    return [i[1] for i in fasttext_model.get_nearest_neighbors(word, 100)
            if i[1].lower().strip(punctuation) not in all_lemmas and word not in i[1]][:10]
