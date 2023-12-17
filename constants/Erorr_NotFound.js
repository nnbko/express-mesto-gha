class Erorr_NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = Erorr_NotFound;