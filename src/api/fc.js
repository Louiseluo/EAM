let fc = {
    data: {
        token: '_pandora_p_acc_'
    },

    h: function(){
        console.log("hello.");
    },
    // /**
    //  * 正则强制转换成数字
    //  * @param str
    //  */
    // changeToNum : function(value) {
    //     value = value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'');
    //     return value;
    // },

    /**
     * json数组是否包含json对象
     * @param obj
     * @param arr
     * @constructor
     */
    JsonArrContainObj: function (obj, arr) {
        if(obj && arr && typeof arr === Array) {
            for(let o in arr) {
                if(arr[o] == obj) return true;
            }
        }
        return false;
    },

    /**
     * 找到在arr中obj的下标，无则返回-1
     * @param obj
     * @param arr
     */
    arrIndexOfObj: function(obj, arr) {
        if(obj && arr && typeof arr === Array) {
            for(let o in arr) {
                if(arr[o] == obj) return o;
            }
        }
        return -1;
    },

    /**
     * 数组中找到key为value的首个符合要求的对象的下标，无则返回-1
     * @param key
     * @param value
     * @param arr
     * @returns {*}
     */
    arrIndexOfObj: function(key,value, arr) {
        if(key && value && arr) {
            for(let o in arr) {
                if(arr[o][key] == value) return Number(o);
            }
        }
        return -1;
    },


    clone: function clone(obj) {
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var j in obj) {
                        o[j] = clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    },

    cloneKey: function cloneKey(obj) {
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(cloneKey(obj[i]));
                    }
                } else {
                    o = {};
                    for (var j in obj) {
                        o[j] = cloneKey(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    },

    /**
     * 将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 默认： yyyy-MM-dd hh:mm:ss
     * @param date
     * @param fmt
     * @returns {*}
     */
    dateFormat: function (date, fmt) {
        var dateObj = date;
        if(typeof date === 'string') {
            dateObj = new Date(date);
        }
        if(!fmt) fmt = 'yyyy-MM-dd hh:mm:ss';
        var o = {
            "M+": dateObj.getMonth() + 1, //月份
            "d+": dateObj.getDate(), //日
            "h+": dateObj.getHours(), //小时
            "m+": dateObj.getMinutes(), //分
            "s+": dateObj.getSeconds(), //秒
            "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度
            "S": dateObj.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },

    /**
     * 将时间转换为日期,小时分钟秒都置零
     * @param data  yyyy-MM-dd
     */
    datetimeToDate: function (datetime) {
        var date = {};
        if(typeof datetime === 'string') {
            date = new Date(datetime);
        }else {
            date = datetime;
        }
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return fc.dateFormat(date);
    },

    /**
     * 字符串转时间（yyyy-MM-dd HH:mm:ss）
     * result
     */
    stringToDate : function(fDate){
        var fullDate = (fDate + "").split("-");
        return new Date(fullDate[0], fullDate[1]-1, fullDate[2], 0, 0, 0);
    },

    /**
     * date1减去date2的结果（单位天）
     * @param date1     Date或者格式为：2017-09-09 09:00:00
     * @param date2
     * @returns {Number}
     */
    dayMinus: function (date1, date2){
        if(!date1.getTime()) {
            let dateStr = date1.split("-");
            date1 = new Date(dateStr[0], Number(dateStr[1]) - 1, dateStr[2]);
        }
        if(!date2.getTime()) {
            let dateStr = date2.split("-");
            date2 = new Date(dateStr[0], Number(dateStr[1]) - 1, dateStr[2]);
        }
        var days = date1.getTime() - date2.getTime();
        var day = parseInt(days / (1000 * 60 * 60 * 24));
        return day;
    },

    //处理重复提交（save按钮点击多次）问题
    //var isubmit = false;
    iSubmit: function (obj) {
        var tmp = obj
        if (!tmp.isubmit) {
            tmp.isubmit = true;
            return true;
        } else {
            tmp.$Message.warning("请勿重复提交");
            return false;
        }
    },

    /**
     *  处理重复提交（save按钮点击多次）问题
     * @param obj
     * @param flag             判别变量名字
     * @returns {boolean}
     */
    iSubmit2: function (obj, flag) {
        var tmp = obj
        if (!tmp[flag]) {
            tmp[flag] = true;
            return true;
        } else {
            tmp.$Message.warning("请勿重复提交");
            return false;
        }
    },

    /**如果cookie中不存在token,则从url中获取*/
    getToken:function () {
        let tokenVal;
        if (document.cookie.length>0) {
            tokenVal = fc.getCookie(fc.data.token);
            // console.log("get cookie: " + tokenVal + " ,document.cookie: " + document.cookie);
        }
        if(tokenVal == undefined || tokenVal == "" || tokenVal == "undefined") {
            let index = window.location.href.indexOf("?token=");
            if(index > 0) {
                tokenVal = window.location.href.substr(window.location.href.indexOf("?token=")+7);
            }
            // console.log("get location.href: " + tokenVal);
        }

        return tokenVal;
    },

    /**从cookie中获取token*/
    getTokenFromCookie:function () {
        let tokenVal;
        if (document.cookie.length>0) {
            tokenVal = fc.getCookie(fc.data.token);
        }
        if(tokenVal == undefined || tokenVal == "" || tokenVal == "undefined") {
            tokenVal = "";
        }
        return tokenVal;
    },

    needLogin: function() {
      // if(fc.getTokenFromCookie() !== "")
          return false;
      // return true;
    },

    getCookie: function(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)) {
            return decodeURIComponent(arr[2]);
        }
        else
            return null;
    },

    getCookie: function(name, defaultVal){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)) {
            return decodeURIComponent(arr[2]);
        }
        else
            return defaultVal;
    },

    setCookie: function(name,value){
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ encodeURIComponent (value) + ";expires=" + exp.toGMTString();
    },

    clearAllCookie: function() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if(keys) {
            for(var i = keys.length; i--;)
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
    },

    setToken: function(value){
        fc.clearAllCookie();
        fc.setCookie("_pandora_p_acc_", value);
    },

    /**
     * 是否为无效值
     * @param val
     * @returns {boolean}
     */
    isInvalid: function(val){
        if(val === undefined) return true;
        if(val.replace(/^\s+|\s+$/gm,'') === "") return true;
        if(val === "undefined") return true;
        return false;
    },

    /**多语言*/
    locale: {
        0: 'zh',
        1: 'en',
    },

    getLocaleName(code) {
        for(let i in fc.locale) {
            if(code === i)
                return fc.locale[i];
        }
        return undefined;
    },
    getLocaleCode(lang) {
        for(let i in fc.locale) {
            if(lang === fc.locale[i])
                return i;
        }
        return -1;
    }
    /**多语言*/

}

export default fc;
