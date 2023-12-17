class Error_Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = Error_Unauthorized;