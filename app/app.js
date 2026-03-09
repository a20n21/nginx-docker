const express = require('express')
const client = require('prom-client')

const app = express()

// métricas padrão
client.collectDefaultMetrics()

app.get('/', (req, res) => {
  res.send('API funcionando')
})

app.get('/error', (req, res) => {
  throw new Error('Erro de teste')
})

// endpoint para Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})

app.listen(3000, () => {
  console.log('Servidor rodando')
})