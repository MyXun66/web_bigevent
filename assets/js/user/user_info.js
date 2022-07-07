$(function () {
    // 调用函数初始化用户基本信息
    initUserInfo();
    // 提示信息对象
    var layer = layui.layer;
    // 自定义表单验证
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间!';
            }
        }
    })
    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }
                //   使用form.val('filter', object);为表单快速赋值
                form.val('formUsrtInfo', res.data)
            }
        })
    }
    // 重置表单数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })

    // 监听表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 发请求
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')
                // 调用父页面重新渲染头像
                window.parent.getUserInfo();
            }
        })
    })
})