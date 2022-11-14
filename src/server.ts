import express, { Router, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 3333)

const route = Router()

app.use(cors())
app.use(express.json())

route.get('/', (req: Request, res: Response) => {
  res.json({ message: 'hello world' })
})

app.use(route)

app.listen(port, () => console.log(`💰🚀 server running on port ${port}`))
