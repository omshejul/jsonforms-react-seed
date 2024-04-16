import { Grid, Paper, Typography } from "@mui/material";
import './styles.css';
const NodeRed = () => {
    const env = process.env.REACT_APP_NODERED_ENV;

    return (
        <>
            {env ? (
                <iframe className="iframeClass" src='http://127.0.0.1:1880/' />
            ) : (
                <Paper sx={{ margin: "2rem", padding: "1rem" }} >
                    <Typography variant="h4">
                        Node Red is currently only running in my local machine so not
                        avialable in production
                    </Typography>
                </Paper>
            )}
        </>
    );
};

export default NodeRed;
