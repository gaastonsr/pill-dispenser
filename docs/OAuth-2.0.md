# OAuth 2.0

Deliver and expire access tokens. A token is a key utilized to verify your identity with the servers.


## Get a token

`POST /oauth2/authorization?grant_type=:grant-type`

**Protected**: false

### Description

Authorize users to access to their information. Returns a bearer token.

Once you have a token just add an `Authorization` header to every subsequent http request with `Bearer`, a space and the token, like so:

```
Authorization: Bearer 845nv0834n578v0n57803347089v0897678930n9856
```

### Expected

`:grant-type` obligatory. The type of identification being performed. Only `client_credentials` is supported.

When `:grant-type` is `client_credentials`, the server expects:

```
{
    "email"   : "john@doe.com",
    "password": "password"
}
```

- `email` obligatory. Validated with email rule.
- `password` obligatory. Validated with password rule.

### On Success

Independently of the grant type used it returns:

```
{
    "access_token": "90u325v45nt895ngn3904ntg95nnugn34wn3gn9ugnut4",
    "token_type"  : "bearer",
    "expires_in"  : 5184000
}
```

- `access_token` token issued by the server to verify your identity on subsequent requests.
- `token_type` token type issued by the server. It will always be bearer.
- `expires_in` token lifetime in seconds.

### Posssible Errors

- `GrantTypeNotAllowed`
- `ValidationError`
- `InvalidCredentials`
- `InactiveUser`
