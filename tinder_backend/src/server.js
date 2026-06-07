require("dotenv").config();

const createApp = require("./createApp");

const port = process.env.PORT || 3000;
const app = createApp();

app.listen(port, () => {
  console.log(`DevTinder API running on http://localhost:${port}`);
});
