from nltk.corpus import wordnet as wn
from string import punctuation


def get_graph_with_node(start_node):
    graph = set()

    hyponyms = [i.name() for i in wn.synset(start_node).hyponyms()]
    second_hyponyms = [j.name() for i in hyponyms for j in wn.synset(i).hyponyms()]
    co_hypernyms = [j.name() for i in hyponyms for j in wn.synset(i).hypernyms()]

    hypernyms = [i.name() for i in wn.synset(start_node).hypernyms()]
    second_hypernyms = [j.name() for i in hypernyms for j in wn.synset(i).hypernyms()]
    co_hyponyms = [j.name() for i in hypernyms for j in wn.synset(i).hyponyms()]

    all_nodes = hyponyms + second_hyponyms + co_hypernyms + hypernyms + second_hypernyms + co_hyponyms

    for node1 in all_nodes:
        for node2 in all_nodes:
            if wn.synset(node1) in wn.synset(node2).hypernyms():
                graph.add((node1, node2))
            elif wn.synset(node1) in wn.synset(node2).hyponyms():
                graph.add((node2, node1))

    return list(graph)


def predict_new_nodes(fasttext_model, start_node, all_lemmas):
    word = [i.name() for i in wn.synset(start_node).lemmas()][0]
    return [i[1] for i in fasttext_model.get_nearest_neighbors(word, 100)
            if i[1].lower().strip(punctuation) not in all_lemmas and word not in i[1]][:10]
