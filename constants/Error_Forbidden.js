class Error_Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = Error_Forbidden;