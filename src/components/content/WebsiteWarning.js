import { Box, Typography, Button, Fade, Card } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import MessageController from '../../controllers/MessageController.js';

function WebsiteWarning({ id, origin, website, notes }) {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(true);
    }, []);

    const handleClose = useCallback(async () => {
        // setOpen(false);
        await MessageController.sendRuntimeMessage({
            message: 'IGNORE_WEBSITE_ONCE',
            data: {
                id
            }
        });
        window.location.href = origin;
    }, []);

    const handleCloseAndIgnore = useCallback(async () => {
        // setOpen(false);
        await MessageController.sendRuntimeMessage({
            message: 'IGNORE_WEBSITE',
            data: {
                id
            }
        });
        window.location.href = origin;
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
                <Box
                    sx={{
                        width: 250,
                        height: 'auto'
                    }}
                    component="img"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAB6CAYAAABJG6GWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ4NjBBNThFMURDQjExRURBRUI0RTVCM0I1NjEyODkyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ4NjBBNThGMURDQjExRURBRUI0RTVCM0I1NjEyODkyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDg2MEE1OEMxRENCMTFFREFFQjRFNUIzQjU2MTI4OTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDg2MEE1OEQxRENCMTFFREFFQjRFNUIzQjU2MTI4OTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6qdGUqAAAc+UlEQVR42uxdCZRW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"/>
                <Typography
                    sx={{
                        mt: 2
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
                            backgroundColor: 'secondary.commet',
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