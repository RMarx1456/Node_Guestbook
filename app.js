// Get the express package 
const express = require('express');

const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'reservations'
});

async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database');
        return conn;
    } catch (err) {
        console.log('Error connecting to the database: ' + err)
    }
}

// Instantiate an express (web) app
const app = express();

// Define a port number for the app to listen on
const PORT = 3000;

// Tell the app to encode data into JSON format
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

// Set your view (templating) engine to "EJS"
// (We use a templating engine to create dynamic web pages)
app.set('view engine', 'ejs');

// Define a "default" route, 
// e.g. jshmo.greenriverdev.com/reservation-app/
app.get('/', (req, res) => {

    console.log("Hello, world - server!");

    // Return home page
    res.render('home', { errors: []});
});

// Define a "confirm" route, using the GET method
app.get('/confirm', (req, res) => {

    // Send a response to the client
    res.send('You need to post!');
});

// Define a "confirm" route, using the POST method
app.post('/confirm', async (req, res) => {

    //console.log(req.body);

    // Get the data from the form that was submitted
    // from the body of the request object
    //let details = req.body;

    const data = {
        firstName: req.body.fname,
        lastName: req.body.lname
    }

    const conn = await connect();

    conn.query(`
        INSERT INTO users (firstName, lastName)
        VALUES ('${data.firstName}', '${data.lastName}');
    `);

    // Display the confirm page, pass the data
    res.render('confirm', { details: data });
});

app.post('/confirm', async (req, res) => {



    const data = req.body;

    let isValid = true;
    let errors =[];

    if(data.firstName.trim() == "") {
        isValid = false;
        errors.push("First name is required.")
    }
    if(data.lastName.trim() == "") {
        isValid = false;
        errors.push("Last name is required.")
    }
    if(data.email.trim() == "") {
        isValid = false;
        errors.push("Email name is required.")
    }

    if(isValid) {
        res.render('home');
        return;
    }

    const conn = await connect();

    conn.query(`
        INSER INTO reservation_slot (firstName, lastName, email)
        VALUES (${data.firstName}), (${data.lastName}), (${data.email}) `);
});

app.get('/confirmations', async (req, res) => {
    //Admin page.
    const conn = await connect();

    const rows = await conn.query('SELECT * FROM reservation_slot;');

    console.log(rows);

    res.render('confirmations', { data: rows });
});

// Tell the app to listen for requests on the designated port
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
});
