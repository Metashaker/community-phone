# Community Home Take Home Challenge

## Table of Contents
- [Community Home Take Home Challenge](#community-home-take-home-challenge)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Architecture and technologies](#architecture-and-technologies)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
    - [Running Tests](#running-tests)
  - [Other potential improvements](#other-potential-improvements)
  - [Questions](#questions)
  - [License](#license)

## Project Overview

The high level goal of the project, is to build a backend microservice that powers the calls history feature of the app. This is comprised of the following endpoints:

- `POST /events`: Receives phone carriers webhooks events when a call is started (and created in the DB), or ended (and marked as ended in the DB). **Important note: We call success after a job is successfully enqueued to achieve less latency.**
- `GET /events/failures`: Returns calls that haven't been marked as ended within the last 2 hours, considering a call can last up to 1 hour. Mostly to monitor the aforementioned calls, since phone carriers sometimes fail to send the ended call webhook event.

## Architecture and technologies

- Main server (Nestjs): Listens and responds to requests, with the exception of webhook events, which are enqueued to guarantee less latency and more availability.
- Queue (Redis): Where webhook events are enqueued as jobs.
- Worker server (Nestjs): Picks up enqueued jobs and processes them. This server can be scaled independently from the main server.
- Database (Prisma ORM and PostgreSQL): For storage.


## Getting Started

### Prerequisites

- Node.js between 22.4.0 and 23.0.0
- npm or yarn
- Postgres
- Redis

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/community-home-take-home-challenge.git
    ```
2. Navigate to the project directory:
    ```sh
    cd community-home-take-home-challenge
    ```
3. Install dependencies:
    ```sh
    npm install (or your preferred package manager)
    ```


### Running the Application

1. Create and fill `.env` file. Go to `.env.example` file for an example of needed env vars.
2. Start PostgreSQL and Redis:
    ```sh
    brew services start postgresql@<your-psql-version> && brew services start redis
    ```
3. Start the backend server:
    ```sh
    npm run start:dev (or your preferred package manager)
    ```
4. Start the worker server:
    ```sh
    npm run startWorker:dev (or your preferred package manager)
    ```

### Running Tests

To run tests, use the following command:
```sh
npm test
```
## Other potential improvements
- Add Taskforce as a dashboard to visualize failed jobs (and all other states), which are not deleted from the queue unless they're deleted manually.
- Luxon for more legible date handling.
- created_at and deleted_at timestamps on calls table

## Questions
Don't hestitate on reaching out, you have my email ;).

## License

This project is licensed under the MIT License.