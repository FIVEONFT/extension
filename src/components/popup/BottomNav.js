import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person.js';
import LanguageIcon from '@mui/icons-material/Language.js';
import FavouriteIcon from '@mui/icons-material/Favorite.js';
import React from 'react';
import config from '../../config/config.js';
import MessageController from '../../controllers/MessageController.js';

const isDev = process.env.NODE_ENV === 'development';

function BottomNav() {

    const onDevReset = async (e) => {
        e.preventDefault();
        await MessageController.sendRuntimeMessage({
            message: 'DEV_RESET'
        });
    };

    const onDevGetSafeSites = async (e) => {
        e.preventDefault();
        await MessageController.sendRuntimeMessage({
            message: 'DEV_GET_SAFE_SITES'
        });
    };

    const onDevViewStorage = async (e) => {
        e.preventDefault();
        await MessageController.sendRuntimeMessage({
            message: 'DEV_VIEW_STORAGE'
        });
    };

    return <>
        {!!isDev && <Box
            sx={{
                display: 'flex',
                px: 2,
                mt: 3,

                '& a': {
                    fontSize: 12,
                    color: 'white',
                    mx: 1
                }
            }}>
            <a
                href="#!"
                onClick={onDevGetSafeSites}>
                get safe sites
            </a>
            <a
                href="#!"
                onClick={onDevReset}>
                reset all
            </a>
            <a
                href="#!"
                onClick={onDevViewStorage}>
                view storage
            </a>
        </Box>}
        <BottomNavigation
            sx={{
                mt: 3
            }}
            showLabels>
            <BottomNavigationAction
                target="_blank"
                href={config.urls.verifyHolder}
                label="Holder Status"
                icon={<PersonIcon/>}/>
            <BottomNavigationAction
                target="_blank"
                href="https://five-o.app"
                label="Website"
                icon={<LanguageIcon/>}/>
            <BottomNavigationAction
                target="_blank"
                href={config.extUrl}
                label="Rate Us"
                icon={<FavouriteIcon/>}/>
        </BottomNavigation>
    </>;
}

export default BottomNav;