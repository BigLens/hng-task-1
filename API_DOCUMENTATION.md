# String Analysis API Documentation

A RESTful API service that analyzes strings and stores their computed properties.

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Create/Analyze String

**POST** `/strings`

Analyzes a string and stores its computed properties.

#### Request Body
```json
{
  "value": "string to analyze"
}
```

#### Success Response (201 Created)
```json
{
  "id": "94b4087035c47dc5ec70499327758a792a6a4db132313a67143ec61dc489c33f",
  "value": "string to analyze",
  "properties": {
    "length": 17,
    "is_palindrome": false,
    "unique_characters": 13,
    "word_count": 3,
    "sha256_hash": "94b4087035c47dc5ec70499327758a792a6a4db132313a67143ec61dc489c33f",
    "character_frequency_map": {
      "s": 1,
      "t": 2,
      "r": 1,
      "i": 1,
      "n": 2,
      "g": 1,
      " ": 2,
      "o": 1,
      "a": 2,
      "l": 1,
      "y": 1,
      "z": 1,
      "e": 1
    }
  },
  "created_at": "2025-10-21T12:32:38.656Z"
}
```

#### Error Responses

**400 Bad Request** - Invalid request body or missing "value" field
```json
{
  "error": "Invalid request body"
}
```
```json
{
  "error": "Missing \"value\" field"
}
```

**409 Conflict** - String already exists in the system
```json
{
  "error": "String already exists in the system"
}
```

**422 Unprocessable Entity** - Invalid data type for "value" (must be string)
```json
{
  "error": "Invalid data type for \"value\" (must be string)"
}
```

---

### 2. Get Specific String

**GET** `/strings/{string_value}`

Retrieves a previously analyzed string by its value.

#### URL Parameters
- `string_value` - The original string value (URL-encode if contains spaces)

#### Success Response (200 OK)
```json
{
  "id": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
  "value": "racecar",
  "properties": {
    "length": 7,
    "is_palindrome": true,
    "unique_characters": 4,
    "word_count": 1,
    "sha256_hash": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
    "character_frequency_map": {
      "r": 2,
      "a": 2,
      "c": 2,
      "e": 1
    }
  },
  "created_at": "2025-10-21T12:33:20.170Z"
}
```

#### Error Response

**404 Not Found** - String does not exist in the system
```json
{
  "error": "String does not exist in the system"
}
```

---

### 3. Get All Strings with Filtering

**GET** `/strings`

Retrieves all stored strings with optional filtering.

#### Query Parameters
- `is_palindrome` (boolean) - Filter by palindrome status (true/false)
- `min_length` (integer) - Minimum string length
- `max_length` (integer) - Maximum string length
- `word_count` (integer) - Exact word count
- `contains_character` (string) - Single character to search for

#### Example Request
```
GET /strings?is_palindrome=true&min_length=5&max_length=20&word_count=1&contains_character=a
```

#### Success Response (200 OK)
```json
{
  "data": [
    {
      "id": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
      "value": "racecar",
      "properties": {
        "length": 7,
        "is_palindrome": true,
        "unique_characters": 4,
        "word_count": 1,
        "sha256_hash": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
        "character_frequency_map": {
          "r": 2,
          "a": 2,
          "c": 2,
          "e": 1
        }
      },
      "created_at": "2025-10-21T12:33:20.170Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "max_length": 20,
    "word_count": 1,
    "contains_character": "a"
  }
}
```

#### Error Response

**400 Bad Request** - Invalid query parameter values or types
```json
{
  "error": "Invalid query parameter values or types"
}
```

---

### 4. Natural Language Filtering

**GET** `/strings/filter-by-natural-language`

Filters strings using natural language queries.

#### Query Parameters
- `query` (string) - Natural language query describing the filters

#### Supported Query Patterns

| Query Example | Parsed Filters |
|--------------|----------------|
| "all single word palindromic strings" | `word_count=1`, `is_palindrome=true` |
| "strings longer than 10 characters" | `min_length=11` |
| "palindromic strings that contain the first vowel" | `is_palindrome=true`, `contains_character=a` |
| "strings containing the letter z" | `contains_character=z` |

#### Example Request
```
GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings
```

#### Success Response (200 OK)
```json
{
  "data": [
    {
      "id": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
      "value": "racecar",
      "properties": {
        "length": 7,
        "is_palindrome": true,
        "unique_characters": 4,
        "word_count": 1,
        "sha256_hash": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
        "character_frequency_map": {
          "r": 2,
          "a": 2,
          "c": 2,
          "e": 1
        }
      },
      "created_at": "2025-10-21T12:33:20.170Z"
    }
  ],
  "count": 1,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

#### Error Responses

**400 Bad Request** - Unable to parse natural language query
```json
{
  "error": "Unable to parse natural language query"
}
```

**422 Unprocessable Entity** - Query parsed but resulted in conflicting filters
```json
{
  "error": "Query parsed but resulted in conflicting filters"
}
```

---

### 5. Delete String

**DELETE** `/strings/{string_value}`

Deletes a previously stored string by its value.

#### URL Parameters
- `string_value` - The original string value (URL-encode if contains spaces)

#### Success Response (204 No Content)
Empty response body

#### Error Response

**404 Not Found** - String does not exist in the system
```json
{
  "error": "String does not exist in the system"
}
```

---

## String Properties Explained

Each analyzed string has the following computed properties:

- **length**: Total number of characters in the string
- **is_palindrome**: Boolean indicating if the string reads the same forwards and backwards (case-insensitive)
- **unique_characters**: Count of distinct characters in the string
- **word_count**: Number of words separated by whitespace
- **sha256_hash**: SHA-256 hash used as unique identifier
- **character_frequency_map**: Object mapping each character to its occurrence count

---

## Notes on URL Encoding

When passing strings with special characters (spaces, symbols) in URL paths, ensure proper URL encoding:
- Spaces: `%20`
- Example: `"race car"` → `/strings/race%20car`
