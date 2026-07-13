import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, InputAdornment, IconButton, Alert, Link } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axiosInstance.post('/auth/register', { firstName, lastName, email, password });
            if (response.data.success) {
                const { token, role, email: userEmail } = response.data.data;
                login(token, { email: userEmail, roles: [role] });
                navigate('/datasets');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', p: 2 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'secondary.main', color: 'white', mb: 2 }}>
                        <CloudOutlinedIcon fontSize="large" />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Create Account</Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>Join the Climate Data Repository</Typography>

                    {error && <Alert severity="error" sx={{ width: '100%', mb: 3 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                variant="outlined"
                                margin="normal"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                variant="outlined"
                                margin="normal"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Box>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Password (min 6 characters)"
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
                            color="secondary" 
                            size="large" 
                            disabled={loading}
                            sx={{ mt: 4, py: 1.5, fontSize: '1.1rem' }}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Link component={RouterLink} to="/login" color="primary.main" sx={{ fontWeight: 600 }}>
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Register;
