import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#01aa00',
      light: '#58f958',
      dark: '#004600',
    },
    secondary: {
      main: '#b900f5',
    },
  },
});

export default defaultTheme;