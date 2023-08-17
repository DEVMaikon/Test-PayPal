const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const paypal = require("paypal-rest-sdk");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', require('./routes'));

app.listen(3002, () => console.log('Rodando com sucesso na porta 3002'));