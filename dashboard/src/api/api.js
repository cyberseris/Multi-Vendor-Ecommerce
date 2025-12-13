import axios from 'axios';
const local = 'http://localhost:5000'
const production = 'http://localhost:6000'  //待修改成正式後端網址

let api_url = ''
let mode  = 'dev'

if(mode === 'pro'){
    api_url = production
}else{
    api_url = local
}

const api = axios.create({
    baseURL: `${api_url}/api`,
    withCredentials: true
})

export default api;







/* import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
})

// 添加請求攔截器，自動將 token 加到 header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api; */