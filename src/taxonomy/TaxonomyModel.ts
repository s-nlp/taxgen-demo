import { BehaviorSubject } from "rxjs";
import { Taxonomy } from "./TaxonomyDTO";

export default function TaxonomyModel() {
    const data = {
        currentWord: 3,
        words: [
            { id: 1, word: "word 1" },
            { id: 2, word: "word 2" },
            { id: 3, word: "word 3" },
            { id: 4, word: "word 4" },
            { id: 5, word: "word 5" },
        ],
        relations: [
            { parent: 1, child: 3 },
            { parent: 1, child: 2 },
            { parent: 2, child: 4 },
            { parent: 2, child: 5 },
        ]
    };

    const taxonomy$ = new BehaviorSubject<Taxonomy>(data);

    function navigateToWord(id: number) {
        setTimeout(() => {
            const prev = taxonomy$.value;
            taxonomy$.next({
                currentWord: id,
                words: prev.words,
                relations: prev.relations
            });
        }, 500);
    }

    function generateWords() {
        setTimeout(() => {
            const prev = taxonomy$.value;
            const newId = prev.words.length + 1;
            taxonomy$.next({
                currentWord: prev.currentWord,
                words: [
                    ...prev.words,
                    {id: newId, word: `word ${newId}`}
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
        navigateToWord,
        generateWords
    };
}
