// 模块化式的开发 
// 把所有与用户相关的功能全写在一个对象中
//只做ajax动作
// $.post(),$.get(),$.ajax() 得到都是一个对象
// 这个对象上有then方法，then()的功能是获取返回的数据
// $.post( ).then(function(res){  res 就是接口返回的数据 })

const user = {
    // 用户登陆
    login(name, password) {
        return $.post(APILIST.user_login, {
            'user_name': name,
            'password': password
        })
    },
    // 用户退出
    logout() {
        return $.post(APILIST.user_logout)
    },
    // 获取信息
    getInfo() {
        return $.get(APILIST.user_getInfo)
    }
}
