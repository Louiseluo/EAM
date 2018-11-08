import axios from 'axios'
import $ from 'jquery';
import fc from './fc';
import auth from './auth';

var conf = require('../../static/conf/conf.json')
/*本文件不要提交！*/
let base = conf.dev ? conf.httpUrl : 'http://' + location.host.split(':')[0] + ":8085/"; // 正式环境
let token = fc.data.token;

// axios 配置
axios.defaults.baseURL = base;

// http request 拦截器
axios.interceptors.request.use(
    config => {
        //动态增加token至request中
        if (config.params == undefined) config.params = {};
        let tokenVal = fc.getTokenFromCookie();

        config.params[token] = tokenVal;
        if (config.data) {
            for (var o in config.data) {
                config.params[o] = config.data[o];
            }
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        //回参拦截，判断是否需要重新登录
        let res = response.data.response;
        if (response.data.response === undefined) {
            console.log("数据不合法！");
        } else {
            if (res.code == 10) {//需要登录
                clearAllCookie();
                console.log("need login");
                /*MI 做法*/
                // window.location.href = res.msg;
                /* UMS */
                window.location.href = res.msg;
                /*security service*/
                // if(auth.isLogin == 0) {
                //     auth.isLogin = 1;
                //     window.location.href = res.msg;
                // }
            } else if (res.code == -1) {//返回失败
                console.log("failed: " + res.msg);
            } else if (res.code == 1) {
                auth.isLogin = 0;
                if (res.token) {
                    console.log("res.token: " + res.token)
                    //token 写入cookie
                    fc.setToken(res.token);
                }
            }
        }
        return response;
    },
    error => {
    });


//function
export const getCookie = (name) => {
    return fc.getCookie(name);
}

export const clearAllCookie = () => {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}

//export
export default axios;

/*按钮权限*/
export const rt = params => {
    let result = false;
    $.ajax({
        url: `${base}` + 'auth/cr/' + params + "?" + token + "=" + fc.getToken(),
        type: 'GET',
        async: false,
        success: function (data) {
            // console.log(data);
            let v = data.response.data;
            if (v === '0') result = true;
        }
    });
    return result;
};

/*路劲权限*/
export const rl = param => {
    let result = false;
    if (fc.getToken() === "") {
        if (auth.isLogin == 0) {
            auth.isLogin = 1;
            window.location.href = data.response.msg;
        }
        return result;
    }
    $.ajax({
        url: `${base}` + 'auth/link?l=' + encodeURIComponent(param) + "&" + token + "=" + fc.getToken(),
        type: 'GET',
        async: false,
        success: function (data) {
            console.log(data);
            if (data.response.code == 10) {//需要登录
                clearAllCookie();
                console.log("rl need login");
                /*MI 做法*/
                // window.location.href = res.msg;
                /* UMS */
                window.location.href = data.response.msg;
                // /*security service*/
                // if(auth.isLogin == 0) {
                //     auth.isLogin = 1;
                //     window.location.href = data.response.msg;
                // }
            }
            let v = data.response.data;
            if (v === '0') result = true;
        }
    });
    return result;
};

//上传地址
export const uploadUrl = () => {//文件服务器NFS
    console.log('testse');
    return "ws://" + (conf.dev ? conf.imgUploadUrl : location.hostname) + ":" + (conf.dev ? conf.imgUploadPort : 8822) + "/pandora/fileup";
};
export const selfUploadUrl = () => {//后台服务地址
    return base + "/f/upload";
};
//服务器地址
export const baseUrl = () => {
    return base;
};

/**语言 默认中文*/
export const getLocale = () => {
    let result = "zh";
    $.ajax({
        url: `${base}` + '/locale/getLocale',
        type: 'GET',
        async: false,
        success: function (data) {
            result = data;
        }
    });
    return result;
};
