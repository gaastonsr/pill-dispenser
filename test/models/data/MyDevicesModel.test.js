module.exports = {

    link: {
        users: [
            {
                id        : 1,
                name      : 'John Doe',
                email     : 'john@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
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
                updated_at: '2014-10-08 12:00:00',
                created_at: '2014-10-08 12:00:00'
            }
        ]
    },

    listLinkages: {
        users: [
            {
                id        : 1,
                name      : 'John Doe',
                email     : 'john@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
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
                updated_at: '2014-10-08 12:00:00',
                created_at: '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                user_id   : 1,
                name      : 'Uncle',
                device_id : 2,
                updated_at: '2014-10-08 12:00:00',
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
                status    : '1',
                created_at: '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                name      : 'Jane Doe',
                email     : 'jane@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
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
                status    : '1',
                created_at: '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                name      : 'Jane Doe',
                email     : 'jane@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
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
                status    : '1',
                created_at: '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                name      : 'Jane Doe',
                email     : 'jane@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
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

    addSetting: {
        users: [
            {
                id        : 1,
                name      : 'John Doe',
                email     : 'john@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
                created_at: '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                name      : 'Jane Doe',
                email     : 'jane@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
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

    listSettings: {
        users: [
            {
                id        : 1,
                name      : 'John Doe',
                email     : 'john@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
                created_at: '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                name      : 'Jane Doe',
                email     : 'jane@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
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
        ],
        devices_settings: [
            {
                id           : 1,
                device_id    : 1,
                medicine_name: 'Naproxeno',
                schedule     : '["08:00:00","16:00:00","24:00:00"]',
                status       : '0',
                updated_at   : '2014-10-08 12:00:00',
                created_at   : '2014-10-08 12:00:00'
            },
            {
                id           : 2,
                device_id    : 1,
                medicine_name: 'Pepto',
                schedule     : '["08:00:00","16:00:00","24:00:00"]',
                status       : '0',
                updated_at   : '2014-10-08 12:00:00',
                created_at   : '2014-10-08 12:00:00'
            }
        ]
    },

    activateSetting: {
        users: [
            {
                id        : 1,
                name      : 'John Doe',
                email     : 'john@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
                created_at: '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                name      : 'Jane Doe',
                email     : 'jane@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
                created_at: '2014-10-08 12:00:00'
            }
        ],
        devices: [
            {
                id            : 1,
                identifier    : '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                password      : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                created_at    : '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                identifier: '110ec58a-a0f2-4ac4-8393-c866d81aaaaa',
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
        ],
        devices_settings: [
            {
                id           : 1,
                device_id    : 1,
                medicine_name: 'Naproxeno',
                schedule     : '["08:00:00","16:00:00","24:00:00"]',
                status       : '1',
                updated_at   : '2014-10-08 12:00:00',
                created_at   : '2014-10-08 12:00:00'
            },
            {
                id           : 2,
                device_id    : 1,
                medicine_name: 'Pepto',
                schedule     : '["08:00:00","16:00:00","24:00:00"]',
                status       : '0',
                updated_at   : '2014-10-08 12:00:00',
                created_at   : '2014-10-08 12:00:00'
            },
            {
                id           : 3,
                device_id    : 2,
                medicine_name: 'Dulcolax',
                schedule     : '["08:00:00","16:00:00","24:00:00"]',
                status       : '0',
                updated_at   : '2014-10-08 12:00:00',
                created_at   : '2014-10-08 12:00:00'
            }
        ]
    },

    deactivateSetting: {
        users: [
            {
                id        : 1,
                name      : 'John Doe',
                email     : 'john@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
                created_at: '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                name      : 'Jane Doe',
                email     : 'jane@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
                created_at: '2014-10-08 12:00:00'
            }
        ],
        devices: [
            {
                id            : 1,
                identifier    : '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                password      : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                created_at    : '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                identifier: '110ec58a-a0f2-4ac4-8393-c866d81aaaaa',
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
        ],
        devices_settings: [
            {
                id           : 1,
                device_id    : 1,
                medicine_name: 'Naproxeno',
                schedule     : '["08:00:00","16:00:00","24:00:00"]',
                status       : '1',
                updated_at   : '2014-10-08 12:00:00',
                created_at   : '2014-10-08 12:00:00'
            },
            {
                id           : 2,
                device_id    : 1,
                medicine_name: 'Pepto',
                schedule     : '["08:00:00","16:00:00","24:00:00"]',
                status       : '0',
                updated_at   : '2014-10-08 12:00:00',
                created_at   : '2014-10-08 12:00:00'
            },
            {
                id           : 3,
                device_id    : 2,
                medicine_name: 'Dulcolax',
                schedule     : '["08:00:00","16:00:00","24:00:00"]',
                status       : '0',
                updated_at   : '2014-10-08 12:00:00',
                created_at   : '2014-10-08 12:00:00'
            }
        ]
    },

    deleteSetting: {
        users: [
            {
                id        : 1,
                name      : 'John Doe',
                email     : 'john@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
                created_at: '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                name      : 'Jane Doe',
                email     : 'jane@doe.com',
                password  : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                status    : '1',
                created_at: '2014-10-08 12:00:00'
            }
        ],
        devices: [
            {
                id            : 1,
                identifier    : '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                password      : '$2a$10$4vo/nS7mSjebt5985lT72e5k2e14TvMtrbQadR08SU1nYBILI2aGu', // password is "password"
                created_at    : '2014-10-08 12:00:00'
            },
            {
                id        : 2,
                identifier: '110ec58a-a0f2-4ac4-8393-c866d81aaaaa',
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
        ],
        devices_settings: [
            {
                id           : 1,
                device_id    : 1,
                medicine_name: 'Naproxeno',
                schedule     : '["08:00:00","16:00:00","24:00:00"]',
                status       : '1',
                updated_at   : '2014-10-08 12:00:00',
                created_at   : '2014-10-08 12:00:00'
            },
            {
                id           : 2,
                device_id    : 1,
                medicine_name: 'Pepto',
                schedule     : '["08:00:00","16:00:00","24:00:00"]',
                status       : '0',
                updated_at   : '2014-10-08 12:00:00',
                created_at   : '2014-10-08 12:00:00'
            },
            {
                id           : 3,
                device_id    : 2,
                medicine_name: 'Dulcolax',
                schedule     : '["08:00:00","16:00:00","24:00:00"]',
                status       : '0',
                updated_at   : '2014-10-08 12:00:00',
                created_at   : '2014-10-08 12:00:00'
            }
        ]
    }
};
