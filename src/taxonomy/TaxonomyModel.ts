import { BehaviorSubject } from "rxjs";
import { Taxonomy } from "./TaxonomyDTO";

export default function TaxonomyModel() {
    let token: string | null = null;

    const data: Taxonomy = {
        currentWord: '',
        words: [],
        relations: []
    };
    const taxonomy$ = new BehaviorSubject(data);

    setTimeout(async () => {
        await init();
    });

    async function init() {
        const tok = localStorage.getItem('token');
        if (tok) {
            token = tok;
        } else {
            const tok = await generateToken();
            localStorage.setItem('token', tok);
            token = tok;
        }
        
        setTimeout(async () => {
            if (token === null) return;
            const graph = await fetchCurrentGraphForToken(token);
            taxonomy$.next(graph);
        });
    }

    async function generateToken() {
        const response = await fetch('/api/token', {method: 'POST'});
        return await response.json();
    }

    async function fetchCurrentGraphForToken(token: string) {
        const response = await fetch('/api/current?uid=' + token);
        return await response.json();
    }

    function navigateToRoot() {
        setTimeout(async() => {
            taxonomy$.next(await fetchGraphCenteredToWord(null));
        });
    }

    function navigateToWord(id: string) {
        setTimeout(async () => {
            taxonomy$.next(await fetchGraphCenteredToWord(id));
        });
    }

    async function fetchGraphCenteredToWord(id: string | null) {
        const body = JSON.stringify({
            uid: token,
            start_node: id
        });
        const response = await fetch('/api/centered', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        });
        return await response.json();
    }

    function generateWords() {
        setTimeout(() => {
            const prev = taxonomy$.value;
            const newId = (prev.words.length + 1).toString();
            taxonomy$.next({
                currentWord: prev.currentWord,
                words: [
                    ...prev.words,
                    {id: newId, word: `word ${newId}`, level: 10, lemmas: [], definition: ''}
                ],
                relations: [
                    ...prev.relations,
                    {parent: prev.currentWord, child: newId}
                ]
            });
        }, 500);
    }

    function regenerateGraph() {
        setTimeout(async () => {
            localStorage.removeItem('token');
            await init();
        });
    }

    return {
        taxonomy$,
        navigateToRoot,
        navigateToWord,
        generateWords,
        regenerateGraph
    };
}
