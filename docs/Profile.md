# Profile Resource

Retrieves and update users profiles.


## Get Profile

`GET /profile`

**Protected**: true

### Description

Returns the user profile.

### Expected

Nothing.

### On Success

```
{
    "data": {
        "kind"     : "UserProfile",
        "id"       : 1,
        "name"     : "John Doe",
        "email"    : "john@doe.com",
        "updatedAt": null,
        "createdAt": "2014-09-29T19:10:15Z"
    }
}
```

### Possible Errors

None.


## Update Profile

`PUT /profile`

**Protected**: true

### Description

Updates user profile.

### Expected

```
{
    "name": "JDoe"
}
```

- `name` obligatory. Validated with name rule.

### On Success

```
{}
```

### Possible Errors

- `ValidationError`


## Update Password

`PUT /profile/password`

**Protected**: true

### Description

Updates user password.

### Expected

```
{
    "currentPassword": "password",
    "newPassword"    : "qwerty",
    "newPasswordVerification": "qwerty"
}
```

- `currentPassword` obligatory. Validated with password rule.
- `newPassword` obligatory. Validated with password rule.
- `newPasswordVerification` obligatory. Validated with password rule.

### On Success

```
{}
```

### Possible Errors

- `ValidationError`
- `IncorrectPassword`


## Request Email Update

`POST /profile/email-update-request`

**Protected**: true

### Description

Puts a request to update the user email. When a user wants to update his email it is not inmediate. First, a request is placed and an email is sent to the new address. In the email, there is a link to update the email.

### Expected

```
{
    "password": "password",
    "newEmail": "me@jdoe.com",
    "newEmailVerification": "me@jdoe.com"
}
```

- `password` obligatory. Validated with password rule.
- `newEmail` obligatory. Validated with email rule.
- `newEmailVerification` obligatory. Validated with email rule.

### On Success

```
{}
```

### Possible Errors

- `ValidationError`
- `IncorrectPassword`


## Update Email

`PUT /profile/email/:token`

**Protected**: true

### Description

Updates a user email.

### Expected

- `:token` obligatory, validated with the token rule. Token sent by email.

### On Success

```
{}
```

### Possible Errors

- `ValidationError`
- `InvalidToken`
- `NoEmailUpdateRequest`