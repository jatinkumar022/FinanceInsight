// api/auth.js

import { NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function GET(request) {
  // Handle the Google login callback
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code'); // Or however you need to handle the response

    // Handle the response, e.g., exchange code for tokens, etc.

    return NextResponse.redirect('/dashboard'); // Redirect to a different page after successful login
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.redirect('/error'); // Redirect to an error page if something goes wrong
  }
}
