import Vue from 'vue';
import App from './App';
import base_info from './api/enum';

//导入iView
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import './common/css/public.css';
import VueI18n from 'vue-i18n'

//导入自定义样式：
import './common/css/custom.css';

// 导入路由
import router from './router/index.js';

//自定义
import axios from './api/http';
import {rt} from './api/http';
import {uploadUrl} from './api/http';
import {selfUploadUrl} from './api/http';
import {baseUrl} from './api/http';
import {getLocale} from './api/http';
import fc from './api/fc';
import $jq from 'jquery';
import echarts from 'echarts';

// 导入轮播
import VueAwesomeSwiper from 'vue-awesome-swiper';

// 使用轮播
Vue.use(VueAwesomeSwiper);

//使用iView
Vue.use(iView);
Vue.use(VueI18n);
const authJson = require('./api/auth_right.json')

//绑定axios到原型链
Vue.prototype.$axios = axios;
Vue.prototype.$jq = $jq;
Vue.prototype.$rt = rt;/*权限按钮*/
Vue.prototype.$fc = fc;/*公共方法*/
Vue.prototype.uploadUrl = uploadUrl;
Vue.prototype.selfUploadUrl = selfUploadUrl;
Vue.prototype.baseUrl = baseUrl;
Vue.prototype.echarts = echarts;
Vue.prototype.$base_info = base_info;
Vue.prototype.authJson = authJson;

/*** i18n start***/
// set lang
Vue.config.lang = "zh"

Vue.prototype.changeLocale = (lang) => {
    if(fc.getTokenFromCookie() !== "") {//登录的情况下走后台绑定
        let code = fc.getLocaleCode(lang);
        axios.post('/locale/set'+code).then((res) => {
            if(res.data.response.code !== 1) {
                Vue.config.lang = res.data.response.data;
            }
        });
    }
    Vue.config.lang = lang;
    // console.log("change lang: " +  Vue.config.lang)
};

Vue.prototype.getLocale = () => {
    if(fc.getTokenFromCookie() !== "")
        Vue.config.lang = getLocale();
    return Vue.config.lang;
};

const locales = {
    zh: require("./common/lang/zh"),/*0*/
    en: require("./common/lang/en"),/*1*/
}

// set locales
Object.keys(locales).forEach(function (lang) {
    Vue.locale(lang, locales[lang])
})
/*** i18n end***/

/*** auth start***/
//_n_pandora_p_acc_
let index = window.location.href.indexOf("?_n_pandora_p_acc_=");
if(index > 0) {
    let tokenVal = window.location.href.substr(index+19, 20);
    fc.setToken(tokenVal);
    sessionStorage['uname'] = undefined;
    window.location.href = window.location.href.substring(0, index);
}

// axios.get(`relogin/checkToken`);
/*** auth end***/
base_info.init();

const app = new Vue({
  router,
  render:h=>h(App)
}).$mount('#app');


