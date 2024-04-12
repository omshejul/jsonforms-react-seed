import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import styled from 'styled-components';
import DrawerItems from './Drawer.json';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Divider, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../contexts/themeContext';
import { useContext, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

// ICONS >>
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import TryIcon from '@mui/icons-material/Try';
import UpdateIcon from '@mui/icons-material/Update';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
// ICONS <<

//TYPES >>
type IconMapType = {
  [key: string]: React.ComponentType | undefined;
};

const iconMap: IconMapType = {
  InboxIcon: InboxIcon,
  MailIcon: MailIcon,
  MenuIcon: MenuIcon,
  TryIcon: TryIcon,
  UpdateIcon: UpdateIcon,
  AllInboxIcon: AllInboxIcon,
};
// TYPES <<

// COMPONENT >>
export default function DrawerMenu() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const colorMode = useContext(ThemeContext);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const isDarkMode = theme.palette.mode === 'dark';

  const location = useLocation();
  const currentPage = useMemo(() => {
    const currentItem = DrawerItems.find(
      (item) => item.path === location.pathname
    );
    return {
      title: currentItem ? currentItem.text : 'Default Title',
      icon: currentItem
        ? React.createElement(iconMap[currentItem.icon]! as any, {
            fontSize: 'large',
            style: { marginInlineEnd: '1rem' }, // Add your style here
          })
        : null,
    };
  }, [location.pathname]);

  const DrawerList = (
    <Box sx={{ width: 250 }} role='presentation' onClick={toggleDrawer(false)}>
      <Grid container justifyContent='center' marginY={'1rem'}>
        <Typography variant='h4'>Menu</Typography>
      </Grid>
      <Divider />
      <List>
        {DrawerItems.map((item, index) => (
          <ListItem
            key={item.text}
            disablePadding
            onClick={() => navigate(item.path)}
          >
            <ListItemButton>
              <ListItemIcon>
                {iconMap[item.icon]
                  ? React.createElement(iconMap[item.icon]!)
                  : null}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* <ListItem disablePadding>
          <ListItemButton onClick={colorMode.toggleColorMode}>
            <ListItemIcon>
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            <ListItemText primary='Toggle Theme' />
          </ListItemButton>
        </ListItem> */}
      </List>
    </Box>
  );

  return (
    <NavBar>
      <StyledButton
        style={{ borderRadius: '50vw' }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </StyledButton>

      <Typography
        justifyContent={'center'}
        alignItems={'center'}
        display={'flex'}
        textAlign={'center'}
        variant='h4'
      >
        {currentPage.icon}
        {currentPage.title}
      </Typography>
      <Button
        style={{ aspectRatio: '1', borderRadius: '50vw', padding: '0' }}
        color='inherit'
        onClick={colorMode.toggleColorMode}
      >
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </Button>

      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            borderRadius: '1rem',
            backgroundColor: `${isDarkMode ? "rgba(24, 27, 34, 0.6)" : "rgba(255, 255, 255, 0.9)"}`,
            margin: '1rem',
            padding: '1rem',
            maxHeight: '90%',
            border:"1px solid hsla(0, 0%, 100%, 0.2)",
            backgroundBlendMode: 'darken', 
            backdropFilter: 'blur(5px)',
          },
        }}
        open={open}
        onClose={toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>
    </NavBar>
  );
}
// COMPONENT <<

// STYLES >>
const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const StyledButton = styled(Button)`
  aspect-ratio: 1;
`;
// STYLES <<
