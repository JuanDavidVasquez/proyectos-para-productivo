'use strict'

const express = require ('express')
//cargar modulos de node
const bodyParser = require('body-parser');
//const cookieparser= require ('cookie-parser');
const path = require('path');
const { use } = require('./routes/user');
const app = express();


//cargar archivos rutas
var user_routes = require('./routes/user');
var aspirante_routes = require('./routes/aspirante');
var noticia_routes = require('./routes/noticia');
var certificado_routes = require('./routes/certificado');
var perfilLaboral_routes = require('./routes/perfilLaboral');
var perfilAcadmico_routes = require('./routes/perfilAcademico');
var salud_routes = require('./routes/salud');
var vivienda_routes = require('./routes/vivienda');
var debilidad_routes = require('./routes/debilidad');
var judicial_routes = require('./routes/judicial');
var vicio_routes = require('./routes/vicio');
var generalidad_routes = require('./routes/generalidad');
var ofertaLaboral_routes = require('./routes/ofertaLaboral');


var follow_routes = require('./routes/follow');
const follow = require('./models/follow');


//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    //En lugar de * va la url permitida u origenes permitidos
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//rutas static

//app.use(express.static(path.join(__dirname,'client')));
app.use('/', express.static('client', {redirect:false}));

//rutas
app.use('/api', user_routes);
app.use('/api', noticia_routes);
app.use('/api', aspirante_routes);
app.use('/api', certificado_routes);
app.use('/api', follow_routes);
app.use('/api', perfilLaboral_routes);
app.use('/api', perfilAcadmico_routes);
app.use('/api', salud_routes);
app.use('/api', vivienda_routes);
app.use('/api', debilidad_routes);
app.use('/api', judicial_routes);
app.use('/api', vicio_routes);
app.use('/api', generalidad_routes);
app.use('/api', ofertaLaboral_routes);
app.use(require('./routes/cerificadolaboralroute'));

app.get('*', function(req,res,next){
    return res.sendFile(path.resolve('client/index.html'));
});



//exportar
module.exports = app;