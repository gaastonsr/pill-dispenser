var nodeEnv = !process.env.NODE_ENV ? 'development' : process.env.NODE_ENV;

var config = {
    nodeEnv         : nodeEnv,
    url             : process.env.APP_URL,
    websiteURL      : process.env.WEBSITE_URL,
    secret          : process.env.APP_SECRET,
    port            : process.env.APP_PORT,
    sessionsLifetime: 5184000,
    tokensLifetime  : 3600,
    mandrillAPIKey  : process.env.MANDRILL_API_KEY,
    database: {
        host    : process.env.DB_HOST,
        user    : process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
};

if (config.nodeEnv === 'test') {
    config.database.host     = process.env.TEST_DB_HOST;
    config.database.user     = process.env.TEST_DB_USER;
    config.database.password = process.env.TEST_DB_PASSWORD;
    config.database.database = process.env.TEST_DB_NAME;
}

module.exports = config;
