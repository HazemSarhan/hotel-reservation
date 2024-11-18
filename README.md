[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/HazemSarhan/hotel-reservation"></a>

<h3 align="center">[Hotel Reservation System]</h3>

  <p align="center">
    This project is a backend-only application designed to provide a robust and secure system for managing hotel bookings, payments, and reviews. Built with scalable and modern technologies, this API serves as the backbone for hotel reservation systems, supporting user management, payment integration, and dynamic hotel functionalities.
    <br />
    <a href="http://localhost:5000/api-docs/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://documenter.getpostman.com/view/36229537/2sAY55bJix">Postman Docs</a>
    ·
    <a href="https://github.com/HazemSarhan/hotel-reservation/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/HazemSarhan/hotel-reservation/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Models](#models)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)

## Features

Built with:

- Backend: Node.js, Express.js
- Database: PostgreSQL with Prisma ORM
- Authentication: JSON Web Tokens (JWT) for secure session management
- TypeScript: Strongly typed to ensure reliability and maintainability
- Cloudinary: For image processing and uploading.
- Stripe: For payment processing.

## Getting Started

- Node.js: Version 14 or higher
- PostgreSQL: Ensure a PostgreSQL database is available
- Prisma: ORM for database interactions
- Stripe

## Models

- Check the full Database ERD : [Link](https://drawsql.app/teams/drag0ns-team/diagrams/hotel-reservation)
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://i.imgur.com/ceAGNiD.png">
</picture>

## Installation :

1. Clone the repository:

```sh
git clone https://github.com/HazemSarhan/hotel-reservation.git
```

2. Navigate into the project directory:

```sh
cd hotel-reservation
```

3. Install dependencies:

```sh
npm install
```

4. Set up environment variables:
   Check: [Environment Variables](#environment-variables)

5. Initialize the database and generate Prisma client:

```sh
npx prisma migrate dev --name init
npx prisma generate
```

6. Start the server:

```sh
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT = 5000
JWT_SECRET = your-jwt-secret-key
JWT_LIFETIME = 1d
DATABASE_URL = your-db-connection-url
CLOUD_NAME = your-cloudinary-api-cloud-name
CLOUD_API_KEY = your-cloudinary-api-cloud-key
CLOUD_API_SECRET = your-cloudinary-api-cloud-secret-key
STRIPE_SECRET_KEY = your-stripe-secret-key
CLIENT_URL = localhost-or-your-main-host
STRIPE_WEBHOOK_SECRET = optinal-for-live-tests
```

## Routes

> [!NOTE]
> Check the docs for all routes & data [API Documentation](https://documenter.getpostman.com/view/36229537/2sAYBREDVd).

## Usage

After creating .env with all [Environment Variables](#environment-variables) :

1. Run the server using:

```sh
npm run dev
```

2. Register a new user.

> [!TIP]
> First registered account role will automatically set to => ADMIN

[contributors-shield]: https://img.shields.io/github/contributors/HazemSarhan/hotel-reservation?style=for-the-badge
[contributors-url]: https://github.com/HazemSarhan/hotel-reservation/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/HazemSarhan/hotel-reservation.svg?style=for-the-badge
[forks-url]: https://github.com/HazemSarhan/hotel-reservation/network/members
[stars-shield]: https://img.shields.io/github/stars/HazemSarhan/hotel-reservation.svg?style=for-the-badge
[stars-url]: https://github.com/HazemSarhan/hotel-reservation/stargazers
[issues-shield]: https://img.shields.io/github/issues/HazemSarhan/hotel-reservation.svg?style=for-the-badge
[issues-url]: https://github.com/HazemSarhan/hotel-reservation/issues
[license-shield]: https://img.shields.io/github/license/HazemSarhan/hotel-reservation.svg?style=for-the-badge
[license-url]: https://github.com/HazemSarhan/hotel-reservation/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/hazemmegahed/
[product-screenshot]: images/screenshot.png
[node-js]: https://svgur.com/i/19bZ.svg
[express-js]: https://svgur.com/i/19a1.svg
[mongo-db]: https://svgur.com/i/19b4.svg
[jwt]: https://svgshare.com/i/19bi.svg
[db]: https://i.imgur.com/0CzwXXA.png
