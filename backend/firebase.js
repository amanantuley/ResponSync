const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

// Attempt to initialize Firebase Admin with service account if available
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized with service account.");
  } else {
    // If no service account path provided, just log a warning.
    console.warn("FIREBASE_SERVICE_ACCOUNT_PATH not provided. Firebase features will fail.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

const db = admin.apps.length ? admin.firestore() : null;

module.exports = { admin, db };
