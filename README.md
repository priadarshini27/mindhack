# MindHack

MindHack is a full-stack cybersecurity awareness simulation game with a React frontend and seven Spring Boot microservices.

## Folder Structure

- `frontend` - React/Vite app with homepage, auth, oath, dashboard, simulation levels, result, leaderboard, and feedback panel.
- `user-service` - auth, session token, oath status, profile, rank history, streaks, best score. Port `8050`.
- `game-service` - mission orchestration and service-to-service flow. Port `8051`.
- `level-service` - level metadata. Port `8052`.
- `scenario-service` - realistic simulation payloads. Port `8053`.
- `answer-service` - action validation and attempt tracking. Port `8054`.
- `score-service` - score persistence, rank calculation, Top 3 leaderboard. Port `8055`.
- `feedback-service` - AI-style behavior and weakness analysis. Port `8056`.
- `k8s` - Kubernetes deployments/services with replicas set to `2`.

## API Flow

Frontend calls `user-service` for signup/login. After login, the frontend blocks game access until all five oath pledges are stored by `user-service`.

Game flow:

`Frontend -> user-service -> game-service -> level-service -> scenario-service -> answer-service -> score-service -> feedback-service`

The frontend starts a game through `game-service`. `game-service` fetches level metadata from `level-service`, scenario payloads from `scenario-service`, validates decisions through `answer-service`, sends score updates to `score-service`, and the result page sends action traces to `feedback-service` for improvement analysis.

## Database Schema

Each service uses its own database:

- `user_db`: `user_profile`, `user_profile_rank_history`
- `game_db`: `game_session`, `game_session_level_scores`
- `level_db`: `level`
- `scenario_db`: `scenario`
- `answer_db`: `answer_attempt`
- `score_db`: `score`
- `feedback_db`: `feedback`

`init.sql` creates all seven databases. JPA uses `ddl-auto=update` to create service-owned tables independently.

## Leaderboard Logic

`score-service` stores every level update with `playerName`, `score`, `totalScore`, `rankName`, and `streak`. The leaderboard endpoint returns `findTop3ByOrderByTotalScoreDescStreakDesc()`, so score is the primary ranking factor and streak breaks ties.

Rank thresholds:

- `0-249`: Beginner
- `250-449`: Intermediate
- `450-649`: Expert
- `650+`: Cyber Defender Elite

## Streak Logic

`user-service` tracks daily login streaks and best streak. `gameReducer` tracks consecutive correct decisions during the simulation. A wrong decision resets the in-game streak and deducts a lifeline unless Shield is armed.

## Running

```bash
docker compose up --build
```

Frontend: `http://localhost:3000`

Services: `8050-8056`
