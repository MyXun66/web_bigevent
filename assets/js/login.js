$(function () {
    // 注册连接
    $('#link_reg').on('click', function () {
        $('.login-box').hide().siblings('.reg-box').show();
    })
    // 登录连接
    $('#link_login').on('click', function () {
        $('.reg-box').hide().siblings('.login-box').show();
    })
    // 弹出框对象
    var layer = layui.layer
    // 输入框验证
    // layui获取form对象
    var form = layui.form;
    // 自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val();
            console.log(pwd);
            if (pwd !== value) {
                return '两次输入密码不同';
            };
        }
    })

    // 监听注册表单
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function (res) {
            if (res.status !== 0) {
                // return alert(res.message);
                return layer.msg(res.message)
            }
            // console.log("注册成功！");
            layer.msg("注册成功！请登录！")
            // 模拟点击
            $('#link_login').click();
        })
    })

    // 监听登录表单
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        // $.post('http://www.liulongbin.top:3007/api/login',{username:$('#form_login [name=username]').val(),password:$('#form_login [name=password]').val()},function(res){
        //     if(res.status!==0){
        //         // return alert(res.message);
        //         return layer.msg(res.message)
        //     }
        //     layer.msg("登录成功！")

        // })
        $.ajax({
            url: '/api/login',
            method: 'post',
            // 快速获得表单中的数据 前提是有name属性
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    // return alert(res.message);
                    return layer.msg(res.message)
                }
                layer.msg("登录成功！")
                // console.log(res.token);
                // 保存token
                localStorage.setItem('token',res.token);
                // 跳转到后台主页
                location.href = './index.html'
            }
        })
    })
})