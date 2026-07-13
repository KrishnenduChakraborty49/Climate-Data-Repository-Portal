import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, InputAdornment, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';

const Login: React.FC = () => {
    const [email, setEmail] = useState('admin@climate.org');
    const [password, setPassword] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            if (response.data.success) {
                const { token, role, email: userEmail } = response.data.data;
                login(token, { email: userEmail, roles: [role] });
                
                // Redirect based on role
                if (role === 'ROLE_ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/datasets');
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', p: 2 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', mb: 2 }}>
                        <CloudOutlinedIcon fontSize="large" />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Welcome Back</Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>Sign in to access your climate datasets</Typography>

                    {error && <Alert severity="error" sx={{ width: '100%', mb: 3 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            variant="outlined"
                            margin="normal"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            margin="normal"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        
                        <Button 
                            type="submit" 
                            fullWidth 
                            variant="contained" 
                            color="primary" 
                            size="large" 
                            disabled={loading}
                            sx={{ mt: 4, py: 1.5, fontSize: '1.1rem' }}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Login;
