import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = 8000
const API_KEY = process.env.API_KEY

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-req'],
    preflightContinue: false, // Garante que o middleware CORS lide com OPTIONS
  }),
)

app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://sas.sebrae.com.br/SasServiceCliente/Cliente',
    changeOrigin: true,
    timeout: 10000,
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('x-req', API_KEY)
      proxyReq.setHeader('Accept', 'application/json')
    },
    onError: (err, req, res) => {
      console.error('Erro no proxy:', err)
      res.status(500).json({ error: 'Erro ao conectar ao serviço remoto' })
    },

    pathRewrite: {
      '^/api': '',
    },
  }),
)

app.listen(PORT, () => {
  console.log(`Proxy rodando em http://localhost:${PORT}`)
})
