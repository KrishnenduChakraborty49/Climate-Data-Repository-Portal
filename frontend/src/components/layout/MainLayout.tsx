import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';

const MainLayout: React.FC = () => {
    const { isAuthenticated, logout, user } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e2e8f0', bgcolor: 'white' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
                            <CloudOutlinedIcon sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.5px' }}>
                                Climate Data Repository
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button component={Link} to="/" color="inherit" sx={{ fontWeight: 600 }}>Home</Button>
                            <Button component={Link} to="/datasets" color="inherit" sx={{ fontWeight: 600 }}>Datasets</Button>
                            
                            {isAuthenticated ? (
                                <>
                                    <Button component={Link} to="/admin" color="primary" variant="outlined">Dashboard</Button>
                                    <Button onClick={handleLogout} color="error" sx={{ fontWeight: 600 }}>Logout</Button>
                                </>
                            ) : (
                                <Button component={Link} to="/login" variant="contained" color="primary">Sign In</Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', py: 4 }}>
                <Outlet />
            </Box>

            <Box component="footer" sx={{ py: 6, bgcolor: 'primary.dark', color: 'white', mt: 'auto' }}>
                <Container maxWidth="xl">
                    <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
                        © {new Date().getFullYear()} Climate Data Repository. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default MainLayout;
