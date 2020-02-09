// 把所有与文章分类相关的操作写在这里

const category = {
    // 获取
    get: () => $.get(APILIST.category_get)
    ,
    // 添加文章类型
    add: (name, slug) => $.post(APILIST.category_add, { name, slug })
    ,
    // 删除文章类型
    del: id => $.post(APILIST.category_del, id)
    ,
    // 编辑文章类型
    edit: (id, name, slug) => $.post(APILIST.category_edit, { id, name, slug })


}