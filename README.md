# Pill Dispenser API

[![Build Status](https://travis-ci.org/gaastonsr/pill-dispenser.svg?branch=master)](https://travis-ci.org/gaastonsr/pill-dispenser)
[![Coverage Status](https://img.shields.io/coveralls/gaastonsr/pill-dispenser.svg)](https://coveralls.io/r/gaastonsr/pill-dispenser)
[![Dependency Status](https://gemnasium.com/gaastonsr/pill-dispenser.svg)](https://gemnasium.com/gaastonsr/pill-dispenser)

Web service for an automatic pill dispenser aimed to help Alzheimer patients.

## Responses

There are 3 possible responses expected from an endpoint. Success, error and empty response. In general you will look at the http code and from there you know which response it is.

Success responses are retuned with a 2xx http code. They have a `data` field and `kind` field inside it.

```
{
    "data": {
        "kind": "UserProfile"
        /* resource specific data */
    }
}
```

- `kind` is the name of the resource returned. And it will contain the resource specific data next to it.

Errors are returned with a no 2xx http code. They have a `error` field and `code`, `name` and `message` inside it.

```
{
    "error": {
        "code"   : 400,
        "name"   : "ValidationError",
        "message": "Validation error"
    }
}
```

- `code` contains the http code.
- `name` the error name. It is always in upper camel case.
- `message` a human readable error message.

Responses may contains `data` or `error` but **never both**.

Sometimes an endpoint will want to respond with an empty body.

```
{}
```

In those you will only be interested in the http code.

## Validation

All input fields are validated with one of the following rules:

- **email**.
- **password**.
- **userName**.
- **deviceName**.
- **deviceIdentifier**.

Each input will define which rule it is. When a field is optional it can undefined or set to null.

### ValidationError

Most error responses contain only `code`, `name` and `message` fields. Validation errors contain an `errors` field with an array containing all validation errors.

Each element in the array is an object with the structure:

```
{
    "location": "email",
    "message" : "Is empty"
}
```

- `location` name of the field where the error happened
- `message` human readable error

## Resources

Visit the documentation of all our resources.

- [OAuth 2.0](docs/OAuth-2.0.md)
- [Users](docs/Users.md)
- [Profile](docs/Profile.md)
- [Devices](docs/Devices.md)
- [My Devices](docs/My-Devices.md)

All routes marked as protected means that you need a bearer token to access to it and all date fields returned by the server are in UTC.
