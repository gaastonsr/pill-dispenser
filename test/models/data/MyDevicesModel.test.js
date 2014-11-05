module.exports = {

    link: {
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
        devices: [
            {
                id        : 1,
                identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                created_at: '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                identifier: '110ec58a-a0f2-4ac4-8393-1a2b3c4d5e6f',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                created_at: '2014-10-08 12:00:00'
            }
        ],
        users_devices: [
            {
                id        : 1,
                user_id   : 1,
                name      : 'Grandpa',
                device_id : 1,
                created_at: '2014-10-08 12:00:00'
            }
        ]
    },

    unlink: {
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
                status    : 1,
                created_at: '2014-10-08 12:00:00'
            }
        ],
        devices: [
            {
                id        : 1,
                identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                created_at: '2014-10-08 12:00:00'
            }
        ],
        users_devices: [
            {
                id        : 1,
                user_id   : 1,
                name      : 'Grandpa',
                device_id : 1,
                created_at: '2014-10-08 12:00:00'
            }
        ]
    },

    updatePassword: {
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
                status    : 1,
                created_at: '2014-10-08 12:00:00'
            }
        ],
        devices: [
            {
                id        : 1,
                identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                created_at: '2014-10-08 12:00:00'
            }
        ],
        users_devices: [
            {
                id        : 1,
                user_id   : 1,
                name      : 'Grandpa',
                device_id : 1,
                created_at: '2014-10-08 12:00:00'
            }
        ]
    },

    updateName: {
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
                status    : 1,
                created_at: '2014-10-08 12:00:00'
            }
        ],
        devices: [
            {
                id        : 1,
                identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                created_at: '2014-10-08 12:00:00'
            }
        ],
        users_devices: [
            {
                id        : 1,
                user_id   : 1,
                name      : 'Grandpa',
                device_id : 1,
                created_at: '2014-10-08 12:00:00'
            }
        ]
    }
};
