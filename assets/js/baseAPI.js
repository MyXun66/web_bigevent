// 每次调用$.get()/$.post()/$.ajax()前都先调用此函数
// 这个函数中可拿到配置项
$.ajaxPrefilter(function (options) {
    // 在发送请求前拼接url
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // 统一为有权限的请求添加请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }

    // 全局统一挂载complete 回调函数
    options.complete = function (res) {
        //    res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空 token
            localStorage.removeItem('token')
            // 2. 强制跳转到登录页面
            location.href = './login.html'
        }

    }
})