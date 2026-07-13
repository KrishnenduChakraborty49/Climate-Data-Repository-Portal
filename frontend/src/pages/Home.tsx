import React, { useState } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, InputBase, Paper, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/datasets?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate('/datasets');
        }
    };

    const categories = ['Rainfall', 'Temperature', 'Humidity', 'Wind', 'Hydrology'];

    return (
        <Box>
            {/* Hero Section */}
            <Box sx={{ 
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
                color: 'white', 
                py: { xs: 8, md: 14 },
                textAlign: 'center'
            }}>
                <Container maxWidth="md">
                    <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, mb: 3 }}>
                        Explore Global Climate Data
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.8, mb: 6, fontWeight: 400 }}>
                        Discover, analyze, and download high-quality climate and meteorological datasets for research and modeling.
                    </Typography>

                    {/* Quick Search */}
                    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', maxWidth: 600, mx: 'auto', borderRadius: '50px' }}>
                        <Box sx={{ p: 1, ml: 1, color: 'text.secondary' }}>
                            <SearchIcon />
                        </Box>
                        <InputBase
                            sx={{ ml: 1, flex: 1, py: 1.5 }}
                            placeholder="Search datasets by title or description..."
                            inputProps={{ 'aria-label': 'search climate datasets' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            sx={{ borderRadius: '50px', px: 4, py: 1.5, mr: 0.5 }}
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </Paper>
                </Container>
            </Box>

            {/* Categories */}
            <Container maxWidth="xl" sx={{ mt: 8 }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Popular Categories</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {categories.map((cat) => (
                        <Chip 
                            key={cat} 
                            label={cat} 
                            onClick={() => navigate(`/datasets?category=${cat}`)}
                            sx={{ px: 2, py: 2.5, fontSize: '1rem', fontWeight: 600, borderRadius: '12px', cursor: 'pointer', '&:hover': { bgcolor: 'secondary.light', color: 'white' } }}
                        />
                    ))}
                </Box>
            </Container>

        </Box>
    );
};

export default Home;
