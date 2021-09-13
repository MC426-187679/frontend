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
    wait: false
}

function setOption(name: keyof typeof OPTIONS) {
    app.get(`/${name}`, (_, res) => {
        res.send(OPTIONS[name])
    })
    app.post(`/${name}`, (_, res) => {
        const old = OPTIONS[name]
        OPTIONS[name] = !old

        res.send(`'${old}' to '${OPTIONS[name]}'`)
    })
}

setOption('simplify')
setOption('wait')

app.get('/api/disciplina/:code', async (req, res) => {
    if (OPTIONS.wait) {
        const pause = promisify((ms: number, cb: () => void) => setTimeout(cb, ms))
        await pause(1_000)
    }

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
