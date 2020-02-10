Promise-链式用法

原创 凡人的进阶  凡人进阶  2019-12-11
本文重点分析了promise的链式用法。

1 简介

本文介绍promise对象的then,catch,finally方法及链式用法。重点介绍了then的使用方式以及对链式调用的执行过程。



如果你对promise不是很了解，可以先查看 promise初级 。

2 主要内容

•then的参数及执行逻辑
•then的返回值
•catch
•finally
•链式调用的逻辑

3 Promise实例的方法

在js中，对象会从它的构造器的原型对象中继承方法。例如：

var arr = new Array();
arr.push();
上面的push方法其实是Array.protoType中的属性。

arr.push === Array.protoType.push ; // true
同样的道理，一个promise对象也会从Promise.prototype中继承方法。


•then()
•catch()
•finally()


4 then的格式及执行逻辑

then方法的作用是为Promise对象添加状态改变时的回调函数。下面从其调用格式，执行逻辑及返回值三个方面来介绍

4.1 then的格式

它可以写两个参数，如下：

// p 是一个promise对象
p.then(函数1[,函数2])
它的两个参数都是函数。

•第一个参数是resolved状态的回调函数。当p的状态从pending变成了resolved之后，函数1会执行。
•第二个参数是rejected状态的回调函数。当p的状态从pending变成了rejected之后，函数2会执行。
•其中第二个参数是可选的，如果只写一个参数的话就是如下:

promise对象.then(函数1)
4.2 执行逻辑

以如下代码为例

var p = new Promise((resolve,reject)=>{
   resolve(val1);
   // or reject(val2)
})

p.then((okVal)=>{
    console.info("成功");
    console.log(okVal);
}, (errVal)=>{
    console.info("失败");
    console.log(errVal);
})

它的两个参数都是函数，其执行逻辑是:

•如果promise对象的状态是resolved，则then()会执行第一个函数，并传入当前的PromiseValue（即上面的val1）;
•如果promise对象的状态是rejected，则then()会执行第二个函数，并传入当前的PromiseValue（即上面的val2）;
•特别地，如果promise对象的状态是rejected，且此时then方法并没有设置第二个参数，就会向外抛出一个错误，错误的提示大约是Uncaught (in promise)。

示例代码1

var p = new Promise((resolve,reject)=>{
    //主动调用resolve，并传入1
    resolve(1)
})
// 此时，P的状态是resolved，
// 且值promiseValue 是1
p.then((res)=>{
   // p的状态是resolved，执行then的第一个参数
   // 把promisevalue传进来
   console.log("then,ok",res)
})
执行输出结果是：then,ok,1

示例代码2

var p = new Promise((resolve,reject)=>{
 //主动调用reject，并传入实参2
   reject(2)
})
// 此时，P的状态是rejected，且值promiseValue 是2.
p.then((res)=>{
   // p的状态是resolved
   // 所以这句代码不会执行。
   console.log("then,ok",res)
},(err)=>{
 // p的状态是rejected
 // 执行then的第二个参数
 // 并把promisevalue传进来。
    console.log("then,err",err)
})
执行输出结果是：then,err,2

4.3 then的返回值

then()方法的返回值也是一个promise对象，所以它支持链式写法。但是要注意的是它的返回值是一个新的promise对象，与调用then方法的并不是同一个对象。

看下如下代码：

var p1 = new Promise(()=>{});
var p2 = p1.then(function f_ok(){}, 
    function f_err(){}
); 
// p2也是一个promise对象。

console.log(p1 === p2); // false
如上代码可以说明p1.then()的结果是一个与p1不同的promise对象。



换句话说，then()会封装一个全新的promise对象p2。那既然 p2也是一个promise对象，那么，p2的状态（promiseStatus）和值(promiseValue)分别是什么？



规则如下：

如果p1的状态是pending,则p2的状态也是pending。

•如果p1的状态是resolved，then()会去执行f_ok，则p2的状态由f_ok的返回值决定。

•如果f_ok返回值不是promise对象，则p2的状态是resolved，且p2的promiseValue就是f_ok函数的return值。
•如果f_ok返回值是一个promise对象，则p2的状态及promiseValue以这个promise对象为准。
•如果f_ok这个函数内部发生了错误（或者是用户主动抛出错误），则p2的状态是rejected，且p2的promiseValue就是这个错误对象。

如果p1的状态是rejected，then()会去执行f_err，则p2的状态由f_err的返回值决定。

•如果f_err返回值不是promise对象，则p2的状态是resolved，且p2的promiseValue就是f_err函数的return值。
•如果f_err返回值是一个promise对象，则p2的状态及promiseValue以这个promise对象为准。

•如果f_err这个函数内部发生了错误（或者是用户主动抛出错误），则p2的状态是rejected，且p2的promiseValue就是这个错误对象。



示例代码1

p1与p2的状态相同。

var p1 = new Promise(()=>{});
var p2 = p1.then(function f_ok(){}, function f_err(){}); 
// p2也是一个promise对象。
console.dir(p1);
console.dir(p2);

示例代码2



var p1 = new Promise((resolve,reject)=>{ 
  resolve()
});
var p2 = p1.then(function f_ok(){
   return 1
}, function f_err(){}); 
// p2也是一个promise对象。
console.dir(p1);
console.dir(p2);

p2的状态及值由f_ok来决定。 


特殊地，如果f_ok()中并没有return语句，则相当于是 return undefined。

示例代码3

f_ok返回一个全新的promise对象，则p2的状态及值由这个Promise对象来定。

var p1 = new Promise((resolve,reject)=>{ resolve()});
var p2 = p1.then(function f_ok(){
    var temp = new Promise((resolve,reject)=>{ resolve({a:1}) }); 
    return temp;
}, function f_err(){});

console.dir(p2);

示例代码4

f_ok()中故意出错，则导致p2的状态是rejected，值就是错误对象。

var p1 = new Promise((resolve,reject)=>{ resolve()});
var p2 = p1.then(function f_ok(){
    console.log(abc);// 这里故意犯错
}, function f_err(){});

console.dir(p2);

示例代码5



var p1 = new Promise((resolve,reject)=>{ reject(100)});
var p2 = p1.then(function f_ok(){

}, function f_err(errVal){
  var temp = new Promise((resolve,reject)=>{ 
    resolve({b:errVal}) 
  }); 
  return temp;
});

console.dir(p2);

示例代码6



var p1 = new Promise((resolve,reject)=>{ reject(100)});
var p2 = p1.then(function f_ok(){

}, function f_err(errVal){
    throw new Error("aaa")
}); 
console.dir(p2)

5 catch

5.1 catch()的格式及用法

Promise.prototype.catch 是 Promise.prototype.then(null, reject)的别名，用于指定当promise对象的状态从pending变成rejected的回调函数 。

var p1 = new Promise((resolve,reject)=>{
    reject('s')
});

p1.catch(function(err){
    console.log(err);
})

// 与下面的代码等价
p1.then(null, function(err){
    console.log(err);
})
单独使用catch没有什么意义，它一般与then一块使用。如下：

new Promise((resolve,reject)=>{

}).then(function(result){
    // 如果promise对象的状态是resolved的，就会到这里来，并且result会接收promiseValue的值
}).catch(function(err){
    // 如果promise对象的状态是rejected的，就会到这里来，并且err会接收promiseValue的值
})

// 上面的代码如何拆分来写的话，等价于：
var p1 = new Promise((resolve,reject){

});
var p2 = p1.then(function(result){

});
var p3 = p2.catch(function(err){

})
5.2 catch的返回值

catch的返回值仍是一个promise对象，确定它的值的方式与then(null,(errVal)=>{ })的方式一致。

6 finally()方法

Promise.prototype.finally() ，无论Promise的状态是resolved，还是rejected都会执行其中的回调函数（如果状态是pending的话，是不会执行的）。它的返回值还是一个promise，且保留了原promise对象的状态和值。

var p1 = new Promise((resolve,reject)=>{ resolve(100)})
var p2 = p1.finally(()=>{console.log('finally')})
console.log(p1);
console.log(p2);
console.log(p1 === p2)
注意：（1）它的回调函数是没有执行的，不论该promise最终是fulfilled还是rejected，都会执行。（2）finally不改变promise的状态。


7 promise的链式调用

由于then,catch这两个方法的返回值都是promise对象，所以，它们很自然就可以链式调用了。 下面通过几个题目来分析一下链式调用的执行逻辑。
7.1 示例1

function do1() {
    console.log("任务1");
}
function do2() {
    console.log("任务2");
}
function do3() {
     console.log("任务3");
}
function do4() {
    console.log("任务4");
}

var p = new Promise((resolve,reject)=>{ resolve()})
p.then(do1)
 .then(do2)
 .then(do3)
 .then(do4);
结果输出是:任务1，任务2，任务3，任务4

var p1 = p.then(do1);
var p2 = p1.then(do2)
var p3 = p2.then(do3)
var p4 = p3.then(do4)
第一步：由于p的状态是resolved,所以p.then(do1)中，do1函数会执行。输出任务1。

第二步：确定p1的状态。按前面关于then的部分的介绍，p1的状态由do1()来决定。因为do1并没有明确指定返回值，则返回值就是undefined. p1的状态就是resolved。

第三步：由于p1的状态是resolved，所以p1.then(do2)会继续执行do2。输出任务2 ，且p2的状态由do2来决定。与第二步的分析相同，p2的状态仍是resolved。

第四步：接下来看p3。由于p2的状态是resolved，所以p2.then(do3)会继续执行do3。输出任务2 ，且p3的状态由do3来定，仍是resolved。

最后：p3.then(do4)。由于p3的状态是resolved，所以执行do4。输出任务4 。

7.2 示例2

function do1() {
    console.log("任务1");
}
function do2() {
    console.log("任务2");
}
function do3() {
     console.log("任务3");
}
function do4() {
    console.log("任务4");
}

var p = new Promise((resolve,reject)=>{ resolve()})
p.then(do1)
 .then(do2)
 .catch(do3)
 .then(do4);
上面的代码的执行结果是：任务1, 任务2, 任务4。我们先把过程分解一下，多添加几个中间变量来描述它们的值：

var p1 = p.then(do1);
var p2 = p1.then(do2)
var p3 = p2.catch(do3)
var p4 = p3.then(do4)
分析如下：

第一步：由于p的状态是resolved,所以p.then(do1)中，do1函数会执行。输出任务1。

第二步：确定p1的状态。按前面关于then的部分的介绍，p1的状态由do1()来决定。因为do1并没有明确指定返回值，则返回值就是undefined. p1的状态就是resolved。

第三步：由于p1的状态是resolved，所以p1.then(do2)会继续执行do2。输出任务2 ，且p2的状态由do2来决定。与第二步的分析相同，p2的状态仍是resolved。

第四步：接下来看p3。由于p2的状态是resolved，所以它并不会执行do3， p3的状态没有变化，仍保持p2的状态：resolved。

最后：p3.then(do4)。由于p3的状态是resolved，所以执行do4。输出任务4 。

7.3 示例3

function do1() {
    console.log("任务1");
    console.log(abc); //故意犯错
}
function do2() {
    console.log("任务2");
}
function do3() {
     console.log("任务3");
}
function do4() {
    console.log("任务4");
}

var p = new Promise((resolve,reject)=>{ resolve()})
p.then(do1)
 .then(do2)
 .then(do3)
 .catch(do4);
上面的代码的执行结果是：任务1, 任务4。我们先把过程分解一下，多添加几个中间变量来描述它们的值：

var p1 = p.then(do1)
var p2 = p1.then(do2)
var p3 = p2.then(do3)
var p4 = p3.catch(do4)
分析如下：

第一步：由于p的状态是resolved,所以p.then(do1)中，do1函数会执行，输出任务1，同时由于这里有段错误代码，所以p1的状态就是rejected。

第二步：由于p1的状态是rejected，所以p1.then(do2) 就不会执行do2，同时p2的状态也是rejected。

第三步：对p3的分析也是如此。

第四步：p3的状态是rejected，所以会执行do4。

7.4 示例4 传参

function increment(value) {
    return value + 1;
}
function doubleUp(value) {
    return value * 2;
}
function output(value) {
    console.log(value);// => (1 + 1) * 2
}
var p = Promise.resolve(1);
p.then(increment)
 .then(doubleUp)
 .then(output)
上面代码的输出结果是 4。

拆分 之后，分析如下：

// 状态：resolved; promiseValue: 1
var p = Promise.resolve(1); 

// p的状态是resolved; 
// 在执行then的第一个参数，即increment时
// 把p的 promiseValue 1 传入
// increment执行后的返回值就是2
// p1的状态是resolved,promiseValue是2 
var p1 = p.then(increment); 

// p1的状态是resolved; 
// 在执行then的第一个参数，即doubleUp时
// 把p1的promiseValue 2传入
// doubleUp执行后的返回值就是4
// p2的状态是resolved,promiseValue是4
var p2 = p1.then(doubleUp); 

// p2的状态是resolved,promiseValue是4
// 在执行then的第一个参数，即output时
// 把p2的promiseValue传入，就是4
var p3 = p2.then(output) ;
8 小结

本文介绍了promise对象的三个原型方法，重点分析了then方法的参数执行逻辑及返回值，最后分析了promise对象链式用法的执行步骤。希望对你有帮助。

版权信息：凡人进阶。转载请标明出处。如果对您有帮助，您可以：