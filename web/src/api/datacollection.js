import axios from 'axios';

export function list(params) {
    return axios.get('/api/dataCollection/list', { params });
}