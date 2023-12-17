module.exports = (err, res, next) => {
  const statusCode = err.statusCode
  res
    .status(statusCode)
    .send({
      message:
        statusCode === 500
          ? "На сервере ошибка"
          : err.message,
    });
  next();
};