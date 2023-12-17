const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const { errors } = require('celebrate');
const Error_NotFound = require('./constants/Erorr_NotFound');
const errorHandler = require('./middlewares/errorHandler');

const { login, createUser } = require('./controllers/users');

const app = express();

app.use(express.json());

const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cookieParser());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new Error_NotFound('Тут ничего нет'));
});

app.use(errors());
app.use(errorHandler);


app.listen(PORT);
