const express = require('express'); // crea el servidor
const morgan = require('morgan'); // librería de peticiones - confirma comunicacion con API
const cors = require('cors'); // permite la comunicación entre servicios que corren por diferentes puertos

// Inicializamos el servicio web
const app = express();
const port = 3000; // guiamos por dónde ingresará o recibiremos la información

// Middlewares
app.use(cors());
app.use(morgan());
app.use(express.json())

// Definimos nuestras routes
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        msg: "¡Hola!, Estás accediendo a la super API del profe Ale :)"
    });
});

// Creamos colección de usuarios
const listUser = [
    {
        id: 1,
        name: 'Melina',
        lastname: 'Ulloa',
        age: 26,
        hincha: 'Boca',
        role: 'ADMIN'
    },
    {
        id: 2,
        name: 'Maia',
        lastname: 'Aedo',
        age: 19,
        hincha: 'River',
        role: 'USER'
    },
    {
        id: 3,
        name: 'Lucas',
        lastname: 'Azocar',
        age: 20,
        hincha: 'Cipolletti',
        role: 'USER'
    }
]

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

    const { name, lastname } = query; // -> + específico

    const result = listUser.find((user) => user.name === name && user.lastname === lastname);

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

// Crear nuevo usuario
app.post('/users/create', (req, res) => {
    // Descontructuración de un objeto
    const { name, lastname, age, hincha, role } = req.body;

    /*
    listUser.push(req.body);
    listUser = [... listUser, req.body]
    listUser.push({... req.body, name: 'Ana'})
    listUser = [... listUser, {... req.body, name: 'Ana'}]
    */

    const id = listUser[listUser.length - 1].id + 1;

    const newUser = { ...req.body, id };

    listUser.push(newUser);

    res.status(201).json({
        ok: true,
        msg: "¡Usuario agregado con éxito!",
        newUser
    });

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

