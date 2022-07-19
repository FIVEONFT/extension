import { Box, Typography, Button, Fade, Card } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import MessageController from '../../controllers/MessageController.js';

function WebsiteWarning({ id, website, notes }) {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleCloseAndIgnore = useCallback(async () => {
        setOpen(false);
        await MessageController.sendRuntimeMessage({
            message: 'IGNORE_WEBSITE',
            data: {
                id
            }
        });
    }, [id]);

    return <Fade
        in={open}>
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 1,
                height: 1,
                zIndex: 2147483648,
                backgroundColor: 'secondary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: 'center'
                }}>
                <Typography
                    variant="h4">
                    FIVE-O
                </Typography>
                <Typography
                    sx={{
                        mt: 1
                    }}
                    variant="h5">
                    This website has been reported as potentially harmful.
                </Typography>
                {!!notes &&
                <Card
                    variant="outlined"
                    sx={{
                        mt: 2,
                        width: {
                            xs: 1,
                            sm: 520
                        },
                        maxWidth: '100%',
                        backgroundColor: 'secondary.dark',
                        textAlign: 'left',
                        p: 2
                    }}>
                    <Typography
                        variant="body2">
                        {notes}
                    </Typography>
                </Card>}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: {
                            xs: 'column',
                            md: 'row'
                        },
                        mt: 3
                    }}>
                    <Button
                        sx={{
                            width: {
                                xs: 1,
                                md: 'auto'
                            }
                        }}
                        onClick={handleClose}
                        size="large"
                        variant="outlined">
                        Proceed; I know what I&apos;m doing.
                    </Button>
                    <Button
                        onClick={handleCloseAndIgnore}
                        sx={{
                            ml: {
                                xs: 0,
                                md: 3
                            },
                            mt: {
                                xs: 3,
                                md: 0
                            },
                            width: {
                                xs: 1,
                                md: 'auto'
                            }
                        }}
                        size="large"
                        variant="outlined">
                        Close and ignore warnings for this site.
                    </Button>
                </Box>
            </Box>
        </Box>
    </Fade>;
}

export default WebsiteWarning;