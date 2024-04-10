import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ClickAwayListener from '@mui/material/ClickAwayListener';
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
  boxShadow: 24,
  p: 4,
};

const ResponseModal = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);

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
              right: 8,
              top: 8,
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
