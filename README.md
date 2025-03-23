# Online Quiz Competition Software

This repository contains the full-stack implementation of an online quiz competition software built using the MERN stack (MongoDB, Express, React, Node.js). It includes both the backend and frontend components.

## Features

- **User Authentication**:
  - User registration and login with JWT-based authentication.
- **Question Management**:
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
- **Frontend Features**:
  - Responsive design.
  - User-friendly quiz interface.
  - Leaderboard display.
  - Timer for each question.

## Project Structure

```
online-quiz-competition-software/
├── online-quiz-backend   # Backend code (Node.js, Express, MongoDB)
├── online-quiz-frontend  # Frontend code (React, TypeScript)
└── package.json          # Root package.json for managing workspaces
```

## Setup Instructions

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd online-quiz-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file**:
   ```
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

4. **Seed the database**:
   ```bash
   npx ts-node src/scripts/seedQuestions.ts
   ```

5. **Start the backend server**:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5000`.

---

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd online-quiz-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file**:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend client**:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`.

---

## Technologies Used

- **MongoDB**: Database for storing users, questions, and leaderboard data.
- **Express**: Backend framework for building APIs.
- **React**: Frontend framework for building user interfaces.
- **Node.js**: Server-side runtime.
- **TypeScript**: Type safety and better development experience.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the [MIT License](./LICENSE).
