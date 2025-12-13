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
    baseURL: `${api_url}/api`
})

export default api;