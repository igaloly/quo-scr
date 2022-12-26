import * as fs from 'fs'
import * as path from 'path'

const BASE_PATH = '.'
const STORAGE_PATH = `${BASE_PATH}/storage`
const QUESTIONS_PATH = `${STORAGE_PATH}/datasets/default`

const questionsFiles = fs.readdirSync(path.join(QUESTIONS_PATH));
questionsFiles.forEach(questionFileName => {
    // Huristic
    const shouldBeRenamed = questionFileName.startsWith('000')
    if(!shouldBeRenamed) {
        return
    }
    const questionFilePath = `${QUESTIONS_PATH}/${questionFileName}`
    const questionFileData = fs.readFileSync(path.join(questionFilePath), 'utf8');
    const question = JSON.parse(questionFileData)
    const questionNewPath = `${QUESTIONS_PATH}/${question.qid}.json`
    fs.renameSync(questionFilePath, questionNewPath)
})
