$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 获取分类
    initCate()

    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

    }
    // 定义补0方法
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义查询的参数对象，将来请求数据时，将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码，默认请求第一页
        pagesize: 2,//每页显示的数据
        cate_id: '',//文章分类的id
        state: '',//文章状态
    }
    initTable();


    // 获取文章列表数据方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })


    }

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }

    // form绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 将数值填充到q
        q.cate_id = cate_id;
        q.state = state;
        // 根据筛选条件 重新渲染表格
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        //执行一个laypage实例,渲染分页结构
        // 1点击页码触发jump
        // 2只要调用laypage.render就会触发jump
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示条数
            curr: q.pagenum,//默认被选中的页面
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时触发
            jump: function (obj, first) {
                // 最新的页码值赋值到q
                q.pagenum = obj.curr;

                // 把最新每页条目数赋值给q
                q.pagesize = obj.limit;

                // 通过first的值可以判断那种方式触发jump
                // first为true,证明是方式2
                //  first为false时证明是方式1
                if (!first) {
                    //do something
                    // 根据最新的q渲染表格
                    initTable()
                }

            }
        });
    }

    // 绑定删除
    $('tbody').on('click', '.btn-del', function () {
        // 获取删除按钮的个数
        var len = $('.btn-del').length;
        var id = $(this).attr('data-id');

        // 弹出询问框
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    // 当前数据删除完成后，需要判断当前页面中是否还有数据
                    // 若没用，则页码-1后在渲染页面
                    if (len === 1) {
                        // 证明删除完毕后页面上没用任何数据
                        // 页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })

            layer.close(index);
        });
    })

    // 编辑绑定点击事件
    $('tbody').on('click','.btn-edit',function(){
        // 跳转编辑页面
        var id = $(this).attr('data-id');
        location.href = '/article/art_edit.html?id='+id
    })
})