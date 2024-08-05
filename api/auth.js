// api/auth.js
import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'https://finance-insight-psi.vercel.app/api/auth/callback');

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    const { tokens } = await client.getToken(code);
    // Process tokens and store user session here
    // Example: Save tokens in a cookie or database, then redirect to frontend app
    // await saveTokens(tokens);
    return NextResponse.redirect('/dashboard'); // Adjust to match your app's routing
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
