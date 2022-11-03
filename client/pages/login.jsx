import React, {useEffect} from 'react';
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import {useRouter} from 'next/router';
import {Typography, Box} from '@mui/material';

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
      <Box sx={{
        maxWidth: '30rem',
        margin: 'auto',
        padding: '1rem',
        contentAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: '0.5rem',
        width: '500px',
        height: '200px',
        marginTop: '150px',
      }}>
        <Typography variant='h4' component='h1' sx={{mb: '2rem'}}>
        Login
        </Typography>
        <Box
          component='form'
          noValidate
          autoComplete='off'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            contentAlign: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant='body1'
            component='p'
            sx={{mb: '1rem'}}
          >
            Login using 🔒
          </Typography>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          >
            <GoogleLogin
              hosted_domain={'tec.mx'}
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
        </Box>
      </Box>
    </>
  );
}
