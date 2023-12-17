class Error_Server extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = Error_Server;