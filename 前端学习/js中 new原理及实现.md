js中 new原理及实现

原创 凡人的进阶  凡人进阶  2019-11-20
在js中，我们通过new运算符来创建一个对象，它是一个高频的操作。我们一般只是去用它，而很少关注它是如何实现的，它的工作机制是什么。

1 简介

本文介绍new的功能，用法，补充介绍不加new也同样也创建对象的方式，分析了new的原理，最后模拟了new的实现。

学习本文内容需要你了解js中对象，原型链,call,bind,arguments的用法。

2 内容

•基本用法
•不写new也能创建对象
•new原理
•模拟new的实现

3 new 的基本用法

我们通过new来创建对象，它的基本格式是：

var 对象 = new 函数([参数])
这里的函数可以是内置构造器，也可以是用户自己定义的函数。

例如：

var arr = new Array ();
此时，arr将可以使用Array.prototype上的全部方法。关于原型链你可以看看这里。

更一般的情况，我们会使用自己定义的构造器。

function F(name,age){
    this.name = name;
    this.age = age
}
F.prototype.hello = function(){
    console.log(this.name,this.age)
}

var f1 = new F('curry', 30);
console.log(f1)
f1.hello()

对如上的代码有几点说明如下：

•函数F 在被调用的过程中，在前面加 new ，所以这个函数是被当作构造器来使用了。
•f1之所以可以调用 hello方法，也是因为原型链的缘故。

3.1 构造器的返回值

一般来讲，如果你要把一个函数当做构造函数来使用，在这个函数的内部是不应该去设置返回值的。但是，如果它设置了返回值呢？

先说出答案如下：

•return后面跟着不是对象，就会不管return语句，返回this对象；
•return后面跟着一个对象，new会返回return语句指定的对象；

先来看构造器中，return后面跟着不是对象的情况。

var Vehicle = function () {
  this.price = 1000;
  return 1000;
};

(new Vehicle()) === 1000// false
上面代码中，构造函数Vehicle的return语句返回一个数值。这时，new命令就会忽略这个return语句，就当它不存在，还是正常返回“构造”后的this对象。

但是，如果return语句返回的是一个对象，new命令会返回这个新对象，而不再是this对象，这一点需要特别引起注意。

var Vehicle = function (){
  this.price = 1000;
  return { price: 2000 };
};

(new Vehicle()).price
// 2000
上面代码中，构造函数Vehicle的return语句，返回的是一个新对象。new命令会返回这个对象，而不是this对象。

4 不加new也能创建对象吗？

对上面的代码，我们稍微改一下,在使用构造器时，故意去掉new这个关键字。如下：

function F(name,age){
    this.name = name;
    this.age = age
}

var f1 = F('curry', 30); // 不加new 
console.log(f1)
此时，我们把F当作一个普通的函数来调用，由于在函数F内部并没有明确写出return语句，所以f1的值是undefined。同时上面的代码还会有另一个隐藏的后果：在执行F时，由于this的值是指向window，所以上面的代码还会给window对象添加两个属性。如下：


那么问题来了，如何确保这个F只能被用作构造器，而不能当作普通函数来用呢？

两种解决思路：

•如果不加new就报错。
•如果不加new就偷着给你加上。

4.1 构造函数内部使用严格模式

为了保证构造函数必须与new命令一起使用，一个解决办法是，构造函数内部使用严格模式，即第一行加上use strict。这样的话，一旦忘了使用new命令，直接调用构造函数就会报错。

function F(name,age){ 
    'use strict'; // 这句新加的
    this.name = name;
    this.age = age
}

var f1 = F('curry', 30); // 不加new
console.log(f1)
上面的代码会报错，错误是Uncaught TypeError: Cannot set property 'name' of undefined 。因为在函数内部开启了严格模式之后，函数内部的this将不会默认指向window,它的值会是undefined。

一旦代码报错了，相当于提醒你必须给加上new，你就自己给它加上吧。

4.2 自动加上new

还可以在构造函数内部判断，当前调用是否使用new命令，如果发现没有使用new，则直接返回一个实例对象。

function F(name,age){ 
  // 如果没有用new，this就不会是F的实例
  if (!(this instanceof F)) {
    return new F(name,age);
  }
  this.name = name;
  this.age = age
}

var f1 = new F('a','30');
var f2 = F('b','30');
console.log(f2)
上面代码中的构造函数，不管加不加new命令，都会得到同样的结果。如下：


5 new 原理

使用new命令时，在构造函数内部依次执行下面的步骤。

•第一步：创建一个空对象，作为将要返回的对象。
•第二步：将这个空对象的原型指向构造函数的prototype属性。这一步的作用是让这个对象能沿着原型链去使用构造函数中prototype上的方法。
•第三步：将这个空对象赋值给构造函数内部的this关键字，执行构造函数。这一步的作用是让构造器中设置在this上的属性最终设置在这个对象上。
•第四步：返回这个对象。

以如下代码为例：

function F(name,age){ 
  this.name = name;
  this.age = age
}
F.prototype.hello = function(){
    console.log(this.name,this.age)
}
var f = new F('a','30');
则上面四步的伪代码如下：

第一步：var obj = {}

第二步：obj.__proto__ = F.prototype

第三步：F.apply(obj,参数)

第四步：return obj

下面模拟一下new的实现。由于new是一个关键字，我们写一个单独的函数_new来模拟，最终的目标是：

function F(name,age){ 
  this.name = name;
  this.age = age
}

F.prototype.hello = function(){
    console.log(this.name,this.age)
}
// 使用模拟new,
var f1 = _new(F,'a',30);
//  希望达到与new F('a',30)一致的效果
f1.hello();
你可以先想一想， 如何实现_new哈。

下面是一个参考实现：

function _new() {
  var obj = {}
  // arguments获取调用_new时所传入的实参
  // 它并不是一个真正的数组。
  // 我们约定，调用_new时，
  // 所传入的第一个元素是构造器

  // shift作用:
  // 1.取出数组的第一个元素（构造器）
  // 2.同时它会修改数组
  var constructor = [].shift.call(arguments);

  // 保持原型链
  obj.__proto__ =  constructor.prototype;

  // 调用构造器，并将内部的this用obj来代替。
  // 此时arguments是取出第一个元素后的部分
  var rs = constructor.apply(obj, arguments);

  // 兼容处理一下返回值
  return typeof rs === 'object' ? rs : obj;
};
6 小结

本文介绍javascript 中 new的格式、原理及模拟实现。