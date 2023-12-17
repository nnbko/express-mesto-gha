module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode
    .status(statusCode)
    .send({
      message:
        statusCode === 500
          ? "На сервере ошибка"
          : err.message,
    });
};