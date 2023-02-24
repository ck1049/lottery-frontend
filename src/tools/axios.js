import axios from 'axios'
import Qs from 'qs'//（如果只是get请求就不需要引qs）//序列化插件
import _ from 'lodash'//这里时用的防抖函数
const baseURLMap = {'development': 'http://localhost:5173/api/', 'production': 'http://www.loafer.online/api/'};
axios.defaults.withCredentials = true;  //false
// axios.defaults.baseURL = baseURLMap[process.env.NODE_ENV];
axios.defaults.baseURL = "/api/";

const http = (path, params = {}, method = "GET", headerType = "json") => {
    let data = {};//baseURL = ""
    for (var i in params) {//去除参数的空格
        if (params.hasOwnProperty(i) === true) {
            if (typeof params[i] == 'string') {
                if (params[i] != '') {
                    params[i] = params[i].trim();
                }
                // this.accountSearch[i] = this.accountSearch[i].trim();
            }
        }
    }

    //设置请求头
    if (method === 'POST') {   //post请求
        if (headerType === "json") {
            axios.defaults.headers["Content-Type"] = 'application/json;charset=UTF-8'
            data = params
        } else {
            axios.defaults.headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=UTF-8'
            data = Qs.stringify(params);
        }
    } else if (method === 'GET') {
        axios.defaults.headers["X-Requested-With"] = 'XMLHttpRequest';
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        if (headerType == !'json') {
            axios.defaults.headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=UTF-8'
        }
        data = Qs.stringify(params);
        path = data ? path + '?' + data : path;
        data = {};
    }

    //发送请求
    return new Promise((resolve, reject) => axios({ url: path, method, data: params, timeout: 60000 })
        .then(result => resolve(result.data))
        .catch(err => reject(err)))
}

const get = (path, params) => http(path, params);

const post = (path, params, headerType) => http(path, params, "POST", headerType);

export default { axios, http, post, get };