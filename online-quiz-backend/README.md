# Online Quiz Competition Software

This project is an online quiz competition software built using the MERN stack (MongoDB, Express, React, Node.js). It provides a platform for users to participate in quizzes, manage their scores, and view leaderboards.

## Features

- User authentication (registration and login)
- Display of user names
- A database of questions with multiple-choice options
- Timer for each question
- Navigation through questions with a "Next Question" button
- Lifelines: 
  - 50:50
  - Phone a Friend
  - Audience Poll
- Ranking system based on questions answered and time taken
- Time limits for the first 10 questions

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

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd online-quiz-backend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Set up the database:**
   - Ensure you have MongoDB installed and running.
   - Update the database connection settings in `src/config/db.ts`.

4. **Run the application:**
   ```
   npm start
   ```

5. **Access the API:**
   - The server will be running on `http://localhost:5000` (or the specified port).

## Technologies Used

- **MongoDB** for the database
- **Express** for the backend framework
- **Node.js** for the server-side runtime
- **TypeScript** for type safety and better development experience

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.