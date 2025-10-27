import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFunctions, connectFunctionsEmulator, Functions } from 'firebase/functions'

let app: FirebaseApp | null = null
let functions: Functions | null = null

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }
  }
  return app
}

export const getFirebaseFunctions = (): Functions => {
  if (!functions) {
    const app = getFirebaseApp()
    functions = getFunctions(app, process.env.NEXT_PUBLIC_FUNCTIONS_REGION || 'us-central1')
    
    // Connect to emulator in development
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      try {
        connectFunctionsEmulator(functions, 'localhost', 5001)
      } catch (error) {
        // Emulator already connected or not available
        console.log('Functions emulator not available')
      }
    }
  }
  return functions
}
