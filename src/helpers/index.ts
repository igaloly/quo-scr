import * as fs from 'fs'
import * as path from 'path'
import { RequestOptions } from "crawlee";
import { BASE_URL } from "../constants/api.js";
import { QueryArguments } from "../types/query_arguments.js";
import { QueryType } from "../types/query_types.js";


const PERSISTANT_STORAGE_PATH = {
    questions: `./quora_data/datasets/default`,
    answers: `./quora_data/key_value_stores/default`
}
const TEMP_STORAGE_PATH = {
    questions: `./storage/datasets/default`,
    answers: `./storage/key_value_stores/default`
}

export const constructGraphQLRequest = <T extends QueryType>(
    queryType: T,
    queryArgs: QueryArguments[T]
): RequestOptions => {
    const url = constructGraphQLUrl(queryType);

    return {
        uniqueKey: url + JSON.stringify(queryArgs),
        url,
        method: "POST",
        userData: {
            initialPayload: {
                queryName: queryType,
                variables: queryArgs,
            },
            operationType: queryType,
        },
        label: queryType.toString(),
    };
};

const constructGraphQLUrl = (queryType: QueryType): string => {
    return `${BASE_URL}/graphql/gql_para_POST?q=${queryType}`;
};

export const parseJsonContent = (contentObj: string): string => {
    const matches = [...contentObj.matchAll(/"text":[ ]?"(.*?)"/g)];
    if (matches.length === 0) {
        return contentObj;
    }
    return matches.map((match) => match[1]).join("");
};

export const combineUrl = (url: string, base = BASE_URL): string => {
    return new URL(url, base).toString();
};

export const unixToDateIso = (timestamp: number, divider = 1000): string => {
    return new Date(timestamp / divider).toISOString();
};

export const removeDuplicatesByProperty = <
    T extends { [k in K]: string | number | symbol },
    K extends keyof T
>(
    objects: T[],
    key: K
): T[] => {
    const uniqueObjects = objects.reduce((acc, obj) => {
        if (!acc[obj[key]]) {
            acc[obj[key]] = obj;
        }
        return acc;
    }, {} as { [key in T[K]]: T });

    return Object.values(uniqueObjects);
};

export const constructAnswersKVKey = (qid: string): string => {
    return `qid_${qid}_answers`;
};

export const isAnswersKVKey = (
    key: string
): { is: false; qid: null } | { is: true; qid: string } => {
    if (key.startsWith("qid_") && key.endsWith("_answers")) {
        return {
            is: true,
            qid: key.replace("qid_", "").replace("_answers", ""),
        };
    }
    return {
        is: false,
        qid: null,
    };
};

export const getAllExistingQuestions = () => {
    return new Set(
        JSON.parse(
            fs.readFileSync(
                path.join('./existing_qids.json'),
                'utf8'
            )
        )
    )
}

export const renameQuestions = () => {
    const questionsFiles = fs.readdirSync(path.join(TEMP_STORAGE_PATH.questions));
    questionsFiles.forEach(questionFileName => {
        // Huristic
        const shouldBeRenamed = questionFileName.startsWith('000')
        if(!shouldBeRenamed) {
            return
        }
        const questionFilePath = `${TEMP_STORAGE_PATH.questions}/${questionFileName}`
        const questionFileData = fs.readFileSync(path.join(questionFilePath), 'utf8');
        const question = JSON.parse(questionFileData)
        const questionNewPath = `${TEMP_STORAGE_PATH.questions}/${question.qid}.json`
        fs.renameSync(questionFilePath, questionNewPath)
    })
}

export const moveQuestions = () => {
    const questionsFiles = fs.readdirSync(path.join(TEMP_STORAGE_PATH.questions));
    questionsFiles.forEach(questionFileName => {
        fs.renameSync(
            path.join(TEMP_STORAGE_PATH.questions, questionFileName),
            path.join(PERSISTANT_STORAGE_PATH.questions, questionFileName)
        )
    })
}
export const moveAnswers = () => {
    const answersFiles = fs.readdirSync(path.join(TEMP_STORAGE_PATH.answers));
    const ignoreFiles = ['CRAWLEE_STATE', 'SDK_CRAWLER_STATISTICS_0','SDK_SESSION_POOL_STATE']
    answersFiles.forEach(answersFileName => {
        const shouldNotMove = ignoreFiles.some(fileToIgnore => answersFileName.startsWith(fileToIgnore))
        if(shouldNotMove) {
            return
        }
        fs.renameSync(
            path.join(TEMP_STORAGE_PATH.answers, answersFileName),
            path.join(PERSISTANT_STORAGE_PATH.answers, answersFileName)
        )
    })
}