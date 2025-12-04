import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0066cc', // Azul extraído de tu EventCard.css
      light: '#4d94db',
      dark: '#00478f',
      contrastText: '#fff',
    },
    secondary: {
      main: '#007bff', // Azul brillante de tu Login.css para acciones secundarias
    },
    background: {
      default: '#f0f2f5', // Gris suave de tu Login.css
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#1f2937', // Tono oscuro de tus títulos en Profile.css
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bordes redondeados modernos
          textTransform: 'none', // Texto normal (no todo mayúsculas)
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;