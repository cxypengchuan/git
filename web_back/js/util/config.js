// 配置文件
// 把这个项目中所有用到的接口地址全放在这里

// 所有接口的基地址
const BASEURL = 'http://192.168.1.118:8000'

// 用来保存所有的接口信息
const APILIST = {
    user_login: BASEURL + '/admin/login',
    user_logout: BASEURL + '/admin/logout',
    user_getInfo: BASEURL + '/admin/getuser',

    // 获取文章分类
    category_get: BASEURL + '/admin/category_search',
    // 添加文章分类
    category_add: BASEURL + '/admin/category_add',
    // 删除文章分类
    category_del: BASEURL + '/admin/category_delete',
    //编辑文章分类
    category_edit: BASEURL + '/admin/category_edit',
    //获取文章
    article_get: BASEURL + '/admin/search',

}
