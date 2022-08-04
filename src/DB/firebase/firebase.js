import admin from 'firebase-admin';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const serviceAccount = require("./entrega-backend-coder-firebase-adminsdk-hqwgj-dbc994fb21.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

console.log("Base de datos conectada");

export const dbFirebase = admin.firestore();