# My Devices Resource

---

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

HTTP code: 201

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

- 400 `ValidationError`
- 401 `InvalidCredentials`
- 409 `AlreadyLinked`

---

## List My Devices

`GET /my-devices`

**Protected**: true

### Description

Lists all devices a user is linked to.

### Expected

Nothing.

### On Success

HTTP code: 200

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

---

## Unlink to Device

`DELETE /my-devices/:linkageId`

### Description

Unlinks user to device.

### Expected

- `:linkageId` obligatory. Validated with id rule.

### On Success

HTTP code: 200

```
{}
```

### Possible Errors

- 400 `ValidationError`
- 404 `LinkageNotFound`

---

## Update Device Password

`PUT /my-devices/:linkageId/password`

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

- `:linkageId` obligatory. Validated with id rule.
- `currentPassword` obligatory. Validated with password rule.
- `newPassword` obligatory. Validate with password rule.
- `newPasswordConfirmation` obligatory. Validate with password rule.

### On Success

HTTP code: 200

```
{}
```

### Possible Errors

- 400 `ValidationError`
- 404 `LinkageNotFound`
- 401 `IncorrectPassword`

---

## Update Device Name

`PUT /my-devices/:linkageId/name`

**Protected**: true

### Description

Updates a device name.

### Expected

```
{
    "name": "John's Grandpa"
}
```

- `:linkageId` obligatory. Validated with id rule.
- `name` obligatory. Validated with device.name rule.

### On Success

HTTP code: 200

```
{}
```

### Possible Errors

- 400 `ValidationError`
- 404 `LinkageNotFound`

---

## Add Device Setting

`POST /my-devices/:linkageId/settings`

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

- `:linkageId` obligatory. Validated with id rule.

### On Success

HTTP code: 201

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

- 400 `ValidationError`
- 404 `LinkageNotFound`

---

## Get Device Settings

`GET /my-devices/:linkageId/settings`

**Protected**: true

### Description

Returns a list of the device settings.

### Expected

- `:linkageId` obligatory. Validated with id rule. 

### On Success

HTTP code: 200

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

- 400 `ValidationError`
- 404 `LinkageNotFound`

---

## Activate Device Setting

`PUT /my-devices/:linkageId/settings/:settingId/activate`

**Protected**: true

### Description

Activates a device operation.

### Expected

- `:linkageId` obligatory. Validated with id rule.
- `:settingId` obligatory. Validated with id rule.

### On Success

HTTP code: 200

````
{}
````

### Possible Errors

- 400 `ValidationError`
- 404 `LinkageNotFound`
- 409 `SettingAlreadyActive`

---

## Deactivate Device Setting

`PUT /my-devices/:linkageId/settings/:settingId/deactivate`

**Protected**: true

### Description

Deactivates a device operation.

### Expected

- `:linkageId` obligatory. Validated with id rule. Likage id.
- `:settingId` obligatory. Validated with id rule. Setting id.

### On Success

HTTP code: 200

````
{}
````

### Possible Errors

- 400 `ValidationError`
- 404 `LinkageNotFound`
- 409 `SettingAlreadyInactive`

---

## Delete Device Setting

`DELETE /my-devices/:linkageId/settings/:settingId`

**Protected**: true

### Description

Deletes a set of settings of a device.

### Expected

- `:linkageId` obligatory. Validated with id rule.
- `:settingId` obligatory. Validated with id rule.

### On Success

HTTP code: 200

````
{}
````

### Possible Errors

- 400 `ValidationError`
- 404 `LinkageNotFound`
- 404 `SettingNotFound`
- 409 `DeleteActiveSetting`
