import axiosInstance from './axiosInstance';

export const datasetApi = {
    getAllCategories: async () => {
        const res = await axiosInstance.get('/categories');
        return res.data.data;
    },
    getAllDatasets: async (page = 0, size = 20) => {
        const res = await axiosInstance.get(`/datasets?page=${page}&size=${size}`);
        return res.data.data;
    },
    getDatasetById: async (id: string) => {
        const res = await axiosInstance.get(`/datasets/${id}`);
        return res.data.data;
    },
    uploadDataset: async (datasetData: any, file: File) => {
        const formData = new FormData();
        // The backend expects @RequestPart("dataset") and @RequestPart("file")
        // We must append the JSON as a Blob with application/json type
        formData.append('dataset', new Blob([JSON.stringify(datasetData)], { type: 'application/json' }));
        formData.append('file', file);

        const res = await axiosInstance.post('/datasets', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data.data;
    },
    downloadDataset: async (id: string, filename: string) => {
        const res = await axiosInstance.get(`/download/${id}`, {
            responseType: 'blob' // Important for file download
        });
        
        // Create a download link and trigger it
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    }
};
