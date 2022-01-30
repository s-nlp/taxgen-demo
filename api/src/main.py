#!flask/bin/python
from flask import Flask, jsonify, request, abort, send_file
import fasttext
import uuid
from nltk.corpus import wordnet as wn
from helpers import get_graph_with_node, predict_new_nodes


ft = fasttext.load_model("cc.en.300.bin")

all_lemmas = list(wn.all_lemma_names('n'))
app = Flask(__name__)

opened_sessions = {}
root = "entity.n.01"


@app.post('/token')
def get_new_session():
    uid = str(uuid.uuid4())
    return jsonify(uid)


@app.get('/current')
def get_current_graph():
    uid = request.args['uid']
    if not uid:
        abort(400)
        return

    graph = opened_sessions.get(uid, None)
    if graph is None:
        graph = get_graph_with_node(root)
        opened_sessions[uid] = graph
    return jsonify(graph)


@app.get('/images/<node_id>')
def get_image(node_id):
    filename = 'coton.jpeg'
    return send_file(filename, mimetype='image/jpeg')


@app.post('/centered')
def center_graph_to():
    json = request.json
    uid = json['uid']
    start_node = json['start_node']
    if not uid:
        abort(400)
        return
    if not start_node:
        start_node = root

    graph = get_graph_with_node(start_node)
    opened_sessions[uid] = graph
    return jsonify(graph)


@app.route('/generate', methods=['GET', 'POST'])
def generate_subgraph():
    if not request.json or 'start_node' not in request.json:
        abort(400)
    start_node = request.json.get('start_node')
    return jsonify(predict_new_nodes(ft, start_node, all_lemmas=all_lemmas))


if __name__ == '__main__':
    app.run(port=8888, host='0.0.0.0', debug=True, use_reloader=False)
