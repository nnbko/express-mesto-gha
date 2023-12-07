const express = require('express');
const mongoose = require('mongoose');
const { STATUS_CODE_NOT_FOUND} = require('./constants/constants')

const app = express();

app.use(express.json());

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '65724342eb184f10db4fe052' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(STATUS_CODE_NOT_FOUND).json({ error: 'Ничего не найдено' });
});



app.listen(PORT);
