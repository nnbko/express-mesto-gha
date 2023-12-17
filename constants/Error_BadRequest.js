class Error_BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = Error_BadRequest;