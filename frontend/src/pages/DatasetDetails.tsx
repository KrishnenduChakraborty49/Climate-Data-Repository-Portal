import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Button, Chip, CircularProgress, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { datasetApi } from '../api/datasetApi';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DatasetDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: dataset, isLoading, error } = useQuery({
        queryKey: ['dataset', id],
        queryFn: () => datasetApi.getDatasetById(id as string),
        enabled: !!id
    });

    const handleDownload = async () => {
        if (!dataset) return;
        try {
            await datasetApi.downloadDataset(dataset.id, dataset.originalFilename || 'dataset_download');
        } catch (err) {
            console.error('Download failed', err);
            alert('Failed to download the dataset. Ensure you are logged in.');
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isLoading) return <Container sx={{ mt: 10, textAlign: 'center' }}><CircularProgress /></Container>;
    if (error || !dataset) return <Container sx={{ mt: 10 }}><Typography color="error">Dataset not found or failed to load.</Typography></Container>;

    return (
        <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/datasets')} sx={{ mb: 4, color: 'text.secondary' }}>
                Back to Repository
            </Button>
            
            <Grid container spacing={4}>
                {/* Main Info */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#0f172a' }}>
                        {dataset.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
                        <Chip label={dataset.category?.name || 'Dataset'} sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 600 }} />
                        <Chip label={`Version ${dataset.version || '1.0'}`} variant="outlined" />
                        <Chip label={new Date(dataset.createdAt).toLocaleDateString()} variant="outlined" />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Description</Typography>
                    <Typography color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                        {dataset.description || 'No description provided.'}
                    </Typography>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Metadata</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}><Typography color="text.secondary">Format:</Typography><Typography fontWeight={600}>{dataset.fileFormat}</Typography></Grid>
                        <Grid item xs={6}><Typography color="text.secondary">Size:</Typography><Typography fontWeight={600}>{formatBytes(dataset.fileSize)}</Typography></Grid>
                        <Grid item xs={6}><Typography color="text.secondary">License:</Typography><Typography fontWeight={600}>{dataset.metadata?.license || 'Open Data Commons'}</Typography></Grid>
                        <Grid item xs={6}><Typography color="text.secondary">Resolution:</Typography><Typography fontWeight={600}>{dataset.metadata?.resolution || 'N/A'}</Typography></Grid>
                    </Grid>
                </Grid>

                {/* Sidebar Actions */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', position: 'sticky', top: 100 }}>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#f0fdf4', color: '#16a34a', display: 'inline-flex', mb: 2 }}>
                                <DownloadOutlinedIcon sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Download Dataset</Typography>
                            <Typography color="text.secondary" variant="body2" sx={{ mb: 4 }}>
                                {formatBytes(dataset.fileSize)} • {dataset.fileFormat}
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                size="large" 
                                fullWidth 
                                onClick={handleDownload}
                                sx={{ py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
                            >
                                Download Now
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DatasetDetails;
