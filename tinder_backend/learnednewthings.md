# Node.js + Express Pro Notes (Quick + Deep)

## 1) Project Setup and Scripts

Install nodemon:

```bash
npm i -D nodemon
```

`package.json` scripts:

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  }
}
```

Use case:
- `npm run dev` for local development (auto restart)
- `npm start` for production-like simple run

## 2) Express Route Matching (Very Important)

Rule: Express checks routes **top to bottom**, first match wins.

Bad order:

```js
app.get("/test", (req, res) => res.send("test"));
app.get("/test/:id", (req, res) => res.send(req.params.id));
```

Good order (specific first):

```js
app.get("/test/:id", (req, res) => res.send(req.params.id));
app.get("/test", (req, res) => res.send("test"));
```

If route not found, browser shows `Cannot GET /path` (or 404 JSON if custom handler exists).

## 3) Every Request Must End Properly

If you neither send response nor call `next()`, request hangs and may time out.

Correct:

```js
app.get("/health", (req, res) => {
  return res.status(200).json({ ok: true });
});
```

## 4) Multiple Handlers in One Route

Syntax:

```js
app.get("/user", middleware1, middleware2, handler);
```

Example:

```js
app.get(
  "/user",
  (req, res, next) => {
    req.user = { firstName: "Jayram", lastName: "Kumar" };
    next();
  },
  (req, res) => {
    res.json(req.user);
  }
);
```

Golden rule: send only one response per request.

## 5) `next()` Behavior and `ERR_HTTP_HEADERS_SENT`

Wrong:

```js
app.get("/x", (req, res, next) => {
  res.send("done");
  next();
});
```

Why wrong: response already sent; next handler may try sending again -> `Error [ERR_HTTP_HEADERS_SENT]`.

Correct patterns:

```js
// pattern A: end here
app.get("/x", (req, res) => {
  res.send("done");
});

// pattern B: pass control, do not send here
app.get("/x", (req, res, next) => {
  req.msg = "done";
  next();
}, (req, res) => {
  res.send(req.msg);
});
```

## 6) Middleware vs Route Handler

Middleware:
- can run for many routes
- can modify `req`/`res`
- can end response OR call `next()`

Route handler:
- final function for a route
- usually sends the final response

## 7) Why `app.use()`

`app.use()` mounts middleware for:
- all HTTP methods
- a path prefix
- global pre-processing (logging, auth, parsing)

Examples:

```js
app.use(express.json());
app.use("/api", apiRouter);
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
```

## 8) Error-Handling Middleware (Order Matters)

Error middleware signature must be exactly:

```js
(err, req, res, next)
```

Example:

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error"
  });
});
```

Keep this near the end (after routes).

## 9) Async Error Handling Pattern

Basic safe pattern:

```js
app.get("/test", async (req, res, next) => {
  try {
    const data = await someAsyncWork();
    res.json(data);
  } catch (err) {
    next(err);
  }
});
```

Reusable wrapper:

```js
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get("/users", asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));
```

## 10) Auth Notes: HTTP, JWT, Cookies (Corrected)

Important correction:
- Browser API calls are HTTP/HTTPS requests.
- HTTP usually runs over TCP (HTTPS = HTTP over TLS over TCP).
- JWT is an auth token format, not a transport protocol.

Typical login flow:
1. User sends credentials (`POST /login`)
2. Server validates user
3. Server signs token (JWT)
4. Server sends token (often via HttpOnly cookie)
5. Client sends token in future requests
6. Server verifies token and authorizes request

JWT short syntax:

```js
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

const payload = jwt.verify(token, process.env.JWT_SECRET);
```

Secure cookie syntax:

```js
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 60 * 60 * 1000
});
```

Use case:
- `httpOnly` prevents JS access (reduces XSS token theft risk)
- `sameSite` helps reduce CSRF

## 11) Node.js Important Syntax to Remember

CommonJS exports/imports:

```js
// export
module.exports = { fn1, fn2 };

// import
const { fn1 } = require("./utils");
```

ESM style (if configured):

```js
export const fn1 = () => {};
import { fn1 } from "./utils.js";
```

Destructuring:

```js
const { body, params, query } = req;
```

Optional chaining + nullish coalescing:

```js
const city = user?.address?.city ?? "Unknown";
```

Short validation guard:

```js
if (!email || !password) {
  return res.status(400).json({ message: "Missing fields" });
}
```

Environment variables:

```js
require("dotenv").config();
const port = process.env.PORT || 3000;
```

## 12) Useful API Patterns (Production Mindset)

Standard response shape:

```js
res.status(200).json({ success: true, data, message: "OK" });
```

Pagination:

```js
const page = Number(req.query.page || 1);
const limit = Number(req.query.limit || 10);
const skip = (page - 1) * limit;
```

Status codes quick map:
- `200` success read/update
- `201` resource created
- `400` bad request
- `401` unauthorized (not logged in)
- `403` forbidden (no permission)
- `404` not found
- `409` conflict (duplicate)
- `500` server error

## 13) MongoDB + Mongoose Basics (For This Project Type)

Schema syntax:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
```

Connection syntax:

```js
await mongoose.connect(process.env.MONGO_URI);
```

## 14) Validation and Security Checklist

Always:
- validate body/query/params
- hash passwords (`bcrypt`)
- never return password hash in response
- use `helmet`, `cors`, rate limiting in production
- sanitize user input where needed

Password hash syntax:

```js
const bcrypt = require("bcrypt");
const hash = await bcrypt.hash(password, 10);
const isMatch = await bcrypt.compare(password, hash);
```

## 15) Pro Dev Short Q&A (Interview Style)

Q1. Why does route order matter in Express?
A. Express uses sequential matching. First matching route/middleware handles request.

Q2. Difference between `app.use` and `app.get`?
A. `app.use` is method-agnostic middleware mount; `app.get` handles only GET.

Q3. Can we call `res.send` twice?
A. No. One request must have one final response.

Q4. When do we use `next(err)`?
A. In async/sync failures to forward control to error middleware.

Q5. Why place error middleware at end?
A. It should catch errors bubbled up from previously mounted routes/middlewares.

Q6. JWT vs Session?
A. JWT is stateless token-based auth. Session is server-side stateful auth.

Q7. Where to store JWT in browser?
A. Prefer HttpOnly secure cookie for better protection from token theft via JS.

Q8. What causes `ERR_HTTP_HEADERS_SENT`?
A. Sending response more than once, or modifying headers after send.

Q9. Why use `return` before `res.status(...).json(...)` in guards?
A. Prevents function from continuing and accidentally sending another response.

Q10. What is middleware chaining?
A. Passing request through multiple functions using `next()` before final handler.

Q11. How to make async route errors safe everywhere?
A. Use an `asyncHandler` wrapper and centralized error middleware.

Q12. Why validation is not optional?
A. It protects data integrity, avoids crashes, improves API trust and security.

---

## Quick Revision in 30 Seconds

- Express route matching is top-to-bottom.
- One request -> one response.
- Use `next()` only when not ending response.
- Error middleware must be `(err, req, res, next)`.
- Wrap async routes and forward errors with `next(err)`.
- Prefer HttpOnly cookie for JWT.
- Validate inputs and hash passwords always.

## 16) Pure Notes (Very Simple Language)

These are simple notes to read fast before class/interview.

### Express Basics in Easy Words

- Express reads routes from top to bottom.
- First matching route runs.
- More specific route should be written before general route.
- If no route matches, we get 404 (like Cannot GET /abc).

### One Request, One Response

- For one incoming request, send only one final response.
- If you send response two times, app throws headers already sent error.
- If you do not send response and do not call next, request keeps waiting.

### next() in Very Simple Way

- next means go to next middleware/handler.
- If you already sent response, usually do not call next.
- Call next only when current function is not ending request.

Simple example:

```js
app.get("/demo",
  (req, res, next) => {
    req.message = "Hello";
    next();
  },
  (req, res) => {
    res.send(req.message);
  }
);
```

### app.use in Easy Words

- app.use is for middleware.
- It can run for many routes.
- Good for common logic: logging, auth check, parsing JSON.

### Error Handling in Easy Words

- Error middleware has 4 params: err, req, res, next.
- Keep it near end of file.
- In async code, use try catch and next(err).

### Auth in Easy Words

- User logs in with email/password.
- Server checks details.
- Server makes token (JWT).
- Token is sent to browser (often in secure cookie).
- Next API calls include token.
- Server verifies token and allows/denies request.

### Cookie Safety Easy Version

- httpOnly: browser JS cannot read token easily.
- secure: cookie travels only on HTTPS.
- sameSite strict/lax: helps reduce CSRF risk.

### Mongoose Easy Notes

- Schema defines field rules.
- Model talks to MongoDB collection.
- Validate before save.
- Never store plain password; always hash.

### Quick Do and Do Not

Do:
- keep route order clean
- validate input
- return after sending error response
- handle async errors

Do not:
- send response twice
- keep secrets in code
- trust user input directly
- expose password hash

### Super Short Revision

- Top to bottom route matching.
- One request one response.
- next for passing control only.
- Error middleware at end.
- JWT verify on each protected API.
- Validate and hash always.

## 17) 10 Must-Remember Code Snippets

### 1) Dev and Start Scripts

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  }
}
```

### 2) Basic Express Server

```js
const express = require("express");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(3000, () => console.log("Server running on 3000"));
```

### 3) Route Params + Query

```js
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const { expand } = req.query;
  res.json({ id, expand });
});
```

### 4) Middleware Chaining with next()

```js
app.get(
  "/demo",
  (req, res, next) => {
    req.message = "Hello from middleware";
    next();
  },
  (req, res) => {
    res.send(req.message);
  }
);
```

### 5) Async Handler Wrapper

```js
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get("/users", asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));
```

### 6) Global Error Middleware

```js
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});
```

### 7) JWT Sign + Verify

```js
const jwt = require("jsonwebtoken");

const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
  expiresIn: "1h"
});

const payload = jwt.verify(token, process.env.JWT_SECRET);
```

### 8) Secure HttpOnly Cookie

```js
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 60 * 60 * 1000
});
```

### 9) Password Hash + Compare (bcrypt)

```js
const bcrypt = require("bcrypt");

const hash = await bcrypt.hash(password, 10);
const isMatch = await bcrypt.compare(password, hash);
```

### 10) Mongoose Schema + Model

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
```