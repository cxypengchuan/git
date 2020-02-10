js 进阶 原型与原型链

原创 凡人的进阶  凡人进阶  2019-11-17


原型链是javascript中非常重要的概念，它是js中实现继承功能的基础，也是面试，考试经常会涉及的问题。

1 介绍

本文介绍了原型链的作用及工作原理。

2 内容

一切皆是对象；对象是由函数创造的；原型与原型链。

3 一切皆是对象

这句话是说我们在js中接触的数据大多都是对象，具有对象的特征。下面我们来展开说明一下，如何理解“一切皆对象”。

3.1 函数是对象

我们来审视一下我们日常定义的函数：

var f = function () {}
// 调用函数
f(); 
// 给函数添加属性
f.abc = 100; 
// 给函数添加属性
f.f1 = function(){}; 
console.dir(f)
上面的代码中，我故意把给f添加了两个属性abc,f1 ，代码在语法并没有任何错误。输出内容如下（使用chrome浏览器）


从上图你可以看出，f这个函数也有很多的属性：

•abc, f1 是我们自行添加的属性。
•arguments, caller,length,name,prototype,__proto__是它自己就有的属性。

你看，对于我们定义的函数也可以理解成对象，是吧。

3.2 构造器是对象

来看看平时使用的内置构造器

// 定义数组：构造器方式
var arr = new Array();
// 定义数组，字面量方式
var arr = []
// 输出构造器
console.dir(Array)
结果如下图


可以理解isArray就Array这个对象的属性（更准确的说是一种特殊的属性：方法），所以你可以通过 Array.isArray()来访问。



其它的数据类型：数组，dom对象等等，大家可以自己去console.dir()看一下。

4 对象是由函数创建的

在js中，当我们谈及一个函数时，其实我们并不是特别确定在说什么，因为函数的角色有两种。

•基础功能。作为一个封装功能，提炼代码的工具。
•类的功能。一个函数可以在前面加上 new 以当作构造器来使用。

下面来看一些常见的创建对象的代码

var arr = new Array();
var fn  = new Function();
var obj = new Object();
上面的三行代码中，我们均采用new 构造器()的方式来创建对象，而构造器（Array,Function,Object等）本来就是函数。注意，在实际开发中我们更常用的会使用字面量的方式去创建它，这里只是做演示。

更一般的情况，我们看自定义的函数当构造器来使用的情况：

function F () {}

// 当作普通函数来使用
var rs =  F();

// 当作构造器来使用
var f1 = new F();
好的，如果你认可了: 一切皆是对象，对象是函数创建的 这两个命题，那么接下来，我们就要去开始一段漫长的寻找之旅：寻找创建这个对象的构造器。

4.1 寻找构造器

对于某一个对象obj来说，如何才能找到创建出它的那个构造器呢？公式如下：

对象.__proto__.constructor
理解如下：对象.__proto__ 是取出对象的__proto__属性。我们知道对象是集合的无序集合，那么这些个众多的属性之中就有一个名为__proto__的属性。那我们再把对象.__proto__的值再看成是一个对象，再去找它的constructor属性。



以数组为例。（其实，我们已经知道了数组是由Array构造器创建的，这里先假装不知道） 

来用这个公式找下它的构造器：（以下代码在chrome浏览器中执行）

console.log([].__proto__.constructor)
// ƒ Array() { [native code] }
结果可以看到到，[].__proto__.constructor === Array


同样的道理，我们可以继续去找字符串，对象，函数，a标签的构造器。结果如下：

var str =""
console.log(str.__proto__.constructor === String);// true
var obj = {}
console.log(obj.__proto__.constructor === Object);// true
var f = function () {}
console.log(f.__proto__.constructor === Object); // true
假设你的页面上有一个a标签，其id就是a

var a = document.getElementById('a')
a.__proto__.constructor === HTMLAnchorElement
5 原型与原型链

好了，我们终于要切入主题啦。

5.1 原型 prototype

前面我们说了，对象是属性的集合，而函数也是一个对象。所以，每个函数都有很多的属性，但其中就有一个名为prototype属性，这个属性值也是一个对象，它是一个非常重要的属性，我们称为原型。

下面去看看函数的原型长什么样：

(1) 自定义的函数

var f = function() {}
console.dir(f)
如下：


(2)Array构造器

console.dir(Array)
如下：


由于prototype的值也是一个对象，所以我们也称prototype是原型对象。

5.2 隐式原型 proto

对象是属性的集合，每个对象可能都有数量不等的属性，但每个对象都有一个名为proto的属性，这个属性值也是一个对象。这个属性proto称为隐式原型。（注意写法：前后两个下划线）

下面去看看对象的隐式原型长什么样。

（1）数组对象的隐式原型




（2）普通对象的隐式原型 


（3）构造器的隐式原型


注意：由于函数既是函数也是对象，所以对于函数来说，它既有prototype属性又有__proto__属性。

5.3 原型与隐式原型的关系

先直接给出结论：

对象.__proto__ === 构造器.prototype
用语言来表述是：对象的隐式原型等于 创建这个对象的构造器的原型 （把这句话读出来，念3遍）

用公式表达就是:

如果： 对象 = new 构造器()

那么： 对象.__proto__ === 构造器.prototype

5.4 验证这个关系

数组

console.log([].__proto__ === Array.prototype); // true
函数

var f = function()
console.log(f.__proto__ === Function.prototype); //true
普通对象

console.log({}.__proto__ === Object.prototype); // true
由自定义构造器创建的对象

function f(){}
var f1 = new f()
console.log( f1.__proto__ === f.prototype )
6 原型链

当我们访问某个对象的属性时，要沿着某个路径去找这个属性，这条路径就是原型链。

具体以访问obj的属性p为例

console.info( obj.p )
寻找属性p的步骤如下：

（1）先在自有属性中找，如果找到，则返回；如果找不到，则进入到它的隐式原型中去找。

（2）由于对象的隐式原型也是一个对象（对象又是属性的集合），所以继续在obj.__proto__的自有属性中去找。找到则返回，找不到，则继续。
（3）在obj.__proto__这个对象的隐式原型中继续找。找到返回，找不到，则继续到obj.__proto__.__proto__中去找。
（4)直到__proto__为null 停止。


上图中，红色的箭头标识的路径就是原型链。

6.1  例子：查找成功

var arr = [1,2]; //这是一个对象。
arr.toString()
把arr看成一个对象，arr.toString就是要去找toString属性。(1)第一步，在自有属性中找，没有找到 (2)第二步，进入arr.proto这个对象中去找。找到了，返回使用。


也就是说，

arr.toString === arr.__proto__.toString
6.2 寻找失败的例子

var arr = []; //这是一个对象。
arr.abc
把arr看成一个对象，arr.toString就是要去找toString属性。

(1)第一步，在自有属性中找，没有找到 

(2)第二步，进入arr.__proto__这个对象中去找。没有找到。

(3)第三步，进入arr.__proto__.__proto__这个对象中去找。没有找到。

(4)而由于arr.__proto__.__proto__.__proto__ 的值是null了，所以整个查找结束，最终返回undefined.

7 原型链的应用

原理：把属性（或者是方法）添加在构造器的原型对象上后，由此构造器创建的对象均可以使用这个属性（方法）了。

7.1 示例1：给内置构造器添加属性

例如：给数组Array构造器添的原型对象添加一个a1()方法。则所有的数组对象都将具备这个方法。

Array.prototype.a1 = function(){
    console.log('a')
}

var arr1 = new Array();
var arr2 = []; // 等价于使用构造器创建

arr1.a1(); // 输出 a 
arr2.a1(); // 输出 a
以arr1.a1为例，按原型链的查找过程，先在自有属性中找，并没有找到，再进一步去arr.__proto__中找。

注意由于：

arr.__proto__ === Array.prototype
而在Array.prototype中我们已经添加过a1属性了，所以arr.__proto__中也就可以找到这个属性了。故而，arr.a1()能成功执行。

同理可分析 arr2.a1的查找过程。

其实,由于a1,a2都是由构造器Array创建的对象，所以 有如下公式成立

arr1.__proto__ === arr2.__proto__ === Array.prototype
7.2 示例2：给自定义构造器添加属性

下面这段代码是一段经典的把函数当作用构造器来用，并以其模拟面对对象中的类的概念。

functioin F() {}
F.prototype.func = function() {}

var f1 = new F();
f1.func()
那请你思考 ，为什么f1这个对象可以访问func这个方法呢？ 如果你能答出来，就说明你已经get到原型链的作用啦。

8 小结

•如果 对象 = new 构造器（）,那么对象.__proto__ === 构造器.prototype
•原型链的作用在于确定对象的属性值；
•在确定对象的属性值时，我们会沿着原型链上去查找。先在自有属性中找，如果找不到，继续到对象.proto中去找，如果还没有找到，则继续在对象.proto.proto中找，直到找到，或者 对象...__proto__ 为null为止。此过程的搜索路径就是原型链。