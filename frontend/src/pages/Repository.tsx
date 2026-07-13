import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Chip, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { datasetApi } from '../api/datasetApi';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';

const Repository: React.FC = () => {
    const navigate = useNavigate();

    const { data: datasetPage, isLoading, error } = useQuery({
        queryKey: ['datasets'],
        queryFn: () => datasetApi.getAllDatasets(0, 20)
    });

    if (isLoading) return <Container sx={{ mt: 10, textAlign: 'center' }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ mt: 10 }}><Typography color="error">Failed to load datasets.</Typography></Container>;

    const datasets = datasetPage?.content || [];

    return (
        <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Dataset Repository</Typography>
                <Typography variant="h6" color="text.secondary">
                    Browse and discover high-quality climate datasets.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Sidebar (Filters placeholder) */}
                <Grid item xs={12} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Filters</Typography>
                        <Typography color="text.secondary" variant="body2">Filter integration coming soon.</Typography>
                    </Card>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12} md={9}>
                    {datasets.length === 0 ? (
                        <Card sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1', boxShadow: 'none' }}>
                            <StorageOutlinedIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                            <Typography variant="h5" color="text.secondary">No datasets found.</Typography>
                            <Typography color="text.secondary" sx={{ mt: 1 }}>Be the first to upload one in the Admin dashboard.</Typography>
                        </Card>
                    ) : (
                        <Grid container spacing={3}>
                            {datasets.map((dataset: any) => (
                                <Grid item xs={12} key={dataset.id}>
                                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box>
                                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                                                        {dataset.title}
                                                    </Typography>
                                                    <Typography color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {dataset.description}
                                                    </Typography>
                                                </Box>
                                                <Button variant="outlined" color="primary" onClick={() => navigate(`/datasets/${dataset.id}`)}>
                                                    View Details
                                                </Button>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                                <Chip label={dataset.category?.name || 'Uncategorized'} size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 600 }} />
                                                <Chip label={`${(dataset.fileSize / 1024 / 1024).toFixed(2)} MB`} size="small" variant="outlined" />
                                                <Chip label={dataset.fileFormat} size="small" variant="outlined" />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Repository;
