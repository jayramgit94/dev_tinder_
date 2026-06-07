require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");

const run = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("FAIL: MONGO_URI is not set.");
    console.error("Copy tinder_backend/.env.example to tinder_backend/.env and set your Atlas URI.");
    process.exit(1);
  }

  const masked = mongoUri.replace(/:([^@/]+)@/, ":****@");
  console.log("Testing connection to:", masked);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    const dbName = mongoose.connection.db.databaseName;
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("SUCCESS: Connected to MongoDB");
    console.log("Database:", dbName);
    console.log("Collections:", collections.length ? collections.map((c) => c.name).join(", ") : "(empty — run npm run seed)");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("FAIL:", err.message);
    console.error("\nCommon fixes:");
    console.error("- Check username/password in MONGO_URI (URL-encode special characters)");
    console.error("- Atlas → Network Access → allow 0.0.0.0/0 for Vercel/Render");
    console.error("- Confirm cluster is running and database name is in the URI");
    process.exit(1);
  }
};

run();
