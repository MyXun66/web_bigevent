$(function () {
    var layer = layui.layer;
    // 获取form对象
    var form = layui.form;
    initArtCaleList();
    // 获取文章分类列表
    function initArtCaleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    // 添加类别绑定点击事件,弹出对话框
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类类别',
            content: $('#dialog-add').html(),

        })
    })

    // 通过代理监听添加分类表单事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败！')
                }
                initArtCaleList();
                layer.msg('添加分类成功！');
                // 根据索引关闭弹出框
                layer.close(indexAdd);
            }
        })
    })
    // 为编辑绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // alert(11)
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类类别',
            content: $('#dialog-edit').html(),

        })

        var id = $(this).attr('data-Id')
        // 发起请求获取分类名
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    // 代理形式绑定修改类名事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                // 关闭弹出层
                layer.close(indexEdit);
                // 重新渲染列表
                initArtCaleList();
            }
        })
    })

    // 删除绑定事件
    $('tbody').on('click', '.btn-del', function () {
        var id = $(this).attr('data-id');
        // 提示是否删除
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！');
                    }
                    layer.msg('删除成功！');
                    layer.close(index);
                    // 重新渲染列表
                    initArtCaleList();
                }
            })


        });
    })
})