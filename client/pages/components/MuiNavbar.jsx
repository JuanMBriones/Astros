import React, {useState, useEffect} from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
  Menu,
  MenuItem,
  Link,
} from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useRouter} from 'next/router';

/**
 * @name MuiNavbar
 * @return {React.Component}
 */
export default function MuiNavbar() {
  const [userData, setUserData] = useState(undefined);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (localStorage.getItem('loginData')) {
      setUserData(localStorage.getItem('loginData'));
    }
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('loginData');
    setUserData(undefined);

    router.push('/');
  };

  return (
    <AppBar
      position="static"
    >
      <Toolbar>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='logo'
        >
          <CatchingPokemonIcon />
        </IconButton>
        <Typography
          variant='h6'
          component='div'
          sx={{flexGrow: 1}}
        >
          Sistema de Inscripciones+
        </Typography>
        <Stack
          direction='row'
          spacing={2}
        >
          <Button
            color='inherit'
          >
            <Link
              href='/'
              underline='none'
              color='inherit'
            >
              Home
            </Link>
          </Button>
          <Button
            color='inherit'
          >
            <Link
              href='/uploadfile'
              underline='none'
              color='inherit'
            >
              Upload CSV
            </Link>
          </Button>
          <Button
            color='inherit'
            id='resources-button'
            onClick={handleClick}
            aria-control={open ? 'resources-profesores' : undefined }
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Profesores
          </Button>
          <Button
            color='inherit'
            id='resources-button'
            onClick={handleClick}
            aria-control={open ? 'resources-clases' : undefined }
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Clases
          </Button>
          <Button
            color='inherit'
          >
            {
              userData === undefined ?
                (
                  <Link
                    href='/login'
                    underline='none'
                    color='inherit'
                  >
                    Login
                  </Link>
                ) :
                (
                  <Button
                    color='inherit'
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                )
            }
          </Button>
        </Stack>
        <Menu
          id='resources-profesores'
          anchorEl={anchorEl}
          open={open}
          MenuListProps={{
            'aria-labelledby': 'resourced-button',
          }}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={handleClose}
          >
            <Link
              href='/views/Horario'
              underline='none'
              color='inherit'
            >
              Horario
            </Link>

          </MenuItem>
          <MenuItem
            onClick={handleClose}
          >
            Clases
          </MenuItem>
        </Menu>
        <Menu
          id='resources-clases'
          anchorEl={anchorEl}
          open={open}
          MenuListProps={{
            'aria-labelledby': 'resourced-button',
          }}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={handleClose}
          >
            <Link
              href='/views/ClasesProfesor'
              underline='none'
              color='inherit'
            >
              Asignar Profesores
            </Link>

          </MenuItem>
          <MenuItem
            onClick={handleClose}
          >
            Agregar clase
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
