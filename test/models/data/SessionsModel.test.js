module.exports = {

    createFromClientCredentials: {
        users: [
            {
                id        : 1,
                name      : 'John Doe',
                email     : 'john@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : 1,
                created_at: '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                name      : 'Jane Doe',
                email     : 'jane@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : 0,
                created_at: '2014-10-08 12:00:00'
            }
        ]
    },

    getByAuthToken: {
        users: [
            {
                id        : 1,
                name      : 'John Doe',
                email     : 'john@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : 1,
                created_at: '2014-10-08 12:00:00'
            }
        ],

        sessions: [
            {
                id        : 1,
                user_id   : 1,
                created_at: '2014-10-08 12:30:00'
            }
        ]
    }

};
