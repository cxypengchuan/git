js函数-高阶函数

原创 凡人的进阶  凡人进阶  2019-11-06
学习JavaScript的童鞋都知道，js中的函数是一种很强大的存在：“函数是一等公民”。本文讨论了js中函数的几个特点，并就高阶函数的定义和应用给出一些基本的示例。

1 简介

本文介绍了js中函数的几个特点，并引出了高阶函数的概念，并利用高阶函数实现了两个小例子：

•定义一个只能被调用一次的函数？
•定义一个具有缓存功能的函数？

2 内容

•函数的几个特点
•高阶函数的概念
•高阶函数的两个小应用

3 函数的几个特点

3.1 定义函数的四种方式

定义函数的方式有很多种

// 1. 函数声明
function f(a,b) {return a + b;}

// 2. 函数表达式
var f = function(a,b) {return a + b}

// 3. 箭头函数
var f = (a,b) => a + b

// 4. 构造器
var f = new Function('a', 'b', 'return a + b');
3.2 把函数当作对象

在js中“一切皆对象”，函数也不例外。先来看下基本的函数的使用：

function f(p){
    console.log(p)
}
f();
这是一个标准的先定义函数，再调用函数的过程。一切是正常的。但是，如何理解如下的代码：

console.log(f.length)
从字面上看，它在访问f的length属性，它的执行结果是1。对于函数f来说，它确实有一个属性length,表示函数形参的个数。

那我们是否可以给函数添加其它的属性呢？答案是可以的。代码如下：

function f(p){
    f.counter++
    console.log(p)
}
// 添加属性
f.counter = 0;

// 添加属性
f.func = function(){
    console.log('func,'+this.counter)
}

// 调用函数
f();
console.dir(f)
console.log(f.counter);
f.func()
上面的代码中， 我们给函数f添加额外的属性counter和func。每调用这一个函数一次，就会自增一次被调用次数。


上图是打印出f后的结果，它的内容也是键值对格式的，看起来也与对象无异。

3.3 把函数当作实参

在js中，函数是可以当作实参的。例如：

function f(n){
    console.log(n)
}
function myFunc(func,m) {
    console.log('myFunc')
    func(m); // 执行传入的函数
}
myFunc(f,10);
上面的代码是可以正常工作的，在执行代码的过程中，myFunc这个函数中的形参func的值就是函数f。如果这段代码不太好理解，也可以换成这样：

// 改写成函数表达式的方式来定义函数f
// 你可以把f看作是一个变量，它的值就是函数
var f = function(n){
    console.log(n)
}

function myFunc(func,m) {
    console.log('myFunc')
    func(m); // 执行传入的函数
}

myFunc(f,10);
当然了，这种用法其实我们一直就在使用，例如我们经常使用的一些代码：

var arr = [];

// 数组的方法
arr.sort(function(){})
arr.forEach(function(){})

// jquery的入口函数
$(function(){})
// jquery中的ajax方法
$.get(url,function(res){} )
上面的代码中，都是把一个函数（具体来说是一个没有名字的函数）当作另一个函数的实参传入。

3.4 在函数内部再定义函数

在函数内部再定义函数也是一个比较常见的用法。

一个“没有什么作用”的示例如下：

function f() {
    function f_1 () {
        console.log("f_1")
    }
    
    f_1();
}
f();
在函数内部去定义一个函数在语法上是正确的。我们也来回顾一下一些常见的用法。

$(function f1(){
    document.getElementById("btn").addEventListener("click",function f2(){

    })

    $("#btn1").on("click",function f3(){

    })
})
在上面的代码中，我们在函数f1的内部定义并使用两个函数f2,f3。当然了，一般情况下， 我们不需要给事件响应函数（f1,f2,f3这三个函数）取名字。但还是有场景需要名字的，例如你想要removeEventListener[1]时，就需要具体的函数名。

3.5 把函数当作返回值

看代码：

function f() {
    var f1 = function(){
        console.log("f1")
    }
    return f1;
}
var rs = f();
rs();
// 或者是 f()();
上面的代码中，在函数f的内部又定义一个函数f1（为了降低理解的难度，代码中是通过函数表达式的方式来定义f1的，其它格式的定义也可以的。）在执行f()之后，rs 中保存是f1的函数体，所以它还可以继续加括号去调用 ，就是rs()。

这就是一个把函数当作返回值来使用的案例。

4 高阶函数的定义

高阶函数的英文是 “Higher-Order Function”。它是对其他函数进行操作的函数：把其它函数当作参数或返回值。简单来说，高阶函数：

•它也是一个函数
•它接收其它函数作为参数，或将其它函数作为返回值输出。

按这个定义来回顾上面的代码，其实好多地方都用上了高阶函数。

[1,2,3].forEach(function() {} ) ; // 把函数当作参数传入了forEach函数。
5 高阶函数的应用

一般的应用公式是：

var f_new  = 某高阶函数（f）
把原函数作为高阶函数的入参，并返回一个新函数，这个新函数较原函数有一些新的功能。下面我们来看一些例子。

5.1 定义一个只能被执行指定次数的函数

这里有一个函数f,默认情况下它可以被调用任意多次。

function f(){
    console.log("f")
}
f();
f();
f();
下面提点过份的要求：在不修改原函数f的基础上，产生一个新的函数f1：

•f1具备f的功能
•f1只能被调用2次

最朴素的想法是：

function f() { console.log('f') }
var counter = 0 ;
function f1() {
    counter++;
    if(counter >2){
        console.log("超过2次了")
    } else {
        f(); 
    }
}
这种写法就只能限制在f这个函数上，如何拓展到所有的函数呢，下面就要用到高阶函数啦。

function times (f, num = 2){
    var counter = 0 ;
    var f1 = function () {
        counter++;
        if(counter > num){
            console.log("超过"+num+"次了")
        } else {
            f(); 
        }
    }
    return f1;
}
上面的函数times接收两个参数，f表示要处理的函数，num表示最多允许f函数被调用的次数。它的返回值是一个新的函数。我们把times这个函数称为高阶函数以区别它和普通函数的区别哈。

完整的实现如下：

function f1() { console.log("f1") }
function f2() { console.log("f2") }

function times (f, num = 2){
    var counter = 0 ;
    var f1 = function () {
        counter++;
        if(counter > num){
            console.log("超过"+num+"次了")
        } else {
            f(); 
        }
    }
    return f1;
}
var f1_1 = times(f1,1); 
//f1_1具备了f1的功能，但只能被成功调用1次。

var f2_3 = times(f2,3); 
//f2_3具备了f2的功能，但只能被成功调用3次。
再进一步，如果f1这个函数是带参数的，又该如何处理？这就需要补上参数及当前上下文了。

function times (f, num = 2){
    var counter = 0 ;
    var f1 = function (...arg) {
        var that = this;
        counter++;
        if(counter > num){
            console.log("超过"+num+"次了")
        } else {
            f.apply(that,arg); 
        }
    }
    return f1;
}
注意两个地方：

•函数签名中的...arg 。这是es6中的新语法，用来把全部的实参收集到数组arg中。
•调用函数f时用到的f.apply(that,arg) 。它用来执行函数f，并把f内部要用到的this值设置为that，同时把arg中保存的参数传入。

5.2 带缓存功能的函数

缓存，通俗来讲是把某次运行的结果保存起来，方便下次直接返回。举个例子：我的英文不太好，经常要去查字典，第一天遇到了width不认识它，所以去查了一次，结果是"宽度"，第3天又遇到了width，又不记得了，所以再得再去查一次。

查询字典（width） ===> 宽度
如果这个查字典的功能是带缓存的话，它就应该记下我曾经查询过的单词。写个函数来模拟下哈。

下面一个字典，它只能查两个单词。

function dict(word){
    if(word === 'width'){
        // 省略查询过程
        return '宽度'
    } 
    else if(word === 'height'){
        return '高度'
    }
    else {
        return '不认识'+word
    }
}
console.log( dict('width') )  // 查一次
console.log( dict('width') )  // 还要查一次。
带缓存功能的函数的思路是：把查询的条件及查询的结果保存成键值对。基本步骤是：收到查询条件（函数的实参），检查缓存中是否有结果

•如果有：直接返回，不用再查了。
•如果没有：去查一次（执行函数体），保存信息到缓存中，返回查询结果。

具体见下代码：

// 缓存函数f的查询条件及结果
function cache(f){
    // obj对象就是缓存区
    var obj = { }
    return function(arg) {
        // 检查缓存
        if(obj[arg]){
            return obj[arg]
        } else {
            let rs = f(arg);
            obj[arg] = rs;
            return rs
        }
    }
    // 这里就有一个典型的闭包
}

function dict(word){
    if(word === 'width'){
        // 省略查询过程
        console.log("...省略查询过程")
        return '宽度'
    } 
    else if(word === 'height'){
        return '高度'
    }
    else {
        return '不认识'+word
    }
}
var f1 = cache(dict)

console.log( f1('width') )  // 查一次
console.log( f1('width') )  // 直接从缓存中取
注意，上面的示例只是一个基本的演示示例，离工具函数的要求还相去甚远。想进一步了解缓存函数，可以参考underscorejs库中的memoize[2]

6 小结

•js中的函数可以当作另一个函数的实参，作为函数的返回值。
•高阶函数也是一个函数，只不过它的形参或者返回值是函数。
•高阶函数的应用一般是在不改变原函数的情况下，通过定义一个工具函数把原函数当作一个入参数，去返回一个具备特殊功能的新函数。本文中只是列出几个小例子。类似的例子还有函数的防抖，节流，柯里化等，将会在后面介绍。