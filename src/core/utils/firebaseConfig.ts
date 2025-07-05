export function getFirbaseConfig() {
  // In development mode, don't use Firebase unless we have a valid project
  if (process.env.NODE_ENV === 'development') {
    // Only use Firebase in development if we have a working project
    // For hackathon/demo purposes, disable Firebase to avoid errors
    return null;
  }

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

  return firebaseConfig;
}

export function getFirbaseFunctionUrl() {
  return process.env.FB_FUNCTIONS;
}
