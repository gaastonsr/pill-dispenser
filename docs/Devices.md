# Devices Resource

Register and delete devices.



## Register Device

`POST /devices`

**Protected**: true

### Description

Registers a device.

### Expected

```
{
    "identifier": "110ec58a-a0f2-4ac4-8393-c866d813b8d1",
    "password"  : "password"
}
```

- `identifier` obligatory. Validated with device.identifier rule.
- `password` obligatory. Validated with password rule.

### On Success

```
{
    "data": {
        "kind"      : "DeviceProfile",
        "id"        : 1,
        "identifier": "110ec58a-a0f2-4ac4-8393-c866d813b8d1",
        "updatedAt" : null,
        "createdAt" : "2014-09-29T19:10:15Z"
    }
}
```

### Possible Errors

- `ValidationError`
- `PermissionsError`
- `DuplicateIdentifier`



## Delete a Device

`DELETE /devices/:id `

**Protected**: true

### Description

Delete a device.

### Expected

- `:id` obligatory. Validated with id rule. Device id.

### On Success

```
{}
```

### Possible Errors

- `ValidationError`
- `PermissionsError`
- `DeviceNotFound`
