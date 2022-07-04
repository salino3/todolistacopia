// npm install cors
// npm install -g nodemon
//> nodemon server.js -->  por levantar server
// npm install --save body-parser --> para que entienda file JSON
// npm install jsonwebtoken --save

var express = require("express");
var cors = require('cors');
var bp = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('./configs/config')

var app = express();
var corsOpt = {
  origin: 'http://localhost:4200',
  optionsSuccesStatus: 200
}

var tareas = [ 
  { _id: 1, trabajo: "primera tarea", usuario: "David  Gonzales" },
  { _id: 2, trabajo: "segunda tarea", usuario: "Daniel Torres" },
];

var users = [];

//

app.use(bp.json());// parsea el body de las peticiones en 'json'
var api = express.Router();
var auth = express.Router();

api.use(cors());// aplicar siempre politica de 'CORS'


api.get("/tareas", cors(corsOpt), (req, res) => {
  res.json(tareas);
}); 

api.get("/tareas/:username", cors(corsOpt), (req, res) => {
  var username = req.params.username;
  var resultado = tareas.filter(tarea => tarea.usuario == username)
  res.json(resultado);
}); 


api.post("/tarea", cors(corsOpt), (req, res) => {
tareas.push(req.body);
res.json(req.body); 
});

//* aplicando politica de 'CORS' con 'auth'
auth.use(cors());

auth.post("/register", cors(corsOpt), (req, res) => {
  var index = users.push(req.body) -1;
  var user = users[index];
  user.id = index;
  var token = jwt.sign(user.id, config.llave);
  res.json({nombre: user.nombre, token});
}); 

app.use("/api", api);
app.use("/auth", auth);

app.listen(7070);