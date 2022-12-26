export const BASE_URL = `https://www.quora.com`;

export const PAGINATION_PARAMS = {
    // for some reason is capped at 10 for question search
    PAGINATION_BATCH: 100,
    ANSWER_PAGINATION_BATCH: 20,
} as const;
