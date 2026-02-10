# Ethiopian Academy Football Management System (EAFMS)

A complete full-stack web system for managing a football academy in Ethiopia.

## Tech Stack

*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
*   **Backend**: Laravel 10+, MySQL
*   **Auth**: Laravel Sanctum (Token based)

## Prerequisites

*   Node.js & npm
*   PHP & Composer
*   XAMPP (or any MySQL server)

## Installation Guide

### 1. Database Setup (XAMPP)

1.  Start **Apache** and **MySQL** in XAMPP control panel.
2.  Open [phpMyAdmin](http://localhost/phpmyadmin).
3.  Create a new database named `eafms_db`.

### 2. Backend Setup (Laravel)

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    composer install
    ```
3.  Copy `.env.example` to `.env` and configure database:
    ```bash
    cp .env.example .env
    ```
    Open `.env` and set:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=eafms_db
    DB_USERNAME=root
    DB_PASSWORD=
    ```
4.  Generate key and run migrations:
    ```bash
    php artisan key:generate
    php artisan migrate
    ```
5.  Start the server:
    ```bash
    php artisan serve
    ```
    The API will run at `http://localhost:8000`.

### 3. Frontend Setup (Next.js)

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # OR if packages are missing
    npm install axios react react-dom next tailwindcss postcss autoprefixer
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The app will run at `http://localhost:3000`.

## Features Usage

1.  **Register**: Go to `/register` to create a Player account. You must be 18+.
2.  **Login**: Go to `/login`.
3.  **Roles**:
    *   **Player**: View schedule, performance.
    *   **Coach**: Schedule training, rate players.
    *   **Admin**: View all users.
    *   **Manager**: View reports.
    
    *Note: To create Coach/Admin/Manager accounts, you can manually edit the `role` column in the `users` database table via phpMyAdmin after registering as a player, or seed the database.*

## API Endpoints

*   `POST /api/register`
*   `POST /api/login`
*   `GET /api/me`
*   `GET /api/trainings`
*   `POST /api/trainings` (Coach+)
*   `GET /api/performances`
*   `POST /api/performances` (Coach+)
