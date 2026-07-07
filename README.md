# HireLoop — MERN Stack Job Portal

A full-stack job portal built with MongoDB, Express, React, and Node.js.
Job seekers can browse/search jobs and apply. Employers can post jobs,
manage listings, and review applicants.

## File Structure

```
job-portal-mern/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   ├── User.js                # jobseeker / employer / admin
│   │   ├── Job.js
│   │   └── Application.js
│   ├── middleware/
│   │   └── auth.js                # JWT protect + role authorize
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # axios instance + auth token interceptor
    │   ├── context/
    │   │   └── AuthContext.js     # global auth state (login/register/logout)
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── JobCard.js
    │   │   └── PrivateRoute.js    # role-based route guard
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Jobs.js            # search, filter, paginate
    │   │   ├── JobDetails.js      # view + apply
    │   │   ├── PostJob.js         # employer only
    │   │   ├── Dashboard.js       # employer: manage jobs + applicants
    │   │   └── MyApplications.js  # jobseeker only
    │   ├── App.js                 # routes
    │   ├── App.css                # all styling
    │   └── index.js
    ├── .env.example
    └── package.json
```

## Features

- **Auth**: JWT-based register/login with two roles — `jobseeker` and `employer`.
- **Jobs**: create, edit, delete (employer), full-text search + filters by
  location/type, pagination (everyone).
- **Applications**: jobseekers apply once per job with an optional cover
  letter; employers view applicants per job and update status
  (pending → reviewed → shortlisted → rejected/hired).
- **Access control**: `middleware/auth.js` protects routes and restricts
  actions by role; frontend `PrivateRoute` mirrors this on the client.

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (local Mongo or Atlas) and a strong JWT_SECRET
npm run dev      # starts on http://localhost:5000
```

Requires MongoDB running locally (`mongod`) or a MongoDB Atlas connection
string in `MONGO_URI`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend runs on a different URL
npm start         # starts on http://localhost:3000
```

## API Reference

| Method | Route                              | Access            | Description                        |
|--------|-------------------------------------|--------------------|-------------------------------------|
| POST   | /api/auth/register                 | Public             | Create account                      |
| POST   | /api/auth/login                    | Public             | Log in, returns JWT                 |
| GET    | /api/auth/me                       | Logged in          | Current user profile                |
| PUT    | /api/auth/me                       | Logged in          | Update profile                      |
| GET    | /api/jobs                          | Public             | List jobs (search/filter/paginate)  |
| GET    | /api/jobs/:id                      | Public             | Job detail                          |
| POST   | /api/jobs                          | Employer           | Create job                          |
| PUT    | /api/jobs/:id                      | Employer (owner)   | Update job                          |
| DELETE | /api/jobs/:id                      | Employer (owner)   | Delete job                          |
| GET    | /api/jobs/employer/mine            | Employer           | Jobs posted by current employer     |
| POST   | /api/applications/:jobId           | Jobseeker          | Apply to a job                      |
| GET    | /api/applications/mine             | Jobseeker          | My applications                     |
| GET    | /api/applications/job/:jobId       | Employer (owner)   | Applicants for a job                |
| PUT    | /api/applications/:id/status       | Employer (owner)   | Update applicant status             |

## Next Steps / Ideas

- File uploads for resumes (e.g. via `multer` + S3/Cloudinary) — the
  `resumeUrl` field is already wired up in the models.
- Email notifications on application status changes.
- Admin role for moderating job listings.
- Deploy: backend to Render/Railway, frontend to Vercel/Netlify, DB on
  MongoDB Atlas.
