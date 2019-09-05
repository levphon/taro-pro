import Taro, { Component } from '@tarojs/taro'

export const baseUrl = "http://localhost:8888";
export const appid = "wxb947dfc134eadbc4";
// export const imageUrl = baseUrl+"/weappimages/";
export const imageUrl = "../../assets/image/";

export default {

    /**
       * 获取header
       */
    getHeader() {
        var isToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var header = {
            "content-type": "application/json"
        };
        if (isToken) {
            var token = this.getToken();
            if (token) {
                header["Authorization"] = "Bearer " + token;
            }
        }
        return header;
    },

    /**
     * 返回debug需要状态码
     */
    getDebug(params) {
        var isDebug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        if (isDebug) {
            var np = Object.assign({}, params, {
                XDEBUG_SESSION_START: 15442
            });
            return np;
        }
        return params;
    },

    /**
     * 返回token 信息
     */
    getToken() {
        return Taro.getStorageSync("token");
    },


    /**
     * 注册账号
     */
    register(params) {
        // 为了断点调试
        var nparams = Object.assign({}, params, {
            XDEBUG_SESSION_START: 10235
        });
        var header = this.getHeader(false);
        return Taro.request({
            url: baseUrl + "/wx/user/" + appid + "/register",
            method: "POST",
            data: nparams,
            header: header
        });
    },

    /**
     * 更新微信用户信息
     */
    udpateWxUserInfo(params) {
        var header = this.getHeader(true);
        var np = this.getDebug(params);
        return Taro.request({
            url: baseUrl + "/wx/user/" + appid + "/udpateWxUserInfo",
            data: np,
            header: header,
            method: "POST"
        });
    },

    /**
     * 用户考题
     */
    ykt(params) {
        var header = this.getHeader(true);
        return Taro.request({
            url: baseUrl + "/question/search",
            data: params,
            header: header
        });
    },

    // 答题
    yktAnswer(params) {
        var header = this.getHeader(true);
        return Taro.request({
            url: baseUrl + "/api/auth/ycs/answer",
            data: params,
            header: header
        });
    },

    /**
     * 结果分析
     */
    result(params) {
        var header = this.getHeader(true);
        return Taro.request({
            url: baseUrl + "/api/auth/ycs/answerend",
            data: params,
            header: header
        });
    },

    /**
     * 支付
     */
    payload(params) {
        var header = this.getHeader(true);
        return Taro.request({
            url: baseUrl + "/api/auth/get_pay",
            data: params,
            header: header
        });
    },


    /**
     * 支付
     */
    payloadReturn(params) {
        var header = this.getHeader(true);
        return Taro.request({
            url: baseUrl + "/api/auth/returnpay",
            data: params,
            header: header
        });
    },

    /**
     * 体质报告
     */
    rept(params) {
        var header = this.getHeader(true);
        return Taro.request({
            url: baseUrl + "/api/auth/ylb/report",
            data: params,
            header: header
        });
    },


    /**
     * 获取体质报告
     */
    accrept(params) {
        var header = this.getHeader(true);
        return Taro.request({
            url: baseUrl + "/api/ylb/docktor",
            data: params,
            header: header
        });
    },

    /**
     * 体质列表页
     */
    physicalList(params) {
        var header = this.getHeader(true);
        return Taro.request({
            url: baseUrl + "/api/ylb/list",
            data: params,
            header: header
        });
    },

    /**
     * 获取报告点击数
     */
    reportNum(params) {
        var header = this.getHeader(true);
        return Taro.request({
            url: baseUrl + "/api/auth/ycs/report_num",
            data: params,
            method: "POST",
            header: header
        });
    },

    /**
     * 分享按钮
     */
    shareBtn(params) {
        var header = this.getHeader(true);
        return Taro.request({
            url: baseUrl + "/api/auth/ycs/upd_sharenum",
            data: params,
            method: "POST",
            header: header
        });
    },
}