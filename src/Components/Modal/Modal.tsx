import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useTheme } from '@mui/material/styles';




const ResponseModal = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
const isDarkMode = theme.palette.mode === 'dark';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  maxHeight: '80%',
  overflowY: 'scroll',
  transform: 'translate(-50%, -50%)',
  maxWidth: '90%',
  borderRadius: '12px',
  bgcolor: 'background.paper',
  border: '1px solid hsla(0, 0%, 50%, 0.3)',
  boxShadow: 'hsla(0, 0%, 50%, 0.1) 0 0 50px',
  backdropFilter: "blur(10px)",
  backgroundColor: `${
    isDarkMode  ? "rgba(10, 10, 10, 0.7)" : "rgba(255, 255, 255, 0.9)"
    // mode === "dark" ? "rgba(17, 21, 30, 0.7)" : "rgba(255, 255, 255, 0.7)"
  }`,
  p: 4,
};

  const handleClose = () => setOpen(false);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
      >
        <Box sx={style}>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: "0.5rem",
              top: "1rem",
              border: '1px solid #77777735',
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {children}
        </Box>
      </Modal>
    </ClickAwayListener>
  );
};

export default ResponseModal;
