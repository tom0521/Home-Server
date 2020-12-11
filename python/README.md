# Home Server API

## Usage

All responses will have the form

```json
{
    "data": "Mixed type holding the content of the response",
    "message": "Description of what happened"
}
```

### Get all Transactions

**Definition**

`GET /transaction`

**Response**

- `200 OK` on success

```json
[
    {
        "id": "12345",
        "amount": "12.34"
    }
]
```

### Creating a new Transaction

**Definition**

`POST /transaction`

**Arguments**

**Response**

- `201 Created` on success

```json
[
    {
        "id": "12345",
        "amount": "12.34"
    }
]
```