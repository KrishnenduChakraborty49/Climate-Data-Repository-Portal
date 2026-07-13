import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Chip, Button, CircularProgress } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { datasetApi } from '../api/datasetApi';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';

const Repository: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const { data: datasetPage, isLoading, error } = useQuery({
        queryKey: ['datasets', category, search],
        queryFn: () => datasetApi.getAllDatasets(0, 20, category || undefined, search || undefined)
    });

    if (isLoading) return <Container sx={{ mt: 10, textAlign: 'center' }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ mt: 10 }}><Typography color="error">Failed to load datasets.</Typography></Container>;

    const datasets = datasetPage?.content || [];

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

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
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ p: 2, borderRadius: 3, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Filters</Typography>
                        {(category || search) ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {category && (
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Active Category:</Typography>
                                        <Chip 
                                            label={category} 
                                            onDelete={() => navigate(search ? `/datasets?search=${search}` : '/datasets')} 
                                            color="secondary" 
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Box>
                                )}
                                {search && (
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Search Query:</Typography>
                                        <Chip 
                                            label={`"${search}"`} 
                                            onDelete={() => navigate(category ? `/datasets?category=${category}` : '/datasets')} 
                                            color="primary" 
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Typography color="text.secondary" variant="body2">No active filters.</Typography>
                        )}
                    </Card>
                </Grid>

                {/* Main Content */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {datasets.length === 0 ? (
                        <Card sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1', boxShadow: 'none' }}>
                            <StorageOutlinedIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                            <Typography variant="h5" color="text.secondary">No datasets found.</Typography>
                            <Typography color="text.secondary" sx={{ mt: 1 }}>Be the first to upload one in the Admin dashboard.</Typography>
                        </Card>
                    ) : (
                        <Grid container spacing={3}>
                            {datasets.map((dataset: any) => (
                                <Grid size={{ xs: 12 }} key={dataset.id}>
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
                                                <Chip label={formatBytes(dataset.fileSize)} size="small" variant="outlined" />
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
