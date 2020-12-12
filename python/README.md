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

**Definitions**

`GET /account`

`GET /account/<account_id>`

**Responses**

- `200 OK` on success
- `404 Not Found` if the Account was not found

```json
[
    {
        "id": 1234,
        "account": "Account Name",
        "balance": 00.00,
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
    "balance": 00.00,
    "type": "DEBIT"        
}
```

## Addresses

### Getting Addresses

**Definitions**

`GET /address`

`GET /address/<address_id>`

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
        "postal_code": "20500",
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
    "postal_code": "20500",
    "phone": "2024561111",
    "url": "thewhitehouse.gov"
}
```

## Categories

### Getting Categories

**Definitions**

`GET /category`

`GET /category/<category_id>`

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

## Cities

### Getting Cities

**Definitions**

`GET /city`

`GET /city/<city_id>`

**Responses**

- `200 OK` on success
- `404 Not Found` if the City was not found

```json
[
    {
        "id": 1234,
        "city": "New York",
        "state_province": "New York",
        "country": "United States of America"
    },
    ...
]
```

### Creating Cities

**Definition**

`POST /city`

**Arguments**

- `"city":string` the name of the city
- `"state_province:string"` the state or province that the city is located
- `"country":string` the country that the city is located

**Responses**

- `201 Created` on success
- `202 Accepted` if the City already exists

```json
{
    "id": 1234,
    "city": "New York",
    "state_province": "New York",
    "country": "United States of America"
}
```

## Places

### Getting Places

**Definitions**

`GET /place`

`GET /place/<place_id>`

**Responses**

- `200 OK` on success
- `404 Not Found` if the Place was not found

```json
[
    {
        "id": 1234,
        "place": "Amazon"
    },
    ...
]
```

### Creating Places

**Definition**

`POST /place`

**Arguments**

- `"place":string` the name of the place

**Responses**

- `201 Created` on success
- `202 Accepted` if the Place already exists

```json
{
    "id": 1234,
    "place": "Amazon"  
}
```

## Tags

### Getting Tags

**Definitions**

`GET /tag`

`GET /tag/<tag_id>`

**Responses**

- `200 OK` on success
- `404 Not Found` if the Tag was not found

```json
[
    {
        "id": 1234,
        "tag": "food"
    },
    ...
]
```

### Creating Tags

**Definition**

`POST /tag`

**Arguments**

- `"tag":string` a friendly name for the tag

**Responses**

- `201 Created` on success
- `202 Accepted` if the Tag already exists

```json
{
    "id": 1234,
    "tag": "food"  
}
```

## Transactions

### Getting Transactions

**Definitions**

`GET /transaction`

`GET /transaction/<transaction_id>`

**Responses**

- `200 OK` on success
- `404 Not Found` if the Transaction was not found

```json
[
    {
        "id": 1234,
        "timestamp": "2038-01-19 03:14:07",
        "amount": 00.00,
        "account_id": 1234,
        "address_id": 1234,
        "category_id": 1234,
        "note": "Very nice service"
    },
    ...
]
```

### Creating Transactions

**Definition**

`POST /transaction`

**Arguments**



**Responses**

- `201 Created` on success
- `400 Bad Request` if the given account_id, address_id or category_id do not exist (Message has more info)

```json
{
    "id": 1234,
    "timestamp": "2038-01-19 03:14:07",
    "amount": 00.00,
    "account_id": 1234,
    "address_id": 1234,
    "category_id": 1234,
    "note": "Very nice service"
}
```