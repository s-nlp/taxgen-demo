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

    function navigateToSearch(search: string) {
        setTimeout(async () => {
            if (search.length) {
                const id = await fetchSearch(search);
                if (id.length) {
                    taxonomy$.next(await fetchGraphCenteredToWord(id));
                } else {
                    return false;
                }
                
            } else {
                return false;
            }
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

    async function fetchSearch(search: string) {
        const response = await fetch('/api/search_node?node_name=' + search);
        return await response.json();
    }

    function generateWords(id: string) {
        setTimeout(async () => {
            taxonomy$.next(await fetchGeneratedGraphWords(id));
        });
    }

    async function fetchGeneratedGraphWords(id: string) {
        const body = JSON.stringify({
            uid: token,
            start_node: id
        });
        const response = await fetch('/api/generate/words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        });
        return await response.json();
    }

    function generateRelations(fromId: string, toId: string) {
        setTimeout(async () => {
            taxonomy$.next(await fetchGeneratedGraphRelations(fromId, toId));
        });
    }

    async function fetchGeneratedGraphRelations(fromId: string, toId: string) {
        const body = JSON.stringify({
            uid: token,
            start_node: fromId,
            end_node: toId
        });
        const response = await fetch('/api/generate/relations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        });
        return await response.json();
    }

    function regenerateGraph(currentWord: string) {
        setTimeout(async () => {
            localStorage.removeItem('token');
            const tok = await generateToken();
            localStorage.setItem('token', tok);
            token = tok;
            const graph = await fetchGraphCenteredToWord(currentWord);
            taxonomy$.next(graph);
        });
    }

    return {
        taxonomy$,
        navigateToRoot,
        navigateToWord,
        navigateToSearch,
        generateWords,
        generateRelations,
        regenerateGraph
    };
}
