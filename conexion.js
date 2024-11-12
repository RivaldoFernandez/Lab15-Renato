// const mysql = require('mysql');
// const express = require('express');
// const app = express();
// const port = 3000;

// // Configuración de Pug como motor de plantillas
// app.set('view engine', 'pug');
// app.set('views', './views');

// // Middleware para procesar datos de formularios enviados por POST
// app.use(express.urlencoded({ extended: true }));

// // Configuración de Express para servir archivos estáticos desde la carpeta 'public'
// app.use(express.static('public'));

// // Configuración de la conexión a la base de datos MySQL
// const connection = mysql.createConnection({
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: '',
//     database: 'futbol'
// });

// // Conexión a la base de datos
// connection.connect((error) => {
//     if (error) {
//         console.error('Error al conectarse a MySQL: ', error);
//         return;
//     }
//     console.log('¡Conectado a la base de datos MySQL!');
// });

// // Ruta para la página de inicio
// app.get('/', (req, res) => {
//     // Renderizar la consulta a la base de datos en la vista index.pug
//     connection.query('SELECT * FROM Futbolistas', (error, results) => {
//         if (error) {
//             console.error('Error al ejecutar la consulta: ', error);
//             return;
//         }
//         // Renderizar la vista index.pug con los resultados de la consulta
//         res.render('index', { datos: results });
//     });
// });

// // Para manejar la solicitud POST de un formulario
// app.post('/', (req, res) => {
//     const nuevoDato = req.body.nuevoDato; // Obtener el nuevo dato del formulario

//     // Consulta MySQL para insertar el nuevo dato
//     const consulta = 'INSERT INTO Futbolistas (Nombre) VALUES (?)';

//     // Ejecutar la consulta de inserción
//     connection.query(consulta, [nuevoDato], (error, results) => {
//         if (error) {
//             console.error('Error al ejecutar la consulta: ', error);
//             return;
//         }
//         console.log('Dato insertado correctamente');
//         // Redirigir a la página de inicio después de la inserción
//         res.redirect('/');
//     });
// });

// // Iniciar el servidor en el puerto 3000
// app.listen(port, () => {
//     console.log(`Servidor iniciado en http://localhost:${port}`);
// });

// // Ejecutar una consulta SELECT al iniciar el servidor (opcional)
// connection.query('SELECT * FROM Futbolistas', (error, results) => {
//     if (error) {
//         console.error('Error al ejecutar la consulta: ', error);
//         return;
//     }
//     console.log('Resultados de la consulta: ', results);
// });


const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3000;

// Configuración de Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

// Middleware para procesar datos de formularios enviados por POST
app.use(express.urlencoded({ extended: true }));

// Configuración de Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'futbol'
});

// Conexión a la base de datos
connection.connect((error) => {
    if (error) {
        console.error('Error al conectarse a MySQL: ', error);
        return;
    }
    console.log('¡Conectado a la base de datos MySQL!');
});

// Ruta para la página de inicio
app.get('/', (req, res) => {
    const query = `
        SELECT Futbolistas.id, Futbolistas.nombre, Equipos.nombre AS equipo
        FROM Futbolistas
        LEFT JOIN Equipos ON Futbolistas.equipo_id = Equipos.id
    `;
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta: ', error);
            return;
        }
        res.render('index', { datos: results });
    });
});

// Ruta para mostrar el formulario de actualización
app.get('/update/:id', (req, res) => {
    const futbolistaId = req.params.id;
    const queryFutbolista = 'SELECT * FROM Futbolistas WHERE id = ?';
    const queryEquipos = 'SELECT * FROM Equipos';

    connection.query(queryFutbolista, [futbolistaId], (error, futbolistaResults) => {
        if (error) {
            console.error('Error al ejecutar la consulta: ', error);
            return;
        }
        connection.query(queryEquipos, (error, equiposResults) => {
            if (error) {
                console.error('Error al ejecutar la consulta: ', error);
                return;
            }
            res.render('update', { futbolista: futbolistaResults[0], equipos: equiposResults });
        });
    });
});

// Para manejar la solicitud POST de un formulario
app.post('/', (req, res) => {
    const { nuevoDato, equipoId } = req.body;

    // Validación de datos
    if (!nuevoDato || !equipoId) {
        console.error('Datos inválidos');
        return res.redirect('/');
    }

    const consulta = 'INSERT INTO Futbolistas (nombre, equipo_id) VALUES (?, ?)';
    connection.query(consulta, [nuevoDato, equipoId], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta: ', error);
            return;
        }
        console.log('Dato insertado correctamente');
        res.redirect('/');
    });
});

// Ruta para actualizar un futbolista
app.post('/update', (req, res) => {
    const { id, nombre, equipoId } = req.body;

    // Validación de datos
    if (!id || !nombre || !equipoId) {
        console.error('Datos inválidos');
        return res.redirect('/');
    }

    const consulta = 'UPDATE Futbolistas SET nombre = ?, equipo_id = ? WHERE id = ?';
    connection.query(consulta, [nombre, equipoId, id], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta: ', error);
            return;
        }
        console.log('Dato actualizado correctamente');
        res.redirect('/');
    });
});

// Ruta para eliminar un futbolista
app.post('/delete', (req, res) => {
    const { id } = req.body;

    // Validación de datos
    if (!id) {
        console.error('Datos inválidos');
        return res.redirect('/');
    }

    const consulta = 'DELETE FROM Futbolistas WHERE id = ?';
    connection.query(consulta, [id], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta: ', error);
            return;
        }
        console.log('Dato eliminado correctamente');
        res.redirect('/');
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});