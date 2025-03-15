# Online Quiz Competition Software

This repository contains the backend for an online quiz competition software built using the MERN stack (MongoDB, Express, React, Node.js). It provides APIs for user authentication, question management, leaderboard management, and lifeline functionalities.

## Features

- **User Authentication**:
  - User registration and login with JWT-based authentication.
- **Question Management**:
  - CRUD operations for questions.
  - Fetch questions by level.
  - Timer functionality for each question.
  - Lifelines:
    - 50:50
    - Phone a Friend
    - Audience Poll
    - Flip the Question (change question).
- **Leaderboard Management**:
  - Fetch top 10 leaderboard entries.
  - Add scores to the leaderboard.
- **Database Configuration**:
  - MongoDB connection setup using Mongoose.
  - Seed script to populate the database with questions.
- **Timer Utility**:
  - Timer for question time limits with timeout handling.

## Project Structure

```
online-quiz-backend/
├── src/
│   ├── config/             # Database configuration
│   ├── controllers/        # API controllers
│   ├── middlewares/        # Authentication middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── scripts/            # Database seeding scripts
│   ├── utils/              # Utility functions (e.g., timer)
│   ├── types/              # Custom TypeScript types
│   ├── app.ts              # Express app setup
│   └── server.ts           # Entry point for the application
├── package.json            # Project metadata and dependencies
├── tsconfig.json           # TypeScript configuration
├── .env                    # Environment variables (excluded from version control)
├── .gitignore              # Files and folders to ignore in version control
└── README.md               # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rrohitsy0h0/Online-Quiz-Competition-Software---KBC
   cd online-quiz-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   - Ensure you have MongoDB installed and running.
   - Update the database connection settings in `.env`.

4. **Seed the database**:
   ```bash
   npx ts-node src/scripts/seedQuestions.ts
   ```

5. **Run the application**:
   - **Development**:
     ```bash
     npm run dev
     ```
   - **Production**:
     ```bash
     npm run build
     npm start
     ```

6. **Access the API**:
   - The server will be running on `http://localhost:5000` (or the specified port).

## Technologies Used

- **MongoDB**: Database for storing users, questions, and leaderboard data.
- **Express**: Backend framework for building APIs.
- **Node.js**: Server-side runtime.
- **TypeScript**: Type safety and better development experience.

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login and get a JWT token.

### Questions
- `GET /api/questions`: Get all questions (supports `level` query parameter).
- `POST /api/questions`: Create a new question.
- `PUT /api/questions/:id`: Update a question by ID.
- `DELETE /api/questions/:id`: Delete a question by ID.
- `POST /api/questions/answer`: Answer a question.
- `POST /api/questions/lifeline`: Use a lifeline.
- `POST /api/questions/next`: Navigate to the next question.

### Leaderboard
- `GET /api/leaderboard`: Get the leaderboard.
- `POST /api/leaderboard/add`: Add a score to the leaderboard.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the [MIT License](./LICENSE).
