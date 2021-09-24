import express from 'express'
import { promisify } from 'util'
import { Searcher } from './search'
import { parseNum, simplify } from './utils'


const app = express()
const port = 8080
const courses = new Searcher()

app.use(express.json())
app.use(express.urlencoded({ extended: true, parameterLimit: 10 }))

app.post('/api/busca', (req, res) => {
    const { query, limit, codes } = req.body
    if (typeof query !== 'string') {
        res.sendStatus(400)
        return
    }

    const result = courses.search(query, Boolean(codes), parseNum(limit))
        .map(({ code, name }) => ({ code, name }))

    res.json(result)
})

const OPTIONS = {
    simplify: false,
    wait: -1_000
}

type OPTIONS = typeof OPTIONS

function setOption<K extends keyof OPTIONS>(name: K, update: (value: OPTIONS[K], input?: string) => OPTIONS[K]) {

    app.get(`/${name}`, (_, res) => {
        res.send(`current: '${OPTIONS[name]}'`)
    })

    app.post([`/${name}`, `/${name}/:value`], (req, res) => {
        const oldValue = OPTIONS[name]
        const newValue = update(oldValue, req.params.value)
        OPTIONS[name] = newValue

        res.send(`'${oldValue}' to '${newValue}'`)
    })
}

setOption('simplify', (value, input) => {
    if (input) {
        return input !== 'false'
    } else {
        return !value
    }
})
setOption('wait', (value, input) => {
    const inputTime = Number(input)
    if (Number.isFinite(inputTime)) {
        return inputTime
    } else {
        return -value
    }
})

app.get('/api/disciplina/:code', async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, OPTIONS.wait))

    const code = req.params.code
    const result = courses.find(code)
    if (!result) {
        res.sendStatus(404)
        return
    }

    if (OPTIONS.simplify) {
        res.json(simplify(result))
    } else {
        res.json(result)
    }
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

for (const code of courses.allCodes()) {
    if (!code.match(/[A-Z][A-Z ][0-9][0-9][0-9]/)) {
        console.log(code)
    }
}
