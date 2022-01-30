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


@app.route('/token', methods=['GET', 'POST'])
def get_new_session():
    uid = str(uuid.uuid1())
    get_initial_graph(uid)
    return jsonify(uid)


@app.route('/current/', methods=['GET', 'POST'])
def get_current_position(uid=None):
    if uid is None:
        uid = request.args['uid']
    return opened_sessions[uid]


@app.route('/images/<node_id>', methods=['GET'])
def get_image(node_id):
    filename = 'coton.jpeg'
    return send_file(filename, mimetype='image/jpeg')


@app.route('/initial/', methods=['GET', 'POST'])
def get_initial_graph(uid=None):
    if uid is None:
        uid = request.args['uid']
    result = get_centered_graph(uid, "entity.n.01")
    return result


@app.route('/centered/', methods=['GET', 'POST'])
def get_centered_graph(uid=None, start_node=None):
    if uid is None:
        uid = request.json.get('uid')
    if (request.json and 'start_node' in request.json) or start_node is not None:
        if start_node is None:
            start_node = request.json.get('start_node')
        result = jsonify(get_graph_with_node(start_node))
        opened_sessions[uid] = result
        return result
    else:
        abort(400)


@app.route('/generate', methods=['GET', 'POST'])
def generate_subgraph():
    if not request.json or 'start_node' not in request.json:
        abort(400)
    start_node = request.json.get('start_node')
    return jsonify(predict_new_nodes(ft, start_node, all_lemmas=all_lemmas))


if __name__ == '__main__':
    app.run(port=8888, host='0.0.0.0', debug=True, use_reloader=False)
