import { Paper, Typography } from '@mui/material';
import { useRef } from 'react';
import './NodeRed.css';
const NodeRed = () => {
    const env = process.env.REACT_APP_NODERED_ENV;
    const iframeRef = useRef<HTMLIFrameElement>(null);

    return (
        <>
            {env ? (
                <iframe className='iframeClass' src='http://127.0.0.1:1880/' />
            ) : (
                <Paper sx={{ margin: '2rem', padding: '1rem' }}>
                    <Typography variant='h4'>
                        Currently Node Red is running in my local enviroment so not
                        avialable in production
                    </Typography>
                </Paper>
            )}
        </>
    );
};

export default NodeRed;
