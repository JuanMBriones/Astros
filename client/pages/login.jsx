import React from 'react';
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';

/**
 * @return {Component}
 */
export default function Login() {
  return (
    <>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      >
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
          useOneTap
        />
      </GoogleOAuthProvider>
    </>
  );
}
