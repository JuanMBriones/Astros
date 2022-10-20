import React, {useEffect} from 'react';
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import {useRouter} from 'next/router';

/**
 * @return {Component}
 */
export default function Login() {
  // eslint-disable-next-line no-unused-vars
  const [loginData, setLoginData] = React.useState(null);
  const router = useRouter();

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
          hosted_domain={
            [
              'tec.mx',
              'itesm.mx',
            ]
          }
          onSuccess={async (credentialResponse) =>{
            console.log(credentialResponse);

            // eslint-disable-next-line max-len
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
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

            router.push('/');
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
