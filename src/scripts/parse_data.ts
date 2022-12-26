import * as fs from 'fs'
import * as path from 'path'

const BASE_PATH = '.'
const JSON_PATH = `${BASE_PATH}/data.json`
// Typescript flattens and src dir in the main dir
const STORAGE_PATH = `${BASE_PATH}/storage`
const QUESTIONS_PATH = `${STORAGE_PATH}/datasets/default`
const ANSWERS_PATH = `${STORAGE_PATH}/key_value_stores/default`

let json = []
const isJsonExists = fs.existsSync(path.join(JSON_PATH))
if (isJsonExists) {
    const jsonData = fs.readFileSync(path.join(JSON_PATH), 'utf8');
    json = JSON.parse(jsonData)
}
const qids = new Set(json.map(({qid}) => qid))

const questionsFiles = fs.readdirSync(path.join(QUESTIONS_PATH));
questionsFiles.forEach(questionFileName => {
    const questionFilePath = `${QUESTIONS_PATH}/${questionFileName}`
    const questionFileData = fs.readFileSync(path.join(questionFilePath), 'utf8');
    const question = JSON.parse(questionFileData)

    const isDuplicatedQuestion = qids.has(question.qid)
    if(isDuplicatedQuestion) {
        return
    }

    const answersFileName = `qid_${question.qid}_answers`
    const answersFilePath = `${ANSWERS_PATH}/${answersFileName}.json`
    try {
        const answersFileData = fs.readFileSync(path.join(answersFilePath), 'utf8');
        const answers = JSON.parse(answersFileData)
        
        question.answers = answers
        json.push(question)
    } catch(e) {
        console.log(e)
    }
})

fs.writeFileSync(path.join(JSON_PATH), JSON.stringify(json))
