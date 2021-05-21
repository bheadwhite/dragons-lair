const express = require('express');
const session = require('express-session');
const massive = require('massive');
const authCtrl = require('./authController');
require('dotenv').config();

const { CONNECTION_STRING, SESSION_SECRET } = process.env;

const app = express();
const SERVER_PORT = 4000;

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
}).then((dbInstance) => {
  app.set('db', dbInstance);
});

app.use(express.json());

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  }),
);

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.listen(SERVER_PORT, () =>
  console.log(`server is running on ${SERVER_PORT}`),
);
