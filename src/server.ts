import express from 'express'
import { router } from '@/routes'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 3333)

app.use(cors())
app.use(express.json())

app.use(router)

app.listen(port, () => console.log(`💰🚀 server running on port ${port}`))
