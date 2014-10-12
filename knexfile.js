var config = require('./config');

exports.anyEnv = exports.test = exports.development = exports.staging = exports.production = {
    client    : 'pg',
    connection: config.database,
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'migrations',
        directory: __dirname + '/migrations'
    }
};
