# Credintials To Login -
Admin :
email - rahul@gmail.com
password - Rahul@123

Owner :
email - vnbarkare@gmail.com
password - Vedika@123

email - swam@gmail.com
password - Swanand@123

User :
email - aa@gmail.com
password - Aaradhy@123

# Store Rating App

A full-stack web application for managing stores and collecting ratings from users.

This project includes:
- A `React + Vite` frontend
- A `Node.js + Express` backend
- `MySQL` database integration through `Sequelize`
- Role-based access for `admin`, `user`, and `owner`

## Features

### Admin
- View dashboard totals for users, stores, and ratings
- Create admins, normal users, and store owners
- Create stores and assign them to owners
- Filter users by name, email, address, and role
- Filter stores by name, owner email, and address

### User
- Register and log in
- Browse all stores
- Search stores by name
- Open a store details page
- Submit a new rating
- Update an existing rating
- View and update account password

### Owner
- View assigned store details
- View average rating for owned stores
- View users who rated the store
- Update account password

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- React Hot Toast

### Backend
- Node.js
- Express
- Sequelize
- MySQL2
- JSON Web Token
- bcryptjs
- cors
- dotenv

## Authentication

- JWT-based authentication is used for protected routes.
- The frontend stores the token in `localStorage`.
- Axios attaches the token to requests using the `Authorization: Bearer <token>` header.

## Validation Rules

### User creation and registration
- Name must be between `20` and `60` characters
- Email must be valid
- Password must be between `8` and `16` characters
- Password must include at least:
  - one uppercase letter
  - one special character
- Address must be at most `400` characters

### Store creation
- Store name is required
- Address is required
- Address must be at most `400` characters
- Owner email must belong to an existing user with role `owner`

## Default App Flow

1. Admin creates store owners and stores.
2. Users register and log in.
3. Users browse stores and submit ratings.
4. Owners log in to view ratings for their assigned stores.
5. Admin monitors counts and manages data.

## UI Notes

- The frontend uses a custom warm-toned design system.
- Icons are rendered with Font Awesome via a CDN stylesheet import.

## Scripts

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Current Limitations

- There are no automated tests configured yet.
- The project currently relies on `localStorage` for client-side session storage.
- Font Awesome icons are loaded from a CDN rather than local package assets.

## Future Improvements

- Add unit and integration tests
- Add pagination for large user/store lists
- Add stronger form validation on the backend
- Add image/logo upload support for stores
- Move icon assets to local dependencies
- Add deployment instructions

## Author

Built as a store rating management system using React, Express, MySQL, and Sequelize.
