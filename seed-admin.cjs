const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

// ---- Admin Credentials ----
const ADMIN_EMAIL = "admin@nestchat.com";
const ADMIN_PASSWORD = "Admin@123456";
const ADMIN_NAME = "Super Admin";
// ----------------------------

const MONGO_URI = "mongodb://185.201.9.148:27017"; // Change if your MongoDB URI is different
const DB_NAME = "nestchat"; // Change to your actual DB name

async function seedAdmin() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);
    const adminsCollection = db.collection("admins");

    const existing = await adminsCollection.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("Admin already exists with this email:", ADMIN_EMAIL);
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await adminsCollection.insertOne({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "superadmin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("\n✅ Admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:    ", ADMIN_EMAIL);
    console.log("🔑 Password: ", ADMIN_PASSWORD);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.close();
  }
}

seedAdmin();
