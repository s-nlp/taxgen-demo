import { BehaviorSubject } from "rxjs";
import { Taxonomy } from "./TaxonomyDTO";

export default function TaxonomyModel() {
    const data = {
        currentWord: '',
        words: [],
        relations: []
    };
    const taxonomy$ = new BehaviorSubject<Taxonomy>(data);

    setTimeout(async () => {
        const currentWord = localStorage.getItem('currentWord');

        if (!currentWord) {
            taxonomy$.next(await fetchGraphForRoot());
        } else {
            taxonomy$.next(await fetchGraphForWord(currentWord));
        }
    });

    function navigateToRoot() {
        localStorage.removeItem('currentWord');

        setTimeout(async() => {
            taxonomy$.next(await fetchGraphForRoot());
        });
    }

    function navigateToWord(id: string) {
        localStorage.setItem('currentWord', id);

        setTimeout(async () => {
            taxonomy$.next(await fetchGraphForWord(id));
        });
    }

    async function fetchGraphForRoot() {
        const response = await fetch('/api/initial');
        return await response.json();
    }

    async function fetchGraphForWord(id: string) {
        const body = JSON.stringify({
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

    return {
        taxonomy$,
        navigateToRoot,
        navigateToWord,
        generateWords
    };
}
