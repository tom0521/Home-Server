# Home Server API

## Usage

All responses will have the form

```json
{
    "data": "Mixed type holding the content of the response",
    "message": "Description of what happened"
}
```

## Accounts

### Getting Accounts

**Definition**

`GET /account/?<account_id>`

**Responses**

- `200 OK` on success
- `404 Not Found` if the Account was not found

```json
[
    {
        "id": 1234,
        "account": "Account Name",
        "balance": 00.00.
        "type": "DEBIT"
    },
    ...
]
```

### Creating Accounts

**Definition**

`POST /account`

**Arguments**

- `"account":string` a friendly name for the account
- `"balance":float` initial balance of the account (`default: 0`)
- `"type":string` the type of account this is (`DEBIT | CREDIT`)

**Responses**

- `201 Created` on success
- `202 Accepted` if the Account already exists

```json
{
    "id": 1234,
    "account": "Account Name",
    "balance": 00.00.
    "type": "DEBIT"        
}
```

## Addresses

### Getting Addresses

**Definition**

`GET /address/?<address_id>`

**Responses**

- `200 OK` on success
- `404 Not Found` if the Address was not found

```json
[
    {
        "id": 1234,
        "place_id": 1234,
        "address": "1600 Pennyslvania Avenue",
        "address2": "",
        "city_id": 1234,
        "postal_code": 20500,
        "phone": "2024561111",
        "url": "thewhitehouse.gov"
    },
    ...
]
```

### Creating Addresses

**Definition**

`POST /address`

**Arguments**

- `place_id:integer` identifier to an existing Place
- `address:string` the first address line (optinal)
- `address2:string` the second address line (optional)
- `city_id:integer` identifier to an existing City (optional)
- `postal_code:integer` the address postal code (optional)
- `phone:string` phone number (optional)
- `url:string` website url (optional)

**Responses**

- `201 Created` on success
- `202 Accepted` if the Address already exists
- `400 Bad Request` if any given place_id or city_id do not exist (Read message for more info)

```json
{
    "id": 1234,
    "place_id": 1234,
    "address": "1600 Pennyslvania Avenue",
    "address2": "",
    "city_id": 1234,
    "postal_code": 20500,
    "phone": "2024561111",
    "url": "thewhitehouse.gov"
}
```

## Category

### Getting Categories

**Definition**

`GET /category/?<category_id>`

**Responses**

- `200 OK` on success
- `404 Not Found` if the Category was not found

```json
[
    {
        "id": 1234,
        "category": "Category"
    },
    ...
]
```

### Creating Categories

**Definition**

`POST /category`

**Arguments**

- `"category":string` a friendly name for the category

**Responses**

- `201 Created` on success
- `202 Accepted` if the Category already exists

```json
{
    "id": 1234,
    "category": "Category"  
}
```