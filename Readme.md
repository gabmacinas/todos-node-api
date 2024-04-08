# Simple todo Node API

This is a simple todo API built with Node.js, Express and PostgreSql. It uses TypeScript for type checking.

## Installation

Pre-requisites:
- Node.js
- PostgreSql

Global dependencies:
- TypeScript
- Concurrently
```bash
npm install -g concurrently
npm install -g typescript 
```

## Usage 

- clone the repository
- update the environment variables in the .env file
- create a database in PostgreSql


install the dependencies
```bash
npm install
```

run the server
```bash
npm run dev
```

build the project
```bash
npm run build
```

## Endpoints

### GET /todos
Get all todos

### POST /todos
Create a new todo

### PUT /todos/:id
Update a todo

### DELETE /todos/:id
Delete a todo