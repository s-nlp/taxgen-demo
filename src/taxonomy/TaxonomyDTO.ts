
export interface Taxonomy {
    currentWord: string;
    words: Word[];
    relations: Relation[];
}

export interface Word {
    id: string;
    word: string;
    level: number;
}

export interface Relation {
    parent: string;
    child: string;
}
