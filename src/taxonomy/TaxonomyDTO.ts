
export interface Taxonomy {
    currentWord: number;
    words: Word[];
    relations: Relation[];
}

export interface Word {
    id: number;
    word: string;
}

export interface Relation {
    parent: number;
    child: number;
}
