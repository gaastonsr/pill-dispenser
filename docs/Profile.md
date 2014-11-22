# Profile Resource

---

## Get Profile

`GET /profile`

**Protected**: true

### Description

Returns the user profile.

### Expected

Nothing.

### On Success

HTTP code: 200

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

---

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

- `name` obligatory. Validated with user.name rule.

### On Success

HTTP code: 200

```
{}
```

### Possible Errors

- 400 `ValidationError`

---

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
    "newPasswordConfirmation": "qwerty"
}
```

- `currentPassword` obligatory. Validated with password rule.
- `newPassword` obligatory. Validated with password rule.
- `newPasswordConfirmation` obligatory. Validated with password rule.

### On Success

HTTP code: 200

```
{}
```

### Possible Errors

- 400 `ValidationError`
- 401 `IncorrectPassword`

---

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
    "newEmailConfirmation": "me@jdoe.com"
}
```

- `password` obligatory. Validated with password rule.
- `newEmail` obligatory. Validated with email rule.
- `newEmailConfirmation` obligatory. Validated with email rule.

### On Success

HTTP code: 201

```
{}
```

### Possible Errors

- 400 `ValidationError`
- 401 `IncorrectPassword`
- 409 `DuplicateEmail`
- 409 `DuplicateRequest`

---

## Update Email

`PUT /profile/email/:token`

**Protected**: true

### Description

Updates a user email.

### Expected

- `:token` obligatory, validated with the token rule. Token sent by email.

### On Success

HTTP code: 200

```
{}
```

### Possible Errors

- 400 `ValidationError`
- 400 `InvalidToken`
- 410 `ExpiredEmailUpdateRequest`
