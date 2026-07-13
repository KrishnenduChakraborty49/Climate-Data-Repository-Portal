import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, Alert } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { datasetApi } from '../api/datasetApi';
import { useAuthStore } from '../store/authStore';

const AdminDashboard: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', categoryId: '', isPublic: true });
    const [uploadError, setUploadError] = useState('');

    const queryClient = useQueryClient();
    const token = useAuthStore(state => state.token);

    // Fetch datasets
    const { data: datasetPage, isLoading } = useQuery({
        queryKey: ['datasets'],
        queryFn: () => datasetApi.getAllDatasets()
    });

    // Fetch categories
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => datasetApi.getAllCategories()
    });

    const uploadMutation = useMutation({
        mutationFn: (data: { dataset: any, file: File }) => datasetApi.uploadDataset(data.dataset, data.file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['datasets'] });
            handleClose();
        },
        onError: (err: any) => {
            setUploadError(err.response?.data?.message || 'Failed to upload dataset');
        }
    });

    const handleClose = () => {
        setOpenModal(false);
        setFile(null);
        setFormData({ title: '', description: '', categoryId: '', isPublic: true });
        setUploadError('');
    };

    const handleUpload = () => {
        if (!file || !formData.title || !formData.categoryId) {
            setUploadError('Please fill all required fields and select a file');
            return;
        }
        uploadMutation.mutate({
            dataset: {
                title: formData.title,
                description: formData.description,
                categoryId: parseInt(formData.categoryId),
                isPublic: formData.isPublic,
                version: '1.0'
            },
            file
        });
    };

    if (isLoading) return <Box p={4}><CircularProgress /></Box>;

    const datasets = datasetPage?.content || [];

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>Admin Dashboard</Typography>
                <Button variant="contained" color="secondary" startIcon={<FileUploadOutlinedIcon />} onClick={() => setOpenModal(true)}>
                    Upload Dataset
                </Button>
            </Box>

            {/* KPIs */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderLeft: '4px solid #3b82f6' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Total Datasets</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>{datasets.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Other KPIs mocked for now */}
                <Grid item xs={12} sm={6} md={3}><Card sx={{ borderLeft: '4px solid #10b981' }}><CardContent><Typography color="text.secondary" gutterBottom>Total Downloads</Typography><Typography variant="h4" sx={{ fontWeight: 700 }}>0</Typography></CardContent></Card></Grid>
                <Grid item xs={12} sm={6} md={3}><Card sx={{ borderLeft: '4px solid #f59e0b' }}><CardContent><Typography color="text.secondary" gutterBottom>Storage Used</Typography><Typography variant="h4" sx={{ fontWeight: 700 }}>1.2 GB</Typography></CardContent></Card></Grid>
                <Grid item xs={12} sm={6} md={3}><Card sx={{ borderLeft: '4px solid #8b5cf6' }}><CardContent><Typography color="text.secondary" gutterBottom>Active Users</Typography><Typography variant="h4" sx={{ fontWeight: 700 }}>1</Typography></CardContent></Card></Grid>
            </Grid>

            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Recent Uploads</Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Dataset Title</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Size (Bytes)</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>File Format</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datasets.length === 0 ? (
                            <TableRow><TableCell colSpan={5} align="center">No datasets uploaded yet.</TableCell></TableRow>
                        ) : datasets.map((d: any) => (
                            <TableRow key={d.id}>
                                <TableCell>{d.title}</TableCell>
                                <TableCell>{d.category?.name}</TableCell>
                                <TableCell>{d.fileSize}</TableCell>
                                <TableCell>{d.fileFormat}</TableCell>
                                <TableCell>{new Date(d.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* Upload Modal */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Upload New Dataset</DialogTitle>
                <DialogContent>
                    {uploadError && <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert>}
                    <TextField fullWidth label="Title" margin="normal" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <TextField fullWidth label="Description" margin="normal" multiline rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    <TextField select fullWidth label="Category" margin="normal" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                        {categories?.map((c: any) => (
                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                        ))}
                    </TextField>
                    <Box sx={{ mt: 3, mb: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>Dataset File</Typography>
                        <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpload} disabled={uploadMutation.isPending}>
                        {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;
