import axios from "axios";
import toast from "react-hot-toast";
import Security from "../security/security";

function AxiosMiddleware(method, url, data, options) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.common['env'] = "test";

    const contentType = options?.headers?.['Content-Type'] === 'multipart/form-data';

    if (data && !contentType) {
        data = new Security().encrypt(data);
    }

    // if (data) {
    //     data = new Security().encrypt(data);
    // }

    switch (method) {
        case 'get':
            return axios.get(url, data, options);

        case 'post':
            return axios.post(url, data, options);

        case 'patch':
            return axios.patch(url, data, options);

        case 'head':
            return axios.head(url, data, options);

        case 'put':
            return axios.put(url, data, options);

        case 'delete':
            return axios.delete(url, { data: data, headers: options });
        default:
            return "no function found"
    }
}

export function get(url, data = [], options = {}) {
    return AxiosMiddleware('get', url, data, options)
}
export function post(url, data = [], options = {}) {
    return AxiosMiddleware('post', url, data, options)
}
export function patch(url, data = [], options = {}) {
    return AxiosMiddleware('post', url, data, options)
}

axios.interceptors.response.use(
    (response) => {
        if (response.data.mac !== undefined) {
            response.data = new Security().decrypt(response.data);
        }
        return response
    },
    (error) => {
        console.log("------------", error);
        if (error.response.status === 423) {
        }
        if (error.response.status === 401) {
            var userdata = localStorage.getItem('token');
            // console.log(userdata, "userData------------------");
            if (userdata) {
                toast(error.response.data.message);
            }
        }
        return Promise.reject(error);
    }
)
export default AxiosMiddleware;