import * as fs from 'fs'
import * as path from 'path'

const PATH = './existing_qids.json'

let allQuestionFileNames = new Set(
    JSON.parse(
        fs.readFileSync(
            path.join(PATH),
            'utf8',
        )
    )
)
const questionsPath = `./storage/datasets/default`
const questionFileNames = new Set(fs.readdirSync(path.join(questionsPath)))
allQuestionFileNames = new Set([...allQuestionFileNames, ...questionFileNames])
fs.writeFileSync(
    path.join(PATH),
    JSON.stringify([...allQuestionFileNames]),
)