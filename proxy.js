import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import cors from 'cors'

const app = express()
const PORT = 8000
const API_KEY = import.meta.env.VITE_API_KEY

app.use(cors())

app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://homolog-sas.sebrae.com.br/SasServiceCliente/Cliente',
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
