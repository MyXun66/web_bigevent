// 每次调用$.get()/$.post()/$.ajax()前都先调用此函数
// 这个函数中可拿到配置项
$.ajaxPrefilter(function(options){
    // 在发送请求前拼接url
    options.url = 'http://www.liulongbin.top:3007'+options.url
})