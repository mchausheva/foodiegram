# 🍽️ FoodieGram

Social recipe-sharing app built with React + TypeScript and a Node/Express API backed by MongoDB (Mongoose). Features creation and moderation of recipes, social interactions, and a friendly UI.

## ✨ Highlights

- Auth: signup/login, guest mode, JWT sessions
- Admin: approve/decline recipes, review draft changes, manage users, categories, and banned emails
- Recipes: images, ingredients, steps, nutrition, tags, categories
- Interactions: like, save, comment (with “post as Anonymous” option)
- Moderation flow: edits require re-approval; published version remains visible until approval
- Filtering/sorting/search: category, difficulty, query, and sort (new/old/rating)
- Pagination: server-side, 10 per page

## 🛠️ Tech Stack

### Backend
- Node.js, Express, TypeScript
- MongoDB Atlas (or local MongoDB) with Mongoose
- JWT (jsonwebtoken), bcryptjs, multer, cors

### Frontend
- React + TypeScript (Vite)
- Redux Toolkit, React Router, React Bootstrap, Axios

## 📁 Project Structure (simplified)

```
foodiegram/
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Express app
│   │   ├── index.ts               # Server entry (connects DB)
│   │   ├── config/db.ts           # Mongo connection + seed
│   │   ├── controllers/           # authController, recipeController
│   │   ├── db/models/             # Mongoose models (User, Recipe, Category, BannedEmail)
│   │   ├── middleware/            # protect, requireAdmin, upload
│   │   ├── routes/                # authRoutes, recipeRoutes
│   │   ├── models/                # TypeScript interfaces
│   │   └── mockData/              # Initial recipes for seeding
│   └── public/uploads/            # Uploaded images
└── frontend/
    └── src/                       # React app (components/pages/store)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Install
```bash
cd foodiegram
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Environment

Create `backend/.env`:
```env
PORT=5000
JWT_SECRET=supersecret
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster-host>/foodiegram?retryWrites=true&w=majority
```

Optional: `frontend/.env.local` (only if you run backend on different host/port):
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Run
```bash
# backend
cd backend
npm run dev

# frontend
cd ../frontend
npm run dev
```
- API: `http://localhost:5000`
- App: `http://localhost:5173`

On first run the backend seeds:
- Admin user: `admin@foodiegram` / `admin123`
- Categories (13 items)
- Mock recipes (approved)

## 📡 API Overview

### Auth
- `POST /api/auth/signup` – register
- `POST /api/auth/login` – login
- `POST /api/auth/guest` – guest token (read-only)
- `GET /api/auth/me` – current user
- `PUT /api/auth/me` – update user profile

Admin-only:
- `GET /api/auth/users`
- `PUT /api/auth/users/:id/toggle-active`
- `GET /api/auth/banned-emails`
- `POST /api/auth/banned-emails` ({ email })
- `DELETE /api/auth/banned-emails` ({ email })

### Recipes
- `GET /api/recipes`
  - Query params:
    - `q` – search in title
    - `category` – comma-separated list
    - `difficulty` – comma-separated list
    - `sort` – `new` | `old` | `rating`
    - `page` – default 1
    - `limit` – default 10 (max 10)
    - `savedOnly` – `true` to return only the caller’s saved recipes
- `GET /api/recipes/mine` – caller’s recipes
- `GET /api/recipes/:id` – detail (non-owners see only approved recipes)
- `POST /api/recipes` – create (multipart/form-data; `image` field optional)
- `PUT /api/recipes/:id` – edit → stored in `draft` and marks `status='pending'`
- `DELETE /api/recipes/:id` – delete (owner)
- `PUT /api/recipes/:id/like` – toggle like
- `PUT /api/recipes/:id/save` – toggle save
- `POST /api/recipes/:id/comments` – { text, anonymous? }

Admin-only:
- `PUT /api/recipes/:id/status` – { status: 'approved'|'declined', reason? }
  - On approve: if a `draft` exists it is published into the recipe and cleared.

### Categories
- `GET /api/recipes/categories`
- `POST /api/recipes/categories` (admin)
- `PUT /api/recipes/categories/:name` (admin)
- `DELETE /api/recipes/categories/:name` (admin)

## 🔐 Roles & Visibility

- Guest: can browse and filter, but cannot like/save/comment/create/edit/delete.
- User: full create/edit (edits require admin approval), like/save/comment.
- Admin: approve/decline recipes, manage users, categories, banned emails.
- Visibility:
  - Non-owner sees only `approved` recipes.
  - Owner and admin can see all statuses.
  - Edits are saved as `draft` and visible to admin in review; published version remains visible to everyone until approved.

## 🧭 Frontend Notes

- Home features a hero carousel with overlay CTA.
- Recipes page supports query, sorting, category/difficulty filters, and pagination (10/page).
- Saved page and Profile stats hydrate from the API (savedOnly and mine respectively).
- Admin page tabs: Pending (with Review modal incl. draft toggle), Users, Banned Emails, Categories.

## 🧪 Quick Test Flow

1) Login as admin and visit `/admin` → Pending Recipes.
2) Create a new recipe as a normal user → status becomes Pending; admin can Review (toggle between published/draft) and Approve.
3) Save a recipe → it appears under `Saved` and Profile shows the saved count.
4) Edit a recipe → changes go to draft; published content remains until admin approval.

## License

MIT

---

Happy cooking! 🍳✨
