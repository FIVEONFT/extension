import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';

export const palette = {
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
    },
    mainGreen: '#1e635e',
    lightGreen: '#3c9f7f',
    darkGreen: '#0f4721',
    lightGrayGreen: '#b9d7d0',
    darkGreenYellow: '#6c9f6c',
    comet: '#6E7698',
    white: '#E8EFFF'
};

const theme = createTheme({
    palette,
    typography: {
        fontFamily: '"Nunito Sans", sans-serif',
        htmlFontSize: 12,
        overline: {
            fontSize: 12,
            lineHeight: 1.2
        },
        h6: {
            fontSize: 18,
            fontWeight: 'bold',
            letterSpacing: '0.05em'
        }
    },
    components: {
        MuiBottomNavigation: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0,0,0,.42)',
                    height: 72
                }
            }
        },

        MuiAlert: {
            styleOverrides: {
                root: {
                    border: '1px solid rgba(255,255,255,.3)',
                    backgroundColor: 'rgba(0,0,0,.25)',

                    '& .MuiSvgIcon-root': {
                        fontSize: 18,
                        color: 'white'
                    }
                },
                icon: {
                    display: 'none'
                },
                message: {
                    fontSize: 12,
                    color: 'white'
                }
            }
        },

        MuiBottomNavigationAction: {
            styleOverrides: {
                root: {
                    '& .MuiSvgIcon-root': {
                        fontSize: 24,
                        margin: 8
                    }
                },
                label: {
                    fontSize: 10
                }
            }
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: 14
                }
            }
        },

        MuiInput: {
            styleOverrides: {
                input: {
                    fontSize: 14,
                    height: 28
                }
            }
        },

        MuiButton: {
            styleOverrides: {
                outlined: {
                    textTransform: 'none'
                },
                contained: {
                    borderRadius: 0
                },
                containedPrimary: {
                    padding: '8px 14px',
                    borderRadius: 0,
                    fontFamily: 'Kanit',
                    fontWeight: 600,
                    fontSize: 16,
                    fontStyle: 'italic',
                    backgroundColor: 'rgba(255,255,255,.95)',
                    color: 'rgba(0,0,0,.7)',
                    letterSpacing: '0.05em',
                    // fontWeight: 400,
                    transform: 'skewX(-10deg)',

                    '& > *:not(.MuiTouchRipple-root)': {
                        transform: 'skewX(10deg)'
                    },

                    '& .MuiButton-startIcon': {
                        filter: `grayscale(1)`
                    },

                    '&:hover:not(.Mui-disabled)': {
                        color: 'rgba(0,0,0,.8)',
                        backgroundColor: 'rgba(255,255,255,.65)'
                    }
                }
            }
        }
    }
});

export default theme;