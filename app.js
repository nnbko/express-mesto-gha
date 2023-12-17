const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { validateLogin, validateCreateUser } = require('./utils/validation');
const ErrorNotFound = require('./constants/ErorrNotFound');
const errorHandler = require('./middlewares/errorHandler');

const { login, createUser } = require('./controllers/users');

const app = express();

app.use(express.json());

const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Тут ничего нет'));
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
