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
        "updatedAt": "2014-09-29T19:10:15Z",
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



## List My Devices

`GET /my-devices`

**Protected**: true

### Description

Lists all devices a user is linked to.

### Expected

Nothing.

### On Success

````
{
    "data": {
        "kind"    : "LinkagesList",
        "linkages": [
            {
                "id"       : 1,
                "name"     : "Grandpas",
                "updatedAt": "2014-09-29T19:10:15Z",
                "createdAt": "2014-09-29T19:10:15Z"
            },
            {
                ...
            }
        ]
    }
}
````

### Possible Errors

None.



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



### Possible Errors

- `LinkageNotFound`



## Add Device Setting

`POST /my-devices/:id/settings`

**Protected**: true

### Description

Add a a setting to the device.

### Expected

````
{
    "medicineName": "Naproxeno",
    "schedule": [
        "08:00",
        "16:00",
        "24:00"
    ]
}
```

- `:id` obligatory. Validated with id rule. Linkage id.

### On Success

````
{
    "data": {
        "kind": "DeviceSetting",
        "id"  : 1,
        "medicineName": "Naproxeno",
        "schedule": [
            "08:00",
            "16:00",
            "24:00"
        ]
    }
}
````

### Possible Errors

- `ValidationError`
- `LinkageNotFound`



## Get Device Settings

`GET /my-devices/:id/settings`

**Protected**: true

### Description

Returns a list of the device settings.

### Expected

Nothing.

### On Success

````
{
    "data": {
        "kind": "DeviceSettingsList",
        "settings:" [
            {
			      "id": 1,
			      "medicineName": "Naproxeno",
			      "schedule": [
			          "08:00",
			          "16:00",
			          "24:00"
			      ]
            },
            {
                ...
            },
            {
                ...
            }
        ]
    }
}
````

### Possible Errors

- `ValidationError`
- `LinkageNotFound`



## Activate Device Setting

`PUT /my-devices/:linkage-id/settings/:setting-id/activate`

**Protected**: true

### Description

Activates a device operation.

### Expected

- `:linkage-id` obligatory. Validated with id rule. Likage id.
- `:setting-id` obligatory. Validated with id rule. Setting id.

### On Success

````
{}
````

### Possible Errors

- `ValidationError`
- `LinkageNotFound`
- `SettingAlreadyActive`



## Deactivate Device Setting

`PUT /my-devices/:linkage-id/settings/:setting-id/deactivate`

**Protected**: true

### Description

Deactivates a device operation.

### Expected

- `:linkage-id` obligatory. Validated with id rule. Likage id.
- `:setting-id` obligatory. Validated with id rule. Setting id.

### On Success

````
{}
````

### Possible Errors

- `ValidationError`
- `LinkageNotFound`
- `SettingAlreadyInactive`



## Delete Device Setting

`DELETE /my-devices/:linkage-id/settings/:setting-id`

**Protected**: true

### Description

Deletes a set of settings of a device.

### Expected

- `:linkage-id` obligatory. Validated with id rule. Likage id.
- `:setting-id` obligatory. Validated with id rule. Setting id.

### On Success

````
{}
````

### Possible Errors

- `ValidationError`
- `LinkageNotFound`
- `SettingNotFound`
- `DeleteActiveSetting`
