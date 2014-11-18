# Users Resource

---

## Create a User

`POST /users`

**Protected**: false

### Description

Signs up users.

### Expected

```
{
    "name"             : "John Doe",
    "email"            : "john@doe.com",
    "emailConfirmation": "john@doe.com",
    "password"         : "password"
}
```

- `name` obligatory. Validated with user.name rule.
- `email` obligatory. Validated with email rule.
- `emailConfirmation` obligatory. Validated with email rule.
- `password` obligatory. Validated with password rule.

### On Success

HTTP code: 201

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

- 400 `ValidationError`
- 409 `DuplicateEmail`

---

## Activate a User

`PUT /users/activate/:token`

**Protected**: false

### Description

Whenever a user is created it is created in an inactive state until his email is verified. To verify his email, an email is sent to the user email with an activation link that points to an url in the web app. The web app uses this endpoint to activate users account.

### Expected

- `:token` obligatory. Validated wit token rule. Token sent by email to activate the account.

### On Success

HTTP code: 200

```
{}
```

### Possible Errors

- 400 `ValidationError`
- 400 `InvalidToken`
- 400 `UserAlreadyActive`
