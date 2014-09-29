ALTER TABLE "sessions" DROP CONSTRAINT "sessionsUserIdFK";
ALTER TABLE "usersDevices" DROP CONSTRAINT "usersDevicesUserIdFK";
ALTER TABLE "usersDevices" DROP CONSTRAINT "usersDevicesDeviceIdFK";
ALTER TABLE "devicesSettings" DROP CONSTRAINT "devicesSettingsDeviceIdFK";

DROP TABLE "users";
DROP TABLE "sessions";
DROP TABLE "devices";
DROP TABLE "usersDevices";
DROP TABLE "devicesSettings";

CREATE TABLE "users" (
"id" serial4,
"name" varchar(20) NOT NULL,
"email" varchar(254) NOT NULL,
"newEmail" varchar(254),
"password" char(128) NOT NULL,
"updatedAt" timestamp,
"createdAt" timestamp NOT NULL,
PRIMARY KEY ("id")
);

CREATE TABLE "sessions" (
"id" serial4,
"userId" serial4 NOT NULL,
"UUID" char(36) NOT NULL,
"type" char(1) NOT NULL,
"createdAt" timestamp(255) NOT NULL,
PRIMARY KEY ("id")
);

CREATE TABLE "devices" (
"id" serial4,
"identifier" char(32) NOT NULL,
"password" char(128) NOT NULL,
"updatedAt" timestamp,
"createdAt" timestamp NOT NULL,
PRIMARY KEY ("id")
);

CREATE TABLE "usersDevices" (
"id" serial4,
"userId" serial4 NOT NULL,
"deviceId" serial4 NOT NULL,
"createdAt" timestamp NOT NULL,
PRIMARY KEY ("id")
);

CREATE TABLE "devicesSettings" (
"id" serial4,
"deviceId" serial4 NOT NULL,
PRIMARY KEY ("id")
);


ALTER TABLE "sessions" ADD CONSTRAINT "sessionsUserIdFK" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "usersDevices" ADD CONSTRAINT "usersDevicesUserIdFK" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "usersDevices" ADD CONSTRAINT "usersDevicesDeviceIdFK" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "devicesSettings" ADD CONSTRAINT "devicesSettingsDeviceIdFK" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON UPDATE CASCADE ON DELETE CASCADE;

