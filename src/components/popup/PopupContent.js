import { Box, Typography, Button, darken, TextField, Alert } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import MessageController from '../../controllers/MessageController.js';
import { palette } from '../../theme/theme.js';
import config from '../../config/config.js';
import BottomNav from './BottomNav.js';

function PopupContent() {

    const [isWorking, setIsWorking] = useState(false);
    const [data, setData] = useState({ data: {}, isLoaded: false });
    const [formData, setFormData] = useState({
        url: '',
        notes: ''
    });
    const [message, setMessage] = useState('');

    const getData = useCallback(async () => {
        const popupData = await MessageController.sendRuntimeMessage({
            message: 'GET_POPUP_DATA'
        });
        setData(val => ({ ...val, data: { ...popupData }, isLoaded: true }));
    }, []);

    useEffect(() => {
        if (data.isLoaded) return;
        getData();
    }, [getData, data]);

    const onFormDataChange = useCallback((name, e) => {
        setFormData(val => ({ ...val, [name]: e.target.value }));
    }, []);

    useEffect(() => {
        const currentURL = data?.data?.currentTab?.url || '';
        onFormDataChange('url', { target: { value: currentURL } });
    }, [data, onFormDataChange]);

    const submitForm = useCallback(async e => {
        e.preventDefault();
        setIsWorking(true);
        const submitFormResult = await MessageController.sendRuntimeMessage({
            message: 'SUBMIT_REPORT',
            data: {
                url: formData.url,
                notes: formData.notes
            }
        });
        setMessage(submitFormResult?.message);
        setIsWorking(false);
    }, [formData]);

    const clearMessage = () => {
        setMessage('');
    };

    const isLoggedIn = !!data?.data?.user?.id;

    return <Box
        sx={{
            width: 300,
            height: 'auto',
            background: `${darken(palette.comet, .4)} linear-gradient(to top, ${darken(palette.comet, .4)}, ${darken(palette.comet, .1)})`
        }}>
        {!isLoggedIn ?
            <Box
                sx={{
                    p: 3,
                    fontSize: 14,

                    '& a': {
                        color: 'white'
                    }
                }}>
                <Box
                    sx={{
                        fontSize: 20,
                        textAlign: 'center',
                        mb: 2
                    }}>
                    Welcome to FIVE-O
                </Box>
                <Box
                    sx={{
                        mb: 1
                    }}>
                    This extension blocks potentially harmful websites that are reported by our community.
                </Box>
                <Box
                    sx={{
                        mb: 1
                    }}>
                    As a <b>non-holder</b>, you are missing out on the premium features offered by this extension.
                </Box>
                <Box>
                    Visit <a target="_blank" href="https://five-o.app">our website</a> to learn more.
                </Box>
            </Box> :
            <>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(to top, rgba(255,255,255,0), #${data?.data?.user?.accent_color?.toString(16)})`,
                        p: 3
                    }}>
                    <Box
                        sx={{
                            flex: '0 0 120px',
                            height: 120,
                            objectFit: 'cover',
                            objectPosition: 'center',
                            borderRadius: '50%'
                        }}
                        component="img"
                        alt={`${data?.data?.user?.username}'s avatar`}
                        src={`https://cdn.discordapp.com/avatars/${data?.data?.user?.id}/${data?.data?.user?.avatar}.png`}/>
                </Box>
                <Box
                    sx={{
                        px: 3,
                        textAlign: 'center'
                    }}>
                    <Typography
                        component="div"
                        variant="overline">
                        {config.roleToName[data?.data?.roleId] ?? 'Constable'}
                    </Typography>
                    <Typography
                        component="div"
                        variant="h6">
                        {data?.data?.user?.username}#{data?.data?.user?.discriminator}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        px: 3,
                        pt: 3
                    }}>
                    {!!message ?
                        <Box>
                            <Alert
                                onClose={clearMessage}>
                                {message}
                            </Alert>
                        </Box> :
                        <Box
                            onSubmit={submitForm}
                            component="form">
                            <TextField
                                sx={{
                                    mb: 1
                                }}
                                fullWidth
                                variant="standard"
                                size="small"
                                disabled={isWorking}
                                value={formData.url}
                                onChange={e => onFormDataChange('url', e)}
                                label="URL"/>
                            <TextField
                                sx={{
                                    mb: 2
                                }}
                                fullWidth
                                variant="standard"
                                size="small"
                                disabled={isWorking}
                                value={formData.notes}
                                onChange={e => onFormDataChange('notes', e)}
                                label="Notes"/>
                            <Button
                                fullWidth
                                disabled={isWorking}
                                type="submit"
                                color="primary"
                                variant="contained">
                                Submit Report
                            </Button>
                        </Box>}
                </Box>
            </>}
        <BottomNav/>
    </Box>;
}

export default PopupContent;