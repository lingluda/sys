import axios from "axios";
import Cookies from 'js-cookie';
import Vue from 'vue';
import {Message} from 'iview';

const ajax = axios.create();
ajax.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (response.data.code == -1 || response.data.code == 500) {
        Message.error(response.data.msg);
    } else if (response.data.code == 401) {
        //去登录
        Cookies.remove('user');
        Cookies.remove('password');
        location.reload();
    }
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
export default ajax;
