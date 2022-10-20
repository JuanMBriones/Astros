import React, { useEffect } from 'react';
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';

/**
 * @return {Component}
 */
export default function Login() {
  const [loginData, setLoginData] = React.useState(null);

  useEffect(() => {
    if (localStorage.getItem('loginData')) {
      setLoginData(JSON.parse(localStorage.getItem('loginData')));
    }
  }, []);

  return (
    <>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      >
        <GoogleLogin
          onSuccess={async (credentialResponse) =>{
            console.log(credentialResponse);

            const res = await fetch('http://localhost:3001/api/login', {
              method: 'POST',
              body: JSON.stringify({
                token: credentialResponse.credential,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            });

            const data = await res.json();
            setLoginData(data);
            localStorage.setItem('loginData', JSON.stringify(data));
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
