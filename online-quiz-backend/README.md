# Online Quiz Backend

This is the backend server for the Online Quiz Competition platform. It is built with Node.js, Express, and MongoDB.

## Features
- User authentication (login/register)
- Quiz question management
- Leaderboard management

## Prerequisites
- Node.js (v16 or later)
- MongoDB (running locally or on a cloud service like MongoDB Atlas)

## Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd online-quiz-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the backend directory with the following variables:
   ```
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Questions
- `GET /api/questions?level=<level>` - Fetch questions for a specific level
- `POST /api/questions/answer` - Submit an answer for a question

### Leaderboard
- `GET /api/leaderboard` - Fetch the leaderboard
- `POST /api/leaderboard/add` - Add a score to the leaderboard

## Project Structure

```
online-quiz-backend
├── src
│   ├── config
│   │   └── db.ts
│   ├── controllers
│   │   ├── authController.ts
│   │   ├── questionController.ts
│   │   └── leaderboardController.ts
│   ├── models
│   │   ├── User.ts
│   │   ├── Question.ts
│   │   └── Leaderboard.ts
│   ├── routes
│   │   ├── authRoutes.ts
│   │   ├── questionRoutes.ts
│   │   └── leaderboardRoutes.ts
│   ├── middlewares
│   │   └── authMiddleware.ts
│   ├── utils
│   │   └── timer.ts
│   ├── app.ts
│   └── server.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies Used

- **MongoDB** for the database
- **Express** for the backend framework
- **Node.js** for the server-side runtime
- **TypeScript** for type safety and better development experience

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.