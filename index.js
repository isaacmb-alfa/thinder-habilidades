const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoutes = require('./routes/users.route.js')
const skillsRoutes = require('./routes/skills.route')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(bodyParser.json())

// Usar las rutas de usuarios
app.use('/api/users', userRoutes)
app.use('/api/skills', skillsRoutes)

// Ruta base
app.get('/', (req, res) => {
  res.send('API funcionando correctamente')
})

// Escuchar en el puerto configurado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
