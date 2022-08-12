import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            light: red[50],
            dark: red[100],
            main: red[50],
            contrastText: red[50]
        },
        secondary: {
            light: red[600],
            dark: red[900],
            main: red[800],
            contrastText: red[800]
        }
    },
    typography: {
        htmlFontSize: 12
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlined: {
                    textTransform: 'none'
                }
            }
        }
    }
});

export default theme;