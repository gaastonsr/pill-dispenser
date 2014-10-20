'use strict';

module.exports = {
    up: function(knex, Promise) {
        return knex.raw('\
            CREATE SEQUENCE users_id_seq MINVALUE 1000;\
            CREATE SEQUENCE sessions_id_seq MINVALUE 1000;\
            CREATE SEQUENCE devices_id_seq MINVALUE 1000;\
            CREATE SEQUENCE users_devices_id_seq MINVALUE 1000;\
            CREATE SEQUENCE devices_settings_id_seq MINVALUE 1000;\
        ')
        .then(function() {
            return knex.schema
            .createTable('users', function(table) {
                table.integer('id').primary().defaultTo(knex.raw("nextval('users_id_seq')"));
                table.string('name', 20).notNullable();
                table.string('email', 254).notNullable().unique();
                table.string('password', 128).notNullable();
                table.string('new_email', 254);
                table.string('status', 1).notNullable();
                table.timestamp('updated_at', true);
                table.timestamp('created_at', true).notNullable();
            })
            .createTable('sessions', function(table) {
                table.integer('id').primary().defaultTo(knex.raw("nextval('sessions_id_seq')"));
                table.integer('user_id').notNullable().references('users.id').onUpdate('CASCADE').onDelete('CASCADE');
                table.timestamp('created_at', true).notNullable();
            })
            .createTable('devices', function(table) {
                table.integer('id').primary().defaultTo(knex.raw("nextval('devices_id_seq')"));
                table.string('identifier').notNullable();
                table.string('password', 128).notNullable();
                table.timestamp('updated_at', true);
                table.timestamp('created_at', true).notNullable();
            })
            .createTable('users_devices', function(table) {
                table.integer('id').primary().defaultTo(knex.raw("nextval('users_devices_id_seq')"));
                table.integer('user_id').notNullable().references('users.id').onUpdate('CASCADE').onDelete('CASCADE');
                table.string('name', 20).notNullable();
                table.integer('device_id').notNullable().references('devices.id').onUpdate('CASCADE').onDelete('CASCADE');
                table.timestamp('created_at', true).notNullable();
            })
            .createTable('devices_settings', function(table) {
                table.integer('id').primary().defaultTo(knex.raw("nextval('devices_settings_id_seq')"));
                table.integer('device_id').notNullable().references('devices.id').onUpdate('CASCADE').onDelete('CASCADE');
            });
        })
        .then(function() {
            return knex.raw('\
                ALTER SEQUENCE users_id_seq OWNED BY users.id;\
                ALTER SEQUENCE sessions_id_seq OWNED BY sessions.id;\
                ALTER SEQUENCE devices_id_seq OWNED BY devices.id;\
                ALTER SEQUENCE users_devices_id_seq OWNED BY users_devices.id;\
                ALTER SEQUENCE devices_settings_id_seq OWNED BY devices_settings.id;\
            ');
        });
    },

    down: function(knex, Promise) {
        return knex.schema
        .dropTable('devices_settings')
        .dropTable('users_devices')
        .dropTable('devices')
        .dropTable('sessions')
        .dropTable('users');
    }
};
