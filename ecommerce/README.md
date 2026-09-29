# E-Commerce App — Node.js

Converted from Python Flask to Node.js + Express + MongoDB (Mongoose).

## Project Structure

```
ecommerce/
├── app.js                  # Main Express app (replaces app.py)
├── package.json
├── public/
│   ├── css/style.css       # Unchanged from Flask project
│   └── js/script.js        # Unchanged from Flask project
└── views/                  # EJS templates (replaces Jinja2 templates)
    ├── index.ejs           # Products page
    ├── cart.ejs            # Cart page
    └── checkout.ejs        # Checkout page
```

## Flask → Node.js Mapping

| Flask (Python)         | Node.js equivalent         |
|------------------------|----------------------------|
| `Flask`                | `express`                  |
| `render_template`      | `res.render()` with EJS    |
| `session`              | `express-session`          |
| `redirect / url_for`   | `res.redirect()`           |
| `PyMongo`              | `mongoose`                 |
| Jinja2 templates       | EJS templates (`.ejs`)     |
| `app.run(debug=True)`  | `app.listen(3000)`         |

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Start MongoDB locally
mongod --dbpath /data/db

# 3. Start the server
node app.js
# or with auto-reload:
npx nodemon app.js
```

Open http://localhost:3000

## Notes

- If MongoDB is not running, the app falls back to in-memory sample products automatically.
- Session secret in `app.js` should be changed to a strong random string in production.
