# String Analysis API

A RESTful API service built with Express.js and TypeScript that analyzes strings and stores their computed properties including length, palindrome status, character frequency, and more.

## Features

- Analyze strings and compute properties (length, palindrome status, unique characters, word count, SHA-256 hash, character frequency)
- Store and retrieve analyzed strings
- Filter strings with multiple criteria
- Natural language query support
- Delete stored strings
- In-memory storage
- Full TypeScript support

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Dependencies](#dependencies)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)

## Prerequisites

- **Node.js**: v16 or higher
- **npm**: v7 or higher

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BigLens/hng-task-1.git
   cd hng-task-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running Locally

### Development Mode (with hot-reload)
```bash
npm run dev
```
The server will start on `http://localhost:3000`

### Production Mode
1. Build the project:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000`

## Dependencies

### Production Dependencies
- **express** (^4.21.2) - Fast, unopinionated web framework for Node.js

### Development Dependencies
- **typescript** (^5.7.3) - TypeScript language support
- **@types/node** (^22.10.2) - TypeScript definitions for Node.js
- **@types/express** (^5.0.0) - TypeScript definitions for Express
- **ts-node** (^10.9.2) - TypeScript execution environment for Node.js
- **nodemon** (^3.1.9) - Automatic server restart on file changes

### How to Install Dependencies

All dependencies are installed automatically with:
```bash
npm install
```

To install production dependencies only:
```bash
npm install --production
```

## Environment Variables

### Optional Configuration

- **PORT** - Server port (default: `3000`)
  ```bash
  PORT=8080 npm run dev
  ```

### Example `.env` File (Optional)
Create a `.env` file in the root directory:
```env
PORT=3000
```

**Note**: Currently, no environment variables are required. The API runs with default settings.

## API Endpoints

### 1. Create/Analyze String
**POST** `/strings`
- Analyzes and stores a string with computed properties

### 2. Get Specific String
**GET** `/strings/{string_value}`
- Retrieves a stored string by its value

### 3. Get All Strings with Filtering
**GET** `/strings`
- Query Parameters: `is_palindrome`, `min_length`, `max_length`, `word_count`, `contains_character`

### 4. Natural Language Filtering
**GET** `/strings/filter-by-natural-language?query=<natural_language_query>`
- Supports queries like "all single word palindromic strings"

### 5. Delete String
**DELETE** `/strings/{string_value}`
- Deletes a stored string

For detailed API documentation with request/response examples, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## Testing

### Using the REST Client (VS Code Extension)

1. Install the **REST Client** extension by Huachao Mao in VS Code
2. Open the `api.http` file
3. Click "Send Request" above any test case

### Using cURL

**Create a string:**
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'
```

**Get a specific string:**
```bash
curl http://localhost:3000/strings/racecar
```

**Get all strings:**
```bash
curl http://localhost:3000/strings
```

**Filter strings:**
```bash
curl "http://localhost:3000/strings?is_palindrome=true&word_count=1"
```

**Natural language query:**
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"
```

**Delete a string:**
```bash
curl -X DELETE http://localhost:3000/strings/racecar
```

## Project Structure

```
hng-task-1/
├── src/
│   ├── index.ts                 # Application entry point
│   ├── types.ts                 # TypeScript type definitions
│   ├── routes/
│   │   └── strings.ts           # All API route handlers
│   ├── storage/
│   │   └── stringStore.ts       # In-memory data storage
│   └── utils/
│       ├── stringAnalyzer.ts    # String analysis logic
│       └── naturalLanguageParser.ts  # Natural language query parser
├── dist/                        # Compiled JavaScript (generated)
├── api.http                     # REST Client test file
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── API_DOCUMENTATION.md         # Detailed API documentation
└── README.md                    # This file
```

## Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server

## Deployment

This API can be deployed to various platforms:

- **Railway**: [https://railway.app](https://railway.app)
- **Heroku**: [https://heroku.com](https://heroku.com)
- **AWS EC2/ECS**: [https://aws.amazon.com](https://aws.amazon.com)
- **DigitalOcean**: [https://digitalocean.com](https://digitalocean.com)

### Deployment Notes
- Ensure Node.js version compatibility (v16+)
- Set the `PORT` environment variable if required by the platform
- Run `npm run build` before deployment
- Use `npm start` as the start command

## Author

BigLens

## Repository

GitHub: [https://github.com/BigLens/hng-task-1](https://github.com/BigLens/hng-task-1)
