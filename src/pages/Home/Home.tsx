import React from 'react'
import Modal from '../../Components/Modal/Modal'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
const Home = () => {

    return (
        <div>
            <Modal>

                <h1>Some Title HERE</h1>
                <Box>

                <Button sx={{m:1}}component={Link} to="/dialogue-manager-v2" variant="contained" color="primary">
                    Dialogue Manager
                </Button>
                <Button sx={{m:1}}component={Link} to="/dialogue-manager" variant="contained" color="primary">
                    Workflow
                </Button>
                </Box>
 
            </Modal>
        </div>
    )
}

export default Home
