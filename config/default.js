'use strict';

var path = require('path');

module.exports = {
    nodeEnv         : process.env.NODE_ENV || 'development',
    port            : 8080,
    url             : '',
    websiteURL      : 'http://localhost:8000',
    secret          : '2oj3bn4o3245ion23oni',
    sessionsLifetime: 5184000,
    mail: {
        from        : '',
        templatesDir: path.join(__dirname, '../templates'),
        transport   : {}
    },
    database: {
        host    : '127.0.0.1',
        user    : 'postgres',
        password: '',
        database: 'pill-dispenser'
    }
};
