
# User Dashboard and Leaderboard Application

This application provides a comprehensive platform for managing user profiles, tracking donations, and displaying a real-time leaderboard. It's designed to be easily extendable and serves as a robust foundation for community-driven initiatives or internal team management where tracking contributions and engagement is key.

The backend is built with **Node.js** and **Express**, utilizing **MongoDB** for data persistence, while the frontend is a dynamic **React** application styled with **Tailwind CSS**, ensuring a responsive and modern user experience.

A unique feature is the integrated **referral system**, which incentivizes user growth by rewarding both the referrer and the new user upon successful registration.


## ✨ Features

### 🔐 Authentication & Authorization:
- User registration with email, name, and password.
- JWT-based login for secure session management.
- Role-based access control: `User`, `Admin`, `Superadmin`.
- Secure password hashing with `bcrypt`.

### 👤 User Management:
- Personalized dashboard displaying:
  - Intern name
  - Unique referral code (username)
  - Total donations raised
  - Current credits
- Static rewards/unlockables section to motivate users.
- Admins/Superadmins can:
  - Change user roles (with hierarchy checks).
- Dynamic leaderboard showing users sorted by donations.

### 🤝 Referral System:
- Users can register using a referral code (another user’s username).
- Both referrer and referred user receive **10 credits**.

---

## 💻 Technologies Used

### Backend:
- `Node.js`, `Express.js`
- `MongoDB` with `Mongoose`
- `jsonwebtoken` for JWT authentication
- `bcrypt` for password hashing
- `dotenv`, `CORS`

### Frontend:
- `React`
- `Tailwind CSS`

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (LTS recommended)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

## 📦 Backend Setup

1. **Clone the repository** or place your backend files (`index.js`, `DBconnect.js`, `Routes.js`, etc.) in a project folder.

2. **Install dependencies**:
   ```bash
   npm install


3. **Configure environment variables**:

   Create a `.env` file in the backend root with:

   ```
   KEY=your_jwt_secret_key_here
   PORT=3000
   DATABASE=mongodb://localhost:27017/bidding
   ```

4. **Start MongoDB**:

   ```bash
   mongod
   ```

5. **Run the backend server**:

   ```bash
   node index.js
   ```

   Output:

   ```
   database connection successful!!
   Server is running on port 3000
   ```

---

## 🧑‍💻 Frontend Setup

1. **Create React app**:

   ```bash
   npx create-react-app my-dashboard-app
   cd my-dashboard-app
   ```

2. **Install Tailwind CSS**:

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Configure Tailwind** (in `tailwind.config.js`):

   ```js
   content: [
     "./src/**/*.{js,jsx,ts,tsx}",
   ],
   ```

4. **Import Tailwind styles** in `index.css`:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. **Replace `src/App.js` with provided `App.jsx` code.**

6. **Run the React app**:

   ```bash
   npm start
   ```

---

## 🚀 Usage

### ✅ Register

* Go to `/signup`
* Enter Name, Email, Password
* (Optional) Referral Code
* Click **Signup**
<img width="921" height="882" alt="Screenshot 2025-08-06 015500" src="https://github.com/user-attachments/assets/b0de2a40-fa3e-485e-8e48-cc092953ab8b" />

### 🔐 Login

* Go to `/login`
* Enter Email and Password
* Click **Login**
<img width="972" height="874" alt="Screenshot 2025-08-06 015736" src="https://github.com/user-attachments/assets/b665788c-696b-41d2-866a-0ea14eba1b89" />

### 📊 Dashboard

* Shows:

  * Intern Name
  * Referral Code
  * Total Donations Raised
  * Current Credits
* View **Rewards & Unlockables**
* Buttons:

  * View Leaderboard
  * Logout

### 🏆 Leaderboard

<img width="1417" height="833" alt="Screenshot 2025-08-06 015926" src="https://github.com/user-attachments/assets/bb0040c9-a849-4384-9d43-6e573f5a5aff" />


* Lists all users ranked by **Amount** (donations)
* Return to Dashboard with "Back" button

---

## 🔗 API Endpoints

### 🔒 Authentication

#### `POST /api/auth/register`

Registers a new user (with optional referral).

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "refer": "string"
}
```

#### `POST /api/auth/login`

Returns JWT token.

```json
{
  "email": "string",
  "password": "string"
}
```

---

### 👤 User Profile & Data

#### `GET /api/auth/myProfile`

Returns authenticated user profile.
**Header**:

```
Authorization: Bearer <your_jwt_token>
```

#### `GET /api/auth/getUsers`

Returns all users sorted by donation amount.

---

### 🔐 Admin/Superadmin Routes

#### `GET /api/auth/admin`

Test endpoint for verifying access.

```json
{
  "message": "Welcome Admin"
}
```

#### `PUT /api/auth/changeRole`

Change user role.

```json
{
  "email": "target_user_email@example.com",
  "newRole": "user" | "admin" | "superadmin"
}
```

#### `GET /api/auth/users`

Get all users (admin/superadmin only).

---

## 🗂️ Folder Structure

```
.
├── backend/
│   ├── .env
│   ├── index.js
│   ├── DBconnect.js
│   ├── Routes.js
│   ├── AuthControllers.js
│   ├── Users.js
│   ├── middlewares.js
│   ├── package.json
│   └── package-lock.json
└── vite-project/
    ├── public/
    ├── src/
    │   ├── App.jsx
    │   ├── apiRoutes.jsx
    │   ├── index.css
    │   └── ... other files
    ├── tailwind.config.js
    └── package.json
```

