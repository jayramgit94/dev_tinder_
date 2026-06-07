# Node.js + Express Interview Homework (Moderate)

## 1) How do you create and initialize a repository for a Node.js project?
Use `git init` to start version control and `npm init -y` to initialize Node metadata.
Example: create folder, run both commands, then your project is ready for commits and packages.

## 2) What are `node_modules`, `package.json`, and `package-lock.json`?
`package.json` stores project info and dependency ranges; `node_modules` contains installed packages.
`package-lock.json` locks exact versions for consistent installs across systems.

## 3) How do you install Express and why is it used?
Run `npm install express` to add Express as a dependency.
Express helps create APIs and route handling faster than raw Node HTTP setup.

## 4) How do you create a basic Express server?
Import Express, create `app`, and define routes.
Example: `const app = express(); app.get('/', (req,res)=>res.send('Hi'));`.

## 5) How do you make the server listen on port `7777`?
Use `app.listen(7777, () => console.log('Server running'));`.
This binds your app to that port so browser/Postman can send requests.

## 6) How to write handlers for `/test` and `/hello`?
Define route methods like `app.get('/test', ...)` and `app.get('/hello', ...)`.
Example: return JSON from `/test` and plain text from `/hello`.

## 7) Why use Nodemon, and how do scripts change?
Nodemon auto-restarts server on file changes, improving development speed.
Example scripts: `"start": "node src/app.js"`, `"dev": "nodemon src/app.js"`.

## 8) What are dependencies in Node.js?
Dependencies are external libraries your app needs at runtime.
Example: `express` in `dependencies`, while `nodemon` is usually in `devDependencies`.

## 9) What is the use of `-g` in `npm install -g`?
`-g` installs a package globally so its command is available system-wide.
Example: `npm install -g nodemon` lets you run `nodemon` from any project.

## 10) Difference between caret `^` and tilde `~` in versions?
`^1.2.3` allows minor and patch updates (`1.x.x`), while `~1.2.3` allows only patch updates (`1.2.x`).
Use `~` for stricter stability, `^` for safer feature updates.

## 11) What is middleware in Express?
Middleware is a function that runs between request and response.
Example: `app.use(express.json())` parses incoming JSON request bodies.

## 12) Difference between `req.params`, `req.query`, and `req.body`?
`params` comes from URL path, `query` from `?key=value`, and `body` from request payload.
Example: `/user/10?active=true` gives params `10`, query `active=true`.

## 13) Why should `.env` files not be committed?
They often contain secrets like DB URLs and API keys.
Example: add `.env` to `.gitignore` and load values using `dotenv`.

## 14) What is the difference between `npm install` and `npm ci`?
`npm install` may update lockfile; `npm ci` installs exactly from lockfile for clean builds.
Example: CI/CD pipelines prefer `npm ci` for reproducible deployments.

## 15) How do you send proper HTTP status codes in Express?
Use `res.status(code).send(...)` or `.json(...)`.
Example: `res.status(404).json({ error: 'Not Found' })` for missing routes.

## 16) How can you handle errors centrally in Express?
Create error-handling middleware with signature `(err, req, res, next)`.
Example: throw in routes, then return `500` with a safe error message from one place.

## 17) What is the purpose of `app.use()` in Express?
`app.use()` mounts middleware for all matching routes and methods.
Example: `app.use('/api', authMiddleware)` protects every route under `/api`.

## 18) Difference between `PUT` and `PATCH` in REST APIs?
`PUT` usually replaces the full resource, while `PATCH` updates specific fields only.
Example: changing only user email should use `PATCH /users/1`.

## 19) Why do we use `express.json()` middleware?
It parses JSON request bodies into `req.body` so routes can access sent data.
Example: without it, `req.body` is undefined for JSON POST requests.

## 20) What is CORS and when is it needed?
CORS controls which origins can access your backend from browsers.
Example: frontend at port 3000 calling API at 7777 needs allowed origin settings.

## 21) What is route parameter validation and why important?
Validation checks if incoming IDs, emails, or payloads are correct before processing.
Example: reject `id=abc` with 400 instead of crashing DB query logic.

## 22) How do async/await errors behave in Express routes?
Unhandled async errors can crash flow or skip response unless passed to error middleware.
Example: wrap with try/catch and call `next(err)` for centralized handling.

## 23) What are environment-based scripts in `package.json`?
Scripts can run different commands for development and production environments.
Example: `dev` uses nodemon, while `start` runs plain Node for production.

## 24) Why should API responses be consistent in structure?
A fixed response format improves frontend integration and debugging speed.
Example: always send `{ success, data, message }` for predictable handling.

## 25) What is the role of status code `201 Created`?
`201` indicates a new resource was successfully created on the server.
Example: after creating a user, return `201` with created user details.

## 26) Why separate routes, controllers, and config files?
Separation improves readability, testing, and scalability as project grows.
Example: keep route paths in one file and business logic in controller files.

## 27) How do you initialize Git in this project?
Run `git init` once in project root, then add files and commit.
Example: `git add .` then `git commit -m "initial commit"`.

## 28) Why do we use `.gitignore`?
It prevents unnecessary or sensitive files from being tracked in Git.
Example: ignore `node_modules`, `.env`, logs, and build outputs.

## 29) How do you create a remote repository on GitHub and connect it?
Create empty repo on GitHub, then link local repo using remote origin.
Example: `git remote add origin <repo-url>` and verify with `git remote -v`.

## 30) How do you push local code to remote origin?
Push your current branch after first commit and set upstream.
Example: `git push -u origin main` then later use `git push` only.

## 31) How can you test route variations like `/hello`, `/`, `/hello/2`, `/xyz`?
Define separate route handlers and hit each endpoint in browser or Postman.
Example: make `/xyz` return 404-style JSON to practice custom responses.

## 32) Why does route order matter in Express?
Express matches routes top-to-bottom, so earlier matches stop further checks.
Example: put specific routes before wildcard route like `app.get('*', ...)`.

## 33) How do you use Postman workspace and collection for API testing?
Create a workspace, then a collection and save requests by endpoint and method.
Example: add `GET /hello`, `POST /user`, and keep test payloads in collection.

## 34) How to handle GET, POST, PATCH, DELETE and test in Postman?
Define `app.get`, `app.post`, `app.patch`, `app.delete` with clear status codes.
Example: send JSON body in POST/PATCH and verify 200, 201, 400, 404 responses.



## 35) What is `/abc`, `/ab?c`, `/ab+c` and similar route patterns in Express?
These are route matching patterns used to match specific or dynamic URL paths.
They help you support strict paths, optional parts, repeated chars, and custom formats.

## 36) What does `/abc` mean?
It is an exact route path match.
Matches only `/abc`; use case: fixed endpoints like `/health` or `/status`.

## 37) What does `/ab?c` mean?
`b` is optional in this pattern.
Matches `/ac` and `/abc`; use case: support old and new URL forms in one route.

## 38) What does `/ab+c` mean?
`b` must appear one or more times.
Matches `/abc`, `/abbc`, `/abbbbbc`; use case: pattern-based matching (less common in APIs).

## 39) What does `/ab*c` mean?
`*` allows flexible matching between `ab` and `c`.
Matches forms like `/abc` and `/abXYZc`; use case: legacy URL compatibility.

## 40) What does `/ab(cd)?e` mean?
`(cd)` is an optional grouped part.
Matches `/abe` and `/abcde`; use case: optional segment without writing two routes.

## 41) What does `/:id` mean?
This is a route parameter that captures dynamic values.
Example: `/users/42` gives `req.params.id = "42"`; use case: resource by ID.

## 42) What does `/:id(\\d+)` mean?
It is a route parameter with regex validation (digits only).
Matches `/123`, not `/abc`; use case: prevent invalid IDs at route level.

## 43) What is a regex route like `/^\\/a.*z$/`?
It matches paths using full regular expression rules.
Matches `/abcz` or `/a123z`; use case: advanced custom path rules.

## 44) Do query strings affect route path matching?
No, query strings are not part of path matching.
Example: `/users?id=1` still matches route `/users`.

## 45) What are important practical notes for route patterns?
Put specific routes first and wildcard/404 routes last because order matters.
In modern Express, prefer params and regex constraints over unclear string-pattern tricks.

"/.*fly$/"

dynamic id

Play with routes and route extensions ex. /hello, / , hello/2, /xyz
Order of the routes matter a lot
Install Postman app and make a workspace/collectio > test API call
Write logic to handle GET, POST, PATCH, DELETE API Calls and test them on Postman
Explore routing and use of ?, + , (), * in the routes
Use of regex in routes /a/ , / .* fly$/
Reading the query params in the routes
Reading the dynamic routes in the routes

## More Possible Knowledge (Important Next Topics)
- Express Router and modular route files.
- HTTP status code strategy for success and errors.
- Request validation using Joi or Zod.
- Authentication basics with JWT and bcrypt.
- MongoDB integration with Mongoose.
- Centralized error middleware and async wrapper pattern.
- Logging with Morgan or Winston.
- API security basics: rate limit, helmet, CORS whitelist.
- Environment config with dotenv for dev and production.
- Deployment basics and production scripts.

- Multiple Route Handlers - Play with the code
- next()
- next function and errors along with res.send()
- app.use("/route", rH, [rH2, rH3], rH4, rh5);
- What is a Middleware? Why do we need it?
- How express JS basically handles requests behind the scenes
- Difference app.use and app.all
- Write a dummy auth middleware for admin
- Write a dummy auth middleware for all user routes, except /user/login
- Error Handling using app.use("/", (err, req, res, next) = {});


- Create a free cluster on MongoDB official website (Mongo Atlas)
- Install mongoose library
- Connect your application to the Database "Connection-url"/devTinder
- Call the connectDB function and connect to database before starting application on 7777
Create a userSchema & user Model
- Create POST /sigup API to add data to database
- Push some documents using API calls from postman

- JS object vs JSON (difference)
- Add the express.json middleware to your app
- Make your signup API dynamic to recive data from the end user
- User.findOne with duplucate email ids, which object returned
- API- Get user by email
- API - Feed API - GET /feed - get all the users from the database
API - Get user by ID
- Create a delete user API
- Difference between PATCH and PUT
- API - Update a user
- Explore the Mongoose Documention for Model methods
- What are options in a Model.findOneAndUpdate method, explore more about it
- API - Update the user with email ID

Explore schematype options from the documention
add required, unique, lowercase, min, minLength, trim
Add default
Create a custom validate function for gender
Improve the DB schema - PUT all appropiate validations on each field in Schema
Add timestamps to the userSchema
Add API level validation on Patch request & Signup post api
DATA Sanitizing - Add API validation for each field
Install validator
Explore Use vlidator fun

---

## In-Depth Answers (From Line 199 Onward)

## 46) How should you practice route variations like `/hello`, `/`, `/hello/2`, `/xyz`?
Define each route clearly and keep a wildcard route for unknown paths.

```js
app.get('/', (req, res) => res.send('Home route'));
app.get('/hello', (req, res) => res.send('Hello route'));
app.get('/hello/2', (req, res) => res.send('Hello route v2'));

app.get('*', (req, res) => {
	res.status(404).json({ success: false, message: 'Route not found' });
});
```

Example testing:
- GET `/` -> 200
- GET `/hello` -> 200
- GET `/hello/2` -> 200
- GET `/xyz` -> 404

## 47) Why does route order matter in Express?
Express reads routes top to bottom and executes the first matching one.
If wildcard route comes too early, valid routes below it never run.

Bad:

```js
app.get('*', (req, res) => res.status(404).send('Not found'));
app.get('/hello', (req, res) => res.send('Hello')); // never reached
```

Good: place specific routes first, wildcard at end.

## 48) How to use Postman workspace and collection for API testing?
Create a workspace and a collection called `DevTinder APIs`.
Group requests by module.

Suggested folders:
- `Health`: GET `/`, GET `/hello`
- `Auth`: POST `/signup`, POST `/user/login`
- `Users`: GET `/user`, GET `/user/:id`, PATCH `/user/:id`, DELETE `/user/:id`
- `Feed`: GET `/feed`

Benefits:
- Reusable test requests
- Saved payloads and headers
- Faster debugging

## 49) How to handle GET, POST, PATCH, DELETE?

```js
app.get('/users', (req, res) => {
	res.status(200).json({ success: true, data: [] });
});

app.post('/users', (req, res) => {
	res.status(201).json({ success: true, data: req.body });
});

app.patch('/users/:id', (req, res) => {
	res.status(200).json({ success: true, id: req.params.id, updates: req.body });
});

app.delete('/users/:id', (req, res) => {
	res.status(200).json({ success: true, message: 'Deleted successfully' });
});
```

Postman tip: send JSON body in POST/PATCH and verify status code and response shape.

## 50) Route pattern symbols (`?`, `+`, `*`, `()`) with examples
- `/ab?c` -> `b` optional, matches `/ac` and `/abc`
- `/ab+c` -> one or more `b`, matches `/abc`, `/abbc`
- `/ab*c` -> any chars between `ab` and `c`, matches `/ac`, `/abXYZc`
- `/ab(cd)?e` -> optional group `cd`, matches `/abe`, `/abcde`

Use these for learning, but for production APIs prefer explicit params and clear route definitions.

## 51) Regex routes: `/a/` and `/.*fly$/`

```js
app.get(/a/, (req, res) => res.send('Matched path containing a'));
app.get(/.*fly$/, (req, res) => res.send('Matched path ending with fly'));
```

Examples:
- `/cat` matches `/a/`
- `/butterfly` matches `/.*fly$/`

## 52) Reading query params
Use `req.query` for URL query values.

```js
app.get('/search', (req, res) => {
	const { skill, city } = req.query;
	res.json({ success: true, filters: { skill, city } });
});
```

Request: `/search?skill=node&city=delhi`

## 53) Reading dynamic params
Use `req.params` for path variables.

```js
app.get('/user/:id', (req, res) => {
	res.json({ success: true, userId: req.params.id });
});
```

For `/user/42`, `req.params.id` is `"42"`.

## 54) Multiple route handlers
You can chain multiple middleware/handlers for one route.

```js
const log = (req, res, next) => { console.log(req.method, req.url); next(); };
const check = (req, res, next) => {
	if (req.query.ok !== '1') return res.status(400).send('Invalid request');
	next();
};

app.get('/multi', log, check, (req, res) => {
	res.send('All checks passed');
});
```

## 55) What is `next()`?
`next()` moves request to next middleware in sequence.
If you neither send response nor call `next()`, request hangs.

## 56) `next()` with `res.send()` mistakes
Do not send response and then call `next()` to another handler that also sends response.
That causes headers already sent error.

Safe rule:
- Either respond once
- Or call `next(err)` for error middleware

## 57) `app.use('/route', rH, [rH2, rH3], rH4)` behavior
Express runs handlers in declared order.

```js
app.use('/route', h1, [h2, h3], h4);
```

For `/route/*`: execution order is `h1 -> h2 -> h3 -> h4`.

## 58) What is middleware and why needed?
Middleware is reusable request-processing logic before final response.
Examples:
- Logging
- Authentication
- Input validation
- JSON parsing (`express.json()`)

## 59) How Express handles requests internally (simplified)
1. Request enters app.
2. Express scans middleware/route stack in order.
3. Matching handlers run.
4. Response sent, or error middleware handles failures.

## 60) Difference between `app.use` and `app.all`
- `app.use(path, middleware)`: for middleware on path prefix, all methods.
- `app.all(path, handler)`: route handler for all HTTP methods on that path.

```js
app.use('/api', authMiddleware);
app.all('/ping', (req, res) => res.send('pong'));
```

## 61) Dummy admin auth middleware

```js
const adminAuth = (req, res, next) => {
	const token = req.headers['x-admin-token'];
	if (token !== 'secret-admin') {
		return res.status(401).json({ success: false, message: 'Admin unauthorized' });
	}
	next();
};

app.get('/admin/dashboard', adminAuth, (req, res) => {
	res.json({ success: true, data: 'Admin dashboard' });
});
```

## 62) Protect all `/user` routes except `/user/login`

```js
const userAuth = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).json({ success: false, message: 'Unauthorized' });
	}
	next();
};

app.post('/user/login', (req, res) => {
	res.json({ success: true, token: 'dummy-token' });
});

app.use('/user', (req, res, next) => {
	if (req.path === '/login') return next();
	return userAuth(req, res, next);
});

app.get('/user/profile', (req, res) => {
	res.json({ success: true, data: 'Profile data' });
});
```

## 63) Centralized error handling in Express

```js
app.get('/boom', (req, res, next) => {
	try {
		throw new Error('Something went wrong');
	} catch (err) {
		next(err);
	}
});

app.use((err, req, res, next) => {
	console.error(err.message);
	res.status(500).json({ success: false, message: 'Internal Server Error' });
});
```

## 64) MongoDB Atlas setup and connection flow
1. Create free Atlas cluster.
2. Create DB user and password.
3. Allow your IP in Network Access.
4. Copy connection string.
5. Put URL in `.env`.

Example URI:
`mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/devTinder`

## 65) Install and configure Mongoose
Install:
`npm install mongoose`

Connection utility:

```js
const mongoose = require('mongoose');

const connectDB = async () => {
	await mongoose.connect(process.env.MONGO_URI);
	console.log('MongoDB connected');
};

module.exports = connectDB;
```

## 66) Connect DB before starting server

```js
connectDB()
	.then(() => {
		app.listen(7777, () => console.log('Server running on port 7777'));
	})
	.catch((err) => {
		console.error('DB connection failed', err);
	});
```

Reason: if DB fails, app should not start partially.

## 67) User schema/model with validation

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true, trim: true },
		lastName: { type: String, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true, minLength: 6 },
		age: { type: Number, min: 18 },
		gender: {
			type: String,
			validate(value) {
				if (!['male', 'female', 'other'].includes(value)) {
					throw new Error('Invalid gender');
				}
			},
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
```

## 68) Dynamic `POST /signup`

```js
app.post('/signup', async (req, res) => {
	try {
		const user = new User(req.body);
		const saved = await user.save();
		res.status(201).json({ success: true, data: saved });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
});
```

Test in Postman with multiple user bodies to insert documents.

## 69) JS object vs JSON
- JS Object: JavaScript structure used in runtime.
- JSON: text format for data exchange.

```js
const obj = { name: 'Ravi', age: 22 };
const json = JSON.stringify(obj);
const parsed = JSON.parse(json);
```

## 70) Why `express.json()` is required

```js
app.use(express.json());
```

Without this middleware, JSON request body will not be parsed into `req.body`.

## 71) `User.findOne` with duplicate emails
`findOne({ email })` returns first matched document. If duplicates exist, result is unpredictable from business perspective.
Prevent this by:
- `unique: true` on email
- avoiding duplicate writes

## 72) API: get user by email

```js
app.get('/user', async (req, res) => {
	const user = await User.findOne({ email: req.query.email });
	if (!user) return res.status(404).json({ success: false, message: 'User not found' });
	res.json({ success: true, data: user });
});
```

## 73) API: feed (`GET /feed`)

```js
app.get('/feed', async (req, res) => {
	const users = await User.find({});
	res.json({ success: true, count: users.length, data: users });
});
```

## 74) API: get user by ID

```js
app.get('/user/:id', async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).json({ success: false, message: 'User not found' });
	res.json({ success: true, data: user });
});
```

## 75) API: delete user

```js
app.delete('/user/:id', async (req, res) => {
	const deleted = await User.findByIdAndDelete(req.params.id);
	if (!deleted) return res.status(404).json({ success: false, message: 'User not found' });
	res.json({ success: true, message: 'User deleted' });
});
```

## 76) PATCH vs PUT
- PUT: full replacement (or full intended update)
- PATCH: partial update

Use PATCH when only changing selected fields like `age`.

## 77) API: update user with allowed fields

```js
app.patch('/user/:id', async (req, res) => {
	const allowed = ['firstName', 'lastName', 'age', 'gender'];
	const incomingKeys = Object.keys(req.body);
	const isValid = incomingKeys.every((k) => allowed.includes(k));
	if (!isValid) return res.status(400).json({ success: false, message: 'Invalid fields' });

	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) return res.status(404).json({ success: false, message: 'User not found' });
	res.json({ success: true, data: user });
});
```

## 78) `findOneAndUpdate` options you should know
- `new: true` -> return updated document
- `runValidators: true` -> enforce schema validators on update
- `upsert: true` -> create doc if not found

Example:

```js
await User.findOneAndUpdate({ email }, updates, { new: true, runValidators: true });
```

## 79) API: update by email

```js
app.patch('/user', async (req, res) => {
	const { email, ...updates } = req.body;

	const user = await User.findOneAndUpdate({ email }, updates, {
		new: true,
		runValidators: true,
	});

	if (!user) return res.status(404).json({ success: false, message: 'User not found' });
	res.json({ success: true, data: user });
});
```

## 80) Important schema options and why they matter
- `required`: avoids missing critical data
- `unique`: prevents duplicate values like email
- `lowercase`: normalizes case-sensitive text
- `trim`: removes accidental spaces
- `min`, `minLength`: ensures valid value ranges
- `default`: fallback when value not provided
- `validate`: custom rule enforcement
- `timestamps`: auto track created/updated times

## 81) API-level validation + sanitization + validator package
Install package:
`npm install validator`

Example:

```js
const validator = require('validator');

app.post('/signup', async (req, res) => {
	const { firstName, email, password } = req.body;

	if (!firstName || !email || !password) {
		return res.status(400).json({ success: false, message: 'Missing required fields' });
	}
	if (!validator.isEmail(email)) {
		return res.status(400).json({ success: false, message: 'Invalid email format' });
	}
	if (!validator.isStrongPassword(password, { minLength: 6, minUppercase: 0, minSymbols: 0 })) {
		return res.status(400).json({ success: false, message: 'Weak password' });
	}

	const user = await User.create({
		firstName: firstName.trim(),
		email: email.toLowerCase().trim(),
		password,
	});

	res.status(201).json({ success: true, data: user });
});
```

Best practice: combine API-level validation with Mongoose schema validation for strong data integrity.


- Validate data in Signup API
- Install bcrypt package
- Create PasswordHash using bcrypt.hash & save the user is excrupted password
- Create login API
- Compare passwords and throw errors if email or password is invalid

- install cookie-parse
- just send a dummy cookie to user
- create GET /profile APi and check if you get the cookie back
- install jsonwebtoken
- IN login API, after email and password validation, create e JWT token and send it to user in coo
- read the cookies inside your profile API and find the logged in user

install cookie-parser
just send a dummy cookie to user
create GET /profile APi and check if you get the cookie back
install jsonwebtoken
IN login API, after email and password validation, create e JWT token and send it to user in cookies
read the cookies inside your profile API and find the logged in user
userAuth Middleware
Add the userAuth middle ware in profile API and a new sendConnectionRequest API
Set the expiry of JWT token and cookies to 7 days
Create userSchema method to getJWT()
Create UserSchema method to comparepassword(passwordInputByUser)


Explore tinder APIs
Create a list all API you can think of in Dev Tinder
Group multiple routes under repective routers
Read documentation for express.Router
Create routes folder for managing auth, profile, request routers
create authRouter, profileRouter, requestRouter
Import these routers in app.js
Create POST /logout API
Create PATCH /profile/edit
Create PATCH /profile/password API = forgot password API
Make you validate all data in every POST, PATCH apis


- Create Connnection Request Schema
- Send Connection Request API
- Proper validation of Data
- Think about ALL corner cases
- $or query $and query in mongoose - https://www.mongodb.com/docs/manual/reference/operator/
query-logical/
- schema.pre("save") function
- Read more about indexes in MongoDB
- Why do we need index in DB?
- What is the advantages and disadvantage of creating?
- Read this arcticle about compond indexes - https://www.mongodb.com/docs/manual/core/indexes/
index-types/index-compound/
- ALWAYS THINK ABOUT CORNER CASES

- Write code with proper validations for POST /request/review/:status/:requestId





Create Connnection Request Schema
Send Connection Request API
Proper validation of Data
Think about ALL corner cases
$or query $and query in mongoose - https://www.mongodb.com/docs/manual/reference/op
uery-logical/
Read more about indexes in MongoDB
Why do we need index in DB?
What is the advantages and disadvantage of creating?
Read this arcticle about compond indexes - https://www.mongodb.com/docs/manual/c(
ndex-types/index-compound/

You, 14 seconds ago . Uncommitted changes