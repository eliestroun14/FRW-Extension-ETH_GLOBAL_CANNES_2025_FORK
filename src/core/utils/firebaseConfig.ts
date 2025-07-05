export function getFirbaseConfig() {
  const firebaseConfig = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    databaseURL: process.env.FB_DATABASE_URL,
    projectId: process.env.FB_PROJECTID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID,
    measurementId: process.env.FB_MEASUREMENT_ID,
  };

  // Check if all required Firebase config values are present
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const hasValidConfig = requiredFields.every(field =>
    firebaseConfig[field as keyof typeof firebaseConfig] &&
    firebaseConfig[field as keyof typeof firebaseConfig] !== 'undefined' &&
    firebaseConfig[field as keyof typeof firebaseConfig] !== ''
  );

  if (!hasValidConfig) {
    console.log('Firebase config incomplete, skipping Firebase setup');
    return null;
  }

  return firebaseConfig;
}

export function getFirbaseFunctionUrl() {
  return process.env.FB_FUNCTIONS;
}
