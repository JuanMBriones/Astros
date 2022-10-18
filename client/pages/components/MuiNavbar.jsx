import React from 'react';
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

import {useState} from 'react';

/**
 * @name MuiNavbar
 * @return {React.Component}
 */
export default function MuiNavbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          Pokemon
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
            aria-control={open ? 'resources-menu' : undefined }
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Profesores
          </Button>
          <Button
            color='inherit'
          >
            <Link
              href='/login'
              underline='none'
              color='inherit'
            >
              Login
            </Link>
          </Button>
        </Stack>
        <Menu
          id='resources-menu'
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
            Horario
          </MenuItem>
          <MenuItem
            onClick={handleClose}
          >
            Clases
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
