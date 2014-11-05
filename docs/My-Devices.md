# My Devices Resource

Link, unlink to devices, update your devices name and password.



## Link to Device

`POST /my-devices`

**Protected**: true

### Description

Links user to device.

### Expected

```
{
    "name"      : "Grandpa's",
    "identifier": "110ec58a-a0f2-4ac4-8393-c866d813b8d1",
    "password"  : "password"
}
```

- `name` obligatory. Validated with device.name rule.
- `identifier` obligatory. Validated with device.identifier rule.
- `password` obligatory. Validated with password rule.

### On Success

```
{
    "data": {
        "kind"     : "DeviceLinkage",
        "id"       : 1,
        "name"     : "Grandpa's",
        "updatedAt": null,
        "createdAt": "2014-09-29T19:10:15Z"
    }
}
```

- `id` linkage id.

### Possible Errors

- `ValidationError`
- `InvalidCredentials`
- `AlreadyLinked`
- `IncorrectPassword`



## Unlink to Device

`DELETE /my-devices/:id`

### Description

Unlinks user to device.

### Expected

- `:id` obligatory. Validated with id rule. Linkage id.

### On Success

```
{}
```

### Possible Errors

- `ValidationError`
- `LinkageNotFound`



## Update Device Password

`PUT /my-devices/:id/password`

**Protected**: true

### Description

Updates a device password.

### Expected

```
{
    "currentPassword"        : "password",
    "newPassword"            : "qwerty",
    "newPasswordConfirmation": "qwerty"
}
```

- `:id` obligatory. Validated with id rule. Linkage id.
- `currentPassword` obligatory. Validated with password rule.
- `newPassword` obligatory. Validate with password rule.
- `newPasswordConfirmation` obligatory. Validate with password rule.

### On Success

```
{}
```

### Possible Errors

- `ValidationError`
- `LinkageNotFound`
- `IncorrectPassword`



## Update Device Name

`PUT /my-devices/:id/name`

**Protected**: true

### Description

Updates a device name.

### Expected

```
{
    "name": "John's Grandpa"
}
```

- `:id` obligatory. Validated with id rule. Linkage id.
- `name` obligatory. Validated with device.name rule.

### On Success

```
{}
```

### Possible Errors

- `ValidationError`
- `LinkageNotFound`



## Add Device Settings

### Description
### Expected
### On Success
### Possible Errors



## Delete Device Settings

### Description
### Expected
### On Success
### Possible Errors



## Update Active Settings

### Description
### Expected
### On Success
### Possible Errors



## Deactivate Device

### Description
### Expected
### On Success
### Possible Errors



## Activate Device

### Description
### Expected
### On Success
### Possible Errors
