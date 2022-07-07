$(function () {
    var layer = layui.layer;
    // 调用函数获得用户基本信息
    getUserInfo();
    $('#btnLogout').on('click', function () {
        console.log('ok');
        // 提示用户是否确定退出
        layer.confirm('是否确定退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清除token
            localStorage.removeItem('token');
            // 调至首页
            location.href = './login.html';
            layer.close(index);
        });
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // // headers请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 渲染用户头像
            renderAvatar(res.data);
        },
        //  不论成功还是失败，最终都会调用 complete 回调函数
        // complete: function (res) {
        //     // console.log('执行了 complete 回调：')
        //     // console.log(res)
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1. 强制清空 token
        //         localStorage.removeItem('token')
        //         // 2. 强制跳转到登录页面
        //         location.href = './login.html'
        //     }
        // }
    })
}
// 渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    // console.log(name);
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 按需渲染头像
    if (user.user_pic !== null) {
        // 渲染自定义头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}