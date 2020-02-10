Promise 初使用

原创 凡人的进阶  凡人进阶  2019-12-09
promise初使用

promise是es6是新增的构造器，用来提供另一种异步代码的实现方案。本文介绍了Promise的基本使用，并给出了用它来改写异步回调函数的套路。

1 简介

本文介绍了Promise的构造器的使用语法，promise对象的三种状态及状态转换，并分析了其经典格式的执行流程，最后给出了用它来改写异步代码的套路，并予以实践。

你最好需要有一些ajax，箭头函数的基础这会理解更深一些。当然啦，也有可能你还没有需要用它们的时候。

2 主要内容

•什么是promise
•Promise构造器
•经典使用格式
•使用Promise改造回调函数
•小小面试题

3 什么是Promise

promise：承诺。

生活中它是用来表述 对将来要发生的事情的肯定。例如 ：高中生说，老师，我会考上一所好大学的；销售员说，老板，我一定会签下大单的；程序员说，老妈，我过年一定会带个女朋友回来的。

在ES6中，它是新增的构造器，用来优化实现异步操作。在没有它之前，javascript中的异步处理，大多是利用回调函数来实现的。

典型的几种如下:（1）setTimeout （2）ajax （3）nodejs中的文件读取

现在有了promise，就可以对这些异步操作进行改写了，当然了，改写嘛就是说之前的不好，有缺点所以要改。这里隐藏一个前提：先要知道它的坏处。不过，就算还没有能体会到坏处，那也可以先感受一下Promise的用法。例如在处理ajax请求时，在jquery.ajax方法和axios库中均提供了Promise格式的使用方式，例如：

基本的ajax方法如下：

$.ajax({
    url: '',
    data:{},
    success(res) {}
})
可以改写成

$.ajax({url, data}).then(res=>{})
即把success回调函数放在then中执行。

另外，如axios库，它本身就是基于promise的库，用法如下：

// 为给定 ID 的 user 创建请求
axios.get('/user?ID=12345')
.then(function (response) {
   console.log(response);
})
.catch(function (error) {
  console.log(error);
});
以上代码的来源axios-js[1]

那上面的.then.catch是写法是否给你带来困扰呢，学习完了本文的内容，你将会轻易写出如上的代码啦。

4 Promise构造器

在 ES6 中，用Promise来创建Promise类型的对象 。这一点就像使用new Array来创建数组。

4.1 Promise的格式

var p1 = new Promise(function(resolve,reject){
  // 执行异步代码
  // 调用resolve,或者reject
});
console.dir(p1)

要点：

•构造器必须要给定一个参数，如果不给就是会报错。例如，new Promise() 报错的信息是： Promise resolver undefined is not a function
•构造器的实参是一个函数，这个函数的特殊之处在于它有两个形参(resolve,reject)，这两个形参也是函数。在格式上，也可以采用箭头函数来改写。例如：var p1 = new Promise((resolve,reject)=>{})。
•在函数体的内部， 一般会执行异步代码，然后根据情况来调用resolve()或者是reject() 。调用resolve或者是reject后会产生什么样的后果，在后面小节介绍。当然了，再次强调一下resolve和reject只是形参名，可以改写成其它的。
•构造器中的函数体中的代码会立即执行。这一点非常重要：

执行如下代码

console.log(1)
var p1 = new Promise(function(resolve,reject){
  // 执行异步代码，
  // 调用resolve,或者reject
  console.log(2)
});
console.log(3)
会输出1,2,3。

4.2 Promise 的三种状态和值

一个Promise对象的状态可能是如下三种之一：pending,resolved,rejected 。下面分别介绍。

4.2.1 pending

pending。它的意思是 "待定的，将发生的"，相当于是一个初始状态。创建Promise对象时，且没有调用resolve或者是reject方法，相当于是初始状态。这个初始状态会随着你调用resolve，或者是reject函数而切换到另一种状态。

var p = new Promise((resolve,reject)=>{})
console.dir(p)
这个初始状态就是你对别人说出承诺的那个瞬间，此时，大家都不知道这个承诺是否能兑现，可能是世间求得双全法，不负如来不负卿；也可能是心比天高，命比纸薄。未来的事，谁知道呢？

4.2.2 resolved

resolved。表示解决了，就是说这个承诺实现了。要实现从pending到resolved的转变，需要在 创建Promise对象时，在函数体中调用了resolve方法(即第一个参数)。

var p = new Promise((resolve,reject)=>{ 
  resolved();
})
console.dir(p)
注意，上面的resolve和reject仅是形参名而已。

在chrome浏览器中的结果如下：




在firefox浏览器中的结果如下：


它们的值分别是resolved和fulfilled，稍有些区别。

4.2.3 rejected

rejected。拒绝，失败。表示这个承诺没有做到，失败了。要实现从pending到rejected的转换，只需要在创建Promise对象时，调用reject函数。

var p = new Promise((resolve,reject)=>{ 
reject();
})
console.dir(p)

4.2.4 三种状态小结

1.状态是可转化。

最初创建promise对象时，默认状态是pending，如果在函数体内部调用了第一个参数对应的函数，则状态变成了resolved；如果调用了第二个参数对应的函数，则状态变成了rejected。

 pending -----  resolve() --> resolved;
 pending -----  reject()  --> rejected;
2.状态转换是不可逆的。

一旦从pending ---> resolved（或者是rejected），就不可能再回到pending，也不能由resolved变成rejected。

4.3 promise的值

一个promise对象除了状态之外，还有promiseValue。在构造器中，这个值在调用resolve和reject方法时传入。

例如：

var p = new Promise((resolve,reject) => { 
  resolve(123); 
});
//  此时，prommise对象p的状态是 resolved，值是123。
console.dir(p)

var p = new Promise( (resolve,reject) => {
  reject(123); 
});
//  此时，prommise对象p的状态是 rejected，值是123
console.dir(p)

这里可以传递任意数据类型，上面是数值。

单独来看promise的值和状态似乎没有什么意义，它的使用场景在于结合promise对象的实例方法一起来用来。下面来看经典使用。

5 经典使用格式

var p1 = new Promise(function(resolve,reject){
    //异步操作 
    // resolve(obj1)
    //或者 reject(obj2)
});
p1.then(function(rs){
    // 如果p1的状态是resolved
    // 则then中的函数会执行，
    // 且obj1的值会传给rs
}).catch(function(rs){
    // 如果p1的状态是rejected
    // 则catch中的函数会执行，
    // 且obj2的值会传给rs
}).finally(function(){
    // 一定会执行的函数
})
在构造器的函数体中，一旦状态发生了变化，就会进行then，或者是catch中去，同时把promiseValue传入对应的函数。

具体来说：

•状态从pending变成resolved，进入then中，调用函数，并传入此时的promiseValue（就是调用resolve时传入的实参）
•状态从pending变成rejected，进入catch中，调用函数，并传入此时的promiseValue（就是调用reject时传入的实参）

执行流程图：


根据实际情况的需要，也可以不加上finally()。

6 使用promise改造回调函数

下面我们回到具体的问题。如何对现有的，通过回调函数来实现异步操作的代码进行改写。

基本步骤有三步：

第一步：建立模板。这里的模板是指固定的套路：写一个空函数，在函数体中的创建一个promise对象，并返回。

function fnName(){
    var p = new Promise((resolve,reject)=>{})
    return p;
}
当然， 如果使用箭头函数的话，还可以简化成这样：

let fnName = () => new Promise((resolve,reject)=>{})
第二步：把异步功能写入构造器中，根据实际来决定是否调用resolve,reject。

function fnName(){    
 var p = new Promise((resolve,reject)=>{
    // 这里写具体的代码，
    // 并在某个恰当的时机去调用resolve和reject函数。
 })    
 return p;
}

第三步：调用函数。

通过fnName().then().catch() 结构来调用这个函数，会在异步操作成功时挪then中的函数，在失败时执行catch中的函数。


下面来改写两个小dome。
6.1 示例1 ajax

原回调函数的写法

var xhr = new XMLHttpRequest();
xhr.open('get','http://httpbin.org/ip')
xhr.onload = function() {
    console.log(xhr.responseText)    
}
xhr.onerror = function (){
    console.log('请求接口错误')
}
xhr.send()
改写之后

let ajax = function() {
  return new Promise((resolve,reject)=>{
    var xhr = new XMLHttpRequest();
    xhr.open('get','http://httpbin.org/ip')
    xhr.onload = function() {
      resolve(xhr.responseText)
    }
    xhr.onerror = function (){
      reject('请求接口错误')
    }
    xhr.send()
  })
}
// 注意下面 then catch用法
ajax().then(res =>{
    console.log(res)
}).catch(err =>{
    console.log(err)
})
具体的参数封装并不没有

这里用到的接口http://httpbin.org/ip是从http.org[2] 上访问的，它的功能是返回你本机的ip地址。

6.2 示例2 nodejs中的文件读取

原来的写法

const fs = require('fs');

fs.readFile("1.txt", 'utf8', (err, data) => {
    if (err) {
        reject(err);
    } else {
        resolve(data);
    }
});
改写之后

const fs = require('fs');
function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

readFile('./server.js1')
.then(rs => {
   console.log(rs);
 })
 .catch(err => {
   console.log('err', err);
 })
7 小小的面试题

代码填空，并完成指定功能。

function sleep(time){
   // 请写出你的代码
}

sleep(2000).then(()=>{
    console.log("后续操作")
})
console.log(2);
目标是让sleep 的功能与setTimeout一样：就是等2000毫秒之后再执行后续操作。

参考代码如下：

function sleep(time){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
        resolve()
    }, time)
  });
}
8 小结

本文介绍了Promise的基本用法，并分析了promise经典格式的执行流程，最后给出了用promise去改写异步代码的套路，并予以实践，掌握这些，就应该可以简单用起来了吧。



关于它的链式写法，以及解决回调地狱的问题在下篇说明。



版权信息：凡人进阶。转载请标明出处。如果对您有帮助，您可以：

•转发他人。小额打赏。关注本号。

References

[1] axios-js: [http://www.axios-js.com/zh-cn/docs/#%E6%A1%88%E4%BE%8B](http://www.axios-js.com/zh-cn/docs/#案例)
[2] http.org: http://httpbin.org/