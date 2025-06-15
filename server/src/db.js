import mongoose from "mongoose";

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
      w: "majority",
    });
    console.log("🍃 MongoDB server connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit if we can't connect to the database
  }
}

export { connectToDatabase };
