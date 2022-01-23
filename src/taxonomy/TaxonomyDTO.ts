
export interface Taxonomy {
    currentWord: string;
    words: Word[];
    relations: Relation[];
}

export interface Word {
    id: string;
    word: string;
    level: number;
    definition: string;
    lemmas: string[];
}

export interface Relation {
    parent: string;
    child: string;
}
