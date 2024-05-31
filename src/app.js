const express = require('express'); // crea el servidor
const morgan = require('morgan'); // librería de peticiones - confirma comunicacion con API
const cors = require('cors'); // permite la comunicación entre servicios que corren por diferentes puertos
const { Sequelize } = require('sequelize'); // conexión a la base de datos

// Inicializamos el servicio web
const app = express();
const port = 3000; // guiamos por dónde ingresará o recibiremos la información

// Middlewares -> funciones que se ejecutan entre petición y respuesta que vamos a dar
app.use(cors());
app.use(morgan());
app.use(express.json())

// ############# CONEXIÓN CON LA BASE DE DATOS por nombre de base de datos, usuario y contraseña ###################
const sequelize = new Sequelize (
    'cursonode',
    'root',
    '',{
        host: 'localhost',
        dialect: 'mysql'
    }
);

(async()=>{
    try{
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error){
        console.error('Error al conectar a la base de datos:', error);
    }
})();
// ################## FIN CONFIGURACIÓN A BASE DE DATOS ####################

// Definimos nuestro MODELO y su estructura / realizamos las importaciones
const { DataTypes } = require('sequelize');
const User = sequelize.define('users', {
    nroDocumento:{
        type: DataTypes.INTEGER(8),
        primaryKey: true // definimos clave primaria
    },
    firstName:{
        type: DataTypes.STRING (10), // definimos el tipo
        allowNull: false // definimos que no sea nulo
    },
    lastName:{
        type: DataTypes.STRING (10),
        allowNull: false
    }
});

// Sincronizamos el modelo con la Base de Datos
(async ()=>{
    try{
        await sequelize.sync();
        console.log("Modelo sincronizado con la Base de Datos");
    } catch (error){
        console.log('Error al sincronizar con la Base de Datos: '+error);
    }
})

// Definimos nuestras routes
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        msg: "¡Hola!, Estás accediendo a la super API del profe Ale :)"
    });
});

//############################################################################################
//ORM Sequaliaze -> creamos un modelo que es una tabla y nos permite modificarlo como un objeto
//ademas de hacer el CRUD, nos permite definir un módelo con tablas y registros con Entidades
// algo que mapee un objeto y que yo pueda manipular

// Enlistamos todos los usuarios actuales.
app.get('/users', (req, res) => {
    res.json({
        ok: true,
        listUser
    });
});

// Buscamos usuario por ID
app.get('/users/find/id', (req, res) => {
    const { query } = req;
    const { id } = query;

    const result = listUser.find((user) => {
        return user.id == 1
    });

    if (result) {
        res.status(200).json({
            ok: true,
            result
        })
    }
    else {
        res.status(404).json({
            ok: false,
            msg: 'Usuario no encontrado'
        })
    };
});

// Buscamos usuario por atributo
app.get('/users/find', (req, res) => {
    console.log("¡Buscando!");
    const { query } = req;
    console.log(query);
    
    // Desastructuración de objeto:
    /*
    const name = query.name; -> - menos exigente
    const lastname = query.lastname;
    */

    const { nroDocumento, lastName } = query; // -> + específico

    const result = listUser.find((user) => user.nroDocumento === name && user.lastName === lastName);

    if (result) {
        res.status(200).json({
            ok: true,
            result
        })
    } else {
        res.status(404).json({
            ok: false,
            msg: '¡¡No se encontraron resultados!! :('
        })
    };

});

// CREAR NUEVO USUARIO
app.post('/users/create', async (req, res) => {
    // Descontructuración de un objeto
    const { nroDocumento, firstName, lastName } = req.body;

    try{
        const newUser = await User.create(req.body);
        res.status(201).json({
            ok: true, // indicamos que todo va bien
            msg: 'Usuario creado con éxito',
            newUser
        })
    } catch (error){
        res.status(500).json({
            ok: false,
            error: "Error al crear usuario:"+error
        })
    }
});

// Editar un usuario
app.put("/users/edit/", (req, res) => {
    const id = req.query.id;
    const newData = req.body;

    const posUser = listUser.findIndex((user) => user.id == id);

    if (posUser < 0) res.status(404).json({
        ok: false,
        msg: `No existe el usuario con id: ${id}`
    });

    listUser[posUser] = {... listUser[posUser], ... newData};
    //listUser[posUser] = {... newData, id};

    res.status(200).json({
        ok:true,
        user: listUser[posUser]
    });

});

// Escuhamos en el puerto 3000
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

