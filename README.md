# Umeed Trust Management System Backend

Backend API for the Umeed Trust Management System.

The application provides authentication, content management, donation workflows, campaign management, media uploads, and administrative functionality for a trust or nonprofit organization.

## What Problem Does This Solve?

Trust and nonprofit organizations need a central system to manage public content and administrative operations.

This backend provides APIs for managing:

- Public website content
- Campaigns and programs
- Donations
- Blog posts and categories
- FAQs
- Gallery albums and images
- Testimonials
- Volunteers
- Contact submissions
- Application settings
- Administrator authentication

## Main Features

- Administrator authentication
- JWT-based protected routes
- Password hashing with bcrypt
- Prisma-based database access
- Campaign and program management
- Donation management
- Blog and blog-category management
- FAQ management
- Gallery album and image management
- Testimonial management
- Volunteer management
- Contact and form handling
- Dashboard and statistics endpoints
- Cloudinary media uploads
- Request validation
- Centralized error handling
- Slug generation for content
- Database seed data

## Architecture

```text
React Frontend
      |
      v
Express REST API
      |
      +--> Authentication and authorization
      +--> Public content endpoints
      +--> Admin management endpoints
      +--> Donation and contact workflows
      +--> File upload handling
      |
      v
Prisma ORM
      |
      v
Configured application database

Media files
      |
      v
Cloudinary
```

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript
- **Database access:** Prisma
- **Authentication:** JWT
- **Password security:** bcrypt
- **Validation:** express-validator
- **Security middleware:** Helmet and CORS
- **Logging:** Morgan
- **File uploads:** Multer
- **Media storage:** Cloudinary
- **Environment configuration:** dotenv

## Project Structure

```text
.
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── database.js
│   │   └── env.js
│   ├── controllers/
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.js
│   │   ├── upload.js
│   │   └── validator.js
│   ├── routes/
│   ├── utils/
│   └── validators/
├── seed.js
├── server.js
└── package.json
```

## Domain Areas

### Authentication

- Administrator login
- JWT token generation and validation
- Protected administrative routes
- Password hashing

### Content Management

- Blog posts and categories
- Campaigns
- Programs
- FAQs
- Testimonials
- Gallery albums
- Gallery images

### Organization Management

- Volunteers
- Contact submissions
- Application settings
- Dashboard statistics

### Donations

- Donation records
- Donation details
- Administrative donation workflows

### Media Uploads

Uploaded media is handled through Multer and configured for Cloudinary storage.

## Getting Started

### Prerequisites

- Node.js
- npm
- A database supported by the Prisma schema
- Cloudinary account and credentials if media uploads are enabled

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a local `.env` file.

Do not commit passwords, API keys, tokens, or database credentials.

The application uses configuration values for areas such as:

- Database connection
- JWT secret and token configuration
- Cloudinary credentials
- Server port
- Frontend or allowed-origin configuration

The exact variable names should remain consistent with `src/config/env.js` and the rest of the application.

### Generate the Prisma client

```bash
npx prisma generate
```

### Run database migrations

```bash
npx prisma migrate dev
```

### Seed the database

```bash
npm run seed
```

### Start the development server

```bash
npm run dev
```

### Start the production server

```bash
npm start
```

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the server with Nodemon |
| `npm start` | Start the server |
| `npm run prisma:migrate` | Run the configured Prisma migration command |
| `npm run prisma:generate` | Generate the Prisma client |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run seed` | Seed the database |

## API Organization

Routes are grouped by application domain:

```text
src/routes/
├── auth.routes.js
├── blog.routes.js
├── campaign.routes.js
├── contact.routes.js
├── dashboard.routes.js
├── donation.routes.js
├── faq.routes.js
├── gallery.routes.js
├── index.js
├── program.routes.js
├── setting.routes.js
├── testimonial.routes.js
└── volunteer.routes.js
```

Controllers contain request-handling logic, validators define input checks, and middleware handles authentication, uploads, and errors.

## Security Considerations

- Keep environment files private.
- Use a strong JWT secret in deployed environments.
- Configure allowed origins instead of permitting unrestricted CORS in production.
- Validate uploaded file types and sizes.
- Restrict administrative routes with authentication middleware.
- Use secure production database credentials.
- Rotate exposed credentials immediately if they are accidentally committed.

## Related Repository

- [Umeed Trust Frontend](https://github.com/umar1234-gift/TMS_Frontend)

## Current Limitations

- The repository does not currently include a detailed API reference.
- Production deployment instructions require environment-specific documentation.
- Automated test coverage should be expanded for authentication, donations, uploads, and administrative workflows.
- Production observability, rate limiting, and API versioning may require additional setup.

## Future Improvements

- Add OpenAPI or Swagger documentation.
- Add unit and integration tests for core controllers.
- Add CI checks for linting, builds, and database validation.
- Add structured logging and monitoring.
- Add stronger upload validation and image-processing rules.
- Add API versioning.
- Add deployment documentation.
