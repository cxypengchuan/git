js-进阶 call的使用及模拟实现

原创 凡人的进阶  凡人进阶  2019-11-24
本文介绍了call的使用方法及应用场景，最后给出了其模拟实现方法。

1 简介

本文介绍了call的使用方法及应用场景，并在最后给出模拟实现的方法。

在模拟实现的部分中用到了es6中函数的剩余参数及数组的拓展运算符，需要你具备这些基础。

2 内容

•基本介绍
•应用场景
•实现原理

3 基本介绍

3.1 作用

用指定的对象来替换修改函数内部的this，并执行这个函数。

3.2 格式

函数.call(newObj, 参数1, 参数2, ...参数n)
参数：
 newObj         : 用newObj替换函数中的this
 参数１...参数n  : 函数自身需要的参数。
3.3 示例

(1)不带参数的情况

function f(){
    console.log(this.name)
}
var obj1 = {name:"a"}
var obj2 = {name:"b"}
f.call(obj1); // a
f.call(obj2); // b
执行函数f,并使用obj1,obj2来代替其中的this。

(2)带参数的情况

function f(a,b){
    console.info(this.name, a,b)
}

var obj1 = {name:"a"}
var obj2 = {name:"b"}
f.call(obj1,1,2); // a 1 2 
f.call(obj2,3,4); // b 3 4
3.4 call从哪里来？

下面我们来具体分析一下代码。为什么 f.call可以使用？

function f(){
    console.log(this.name)
}
var obj1 = {name:"a"}
f.call(obj1)
分析：

f是一个函数，也是一个对象，它的构造器是Function,可以通过f.__proto__ === Function.prototype验证这一点。由于f也是属性的集合,那么call是不是它的属性呢？

var f = function(){}
f.hasOwnProperty("call") // false
证明call不是它的自有属性。但按原型链的规则，接下来它会去__proto__属性中去继续找call:

var f = function(){}
f.__proto__.hasOwnProperty("call") //true
所以函数f可以使用call属性。

进一步说， call属性是f.__proto__的自有属性，就相当于是Function.prototype的自有属性。

Function.prototype.hasOwnProperty("call") //true
所以，我们现在可以知道，只要是function，就都可以使用call函数（当然了，不涉及箭头函数哈）。

4 call的应用场景

它其实可用作代码的一个比较好巧妙的设计方式：一个独立的函数，并不属于任何对象，但是，它却可以临时借给其它对象用一下，在使用的过程中，这个函数内部的this就是这个对象。

4.1 Object.prototype.totString.call

一个比较经典的应用是判断变量的数据类型。
console.log(Object.prototype.toString.call("1"))
//  [object String]
console.log(Object.prototype.toString.call(1))
//  [object Number]
console.log(Object.prototype.toString.call(false))
//  [object Boolean]
console.log(Object.prototype.toString.call([]))
//  [object Array]
console.log(Object.prototype.toString.call({}))
//  [object Object]
console.log(Object.prototype.toString.call(function(){}))
//  [object Function]
说明如下：

（1）Object是一个对象，它有一个属性是prototype。这个属性的值又是一个对象，在Object.prototype这个对象中有一个属性叫toString，特殊地，它是一个方法。由于它是一个function，则它可以使用call。

（2）从格式上来看：Object.prototype.toString这个函数借给对象f用一下。会调用Object.prototype.toString函数 ，同时，用f去代替函数内部的this。

（3）Object.prototype.toString的返回值是字符串，并不是数组(只是看起来前后有[ ] )。它的返回结果是固定格式的：[object 当前对象的构造器的名字]。



所以，我们可以根据它来确定当前的数据的类型。

4.2 把类数组转成数组

类数组不是真正的数组，它只是看起来像数组。如果你的网页中有很多个li标签，则通过document.getElementsByTagName('li')，你就会得到一个类数组啦。

那如何把它转成数组呢？方法之一是：借用array中的slice方法。

先介绍一下slice方法，它的格式是：
var 新数组 = 数组.slice(起点下标，终点下标）
返回值是一个新数组。它的构成是数组中包含起点，不包含终点的部分。特殊地，如果不给参数，相当于是对数组进行一次浅拷贝。

思路：借用Array.prototype.slice方法。

var arr = Array.prototype.slice.call(lis)


做两件事情：

（1）会执行slice方法，不给参数。

（2）把slice中的this换成lis。



当然了，如果用eS6的Array.from()会简单的多。

5 模拟实现

目标：

function f(a,b){
    return this.value + a + b;
}
var obj = {value:100}
var rs = f._call(obj, 1, 2);
console.log(rs); // 103
上面的_call就是我们要模拟实现的目标。

思路：

1.给Function.prototype上添加_call方法，这可以让所有的函数都具备调用_call的能力。
2.在执行f._call(obj)时，当作obj.f()去调用。这样的话，f中的this就不自然换成obj了么？具体的做法是给obj对象添加一个方法，这个方法的函数体就是当f的函数体。如下：

大致思路如下：

var obj = {
    value: 100,
    f:function(a,b){
        return this.value + a + b
    }
}
obj.f(1,2); // 103
相当于给obj添加了一个属性，为了不污染obj对象，我们可以在执行完成之后再去删除这个属性。

你可以先想一想。



附参考代码及说明如下：

// 第一个参数是对象。
// 其后的参数最终会变成函数f的实参
// 由于不知其个数，所以以剩余参数格式收集在arg
// 这里的arg就是函数的剩余参数。
Function.prototype._call = function(obj ,...arg) {
  // 安全处理
  obj = obj || window

  // 给obj添加属性，其值是调用_call的那个函数
  obj.fn = this;

  // 执行函数，并传入参数
  // 这里用到了es6中的数组拓展运算符
  var rs = obj.fn(...arg);

  // 删除obj上的这个属性
  delete obj.fn

  // 返回值
  return rs
}

function f(a,b){
  return this.value + a + b
}

console.log(  f._call({value:100},1,2) )
// 103
说明如下：

•执行f._call()时，在_call内部的this就是f。在删除fn时，并没有考虑有可能在obj对象上会有一个fn属性的情况下，好在只是为了说明原理，大家不必在意哈

6 小结

本文介绍了call的基本使用方法及应用场景，并在最后给出模拟实现的方法。