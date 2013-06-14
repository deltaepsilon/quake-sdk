var convict = require('convict'),
  conf = convict({
    env: {
      doc: "The applicaton environment.",
      format: ["production", "development", "test"],
      default: "development",
      env: "NODE_ENV"
    },
    quake_port: {
      doc: "Quake port",
      format: "port",
      default: 9001,
      env: "QUAKE_PORT"
    },
    quake_host: {
      doc: "Quake host",
      format: "*",
      default: '127.0.0.1',
      env: "QUAKE_HOST"
    },
    quiver_port: {
        doc: "Quiver port",
        format: "port",
        default: 9000,
        env: "QUIVER_PORT"
    },
    quiver_host: {
        doc: "Quake host",
        format: "*",
        default: '127.0.0.1',
        env: "QUIVER_HOST"
    },
    client_id: {
      doc: "Quake client ID",
      format: "*",
      default: "You should really change this",
      env: "QUAKE_CLIENT_ID"
    },
    client_secret: {
      doc: "Quake client secret",
      format: "*",
      default: "You should really change this",
      env: "QUAKE_CLIENT_SECRET"
    }
  });

conf.validate();

module.exports = conf;

