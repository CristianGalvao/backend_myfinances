const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const database = require('./database/database')

const register_controller = require('./controller/register_controller')
app.use("/", register_controller)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port} na URL: http://localhost:${port}`);
});
