import { QueryType } from "./query_types.js";

export type QueryArguments = {
    [QueryType.SEARCH]: {
        query: string;
        first: number;
        after: string;
        tribeId: null;
        time: "all_times";
        author: null;
        resultType: "question";
        disableSpellCheck: null;
    };
    [QueryType.QUESTION_ANSWERS]: {
        qid: string | number;
        first: number;
        after: null;
        forceScoreVersion: "ranking_toggle_upvote";
    };
};

export const nonConfigurableQueryArguments = {
    [QueryType.SEARCH]: {
        tribeId: null,
        time: "all_times",
        author: null,
        resultType: "question",
        disableSpellCheck: null,
    },
    [QueryType.QUESTION_ANSWERS]: {
        forceScoreVersion: "ranking_toggle_upvote",
    },
} as const;
