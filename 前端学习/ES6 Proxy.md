ES6 Proxy

原创 凡人的进阶  凡人进阶  2019-11-26
Proxy是es6中提出的内置对象，我们可以方便地使用它来给对象添加一个代理对象。

1 简介

本文介绍 Proxy的基本用法，并用它实现了几个小应用：

1.访问对象不存在的属性时，主动抛出错误；
2.设计一个数组，它支持下标是负整数；
3.链式调用。题目如下

var double = n => n*2;
var pow2 = n => n*n;
var half = n => n/2;
var add1 = n => n+1;
function pipe (num){
 // 请完成代码
};
console.info( pipe(4).double.pow2.end); // 64
console.info( pipe(2).pow2.double.add1.end); // 9
2 Proxy

Proxy是一个构造器。通过new Proxy(原对象,{代理列表})的方式来创建对象,创建的这个对象我们称之为代理对象。

即：

代理对象 = new Proxy(原对象,{代理列表})
之所以要额外产生这么一个代理对象，好处在于：在保持原对象不变的情况下，给代理对象中添加新的功能，或者是改造某些功能。而这个原对象则可以在适当的时机回滚回去，可以与设计模式中的代理模式对比理解。

2.1 使用格式

var obj;
var proxyObj = new Proxy(obj, {
    对obj的操作1: 函数1,
    对obj的操作2: 函数2
    ...
})
2.2 Proxy的基本示范

var obj = {name:'fan'}
console.info(obj.name)
var proxyObj = new Proxy(obj,{
    get:function(target,key,receiver){
        console.info(target,key,receiver); 
        return 'no'
    }
})

console.info(proxyObj.name) 
console.info(proxyObj.abc)
解释如下：

1. proxyObj对象是在obj对象的基础之上创建的一个新对象。
2. proxyObj.name是要去获取proxy对象的name属性。
3. 在new Proxy的第二个参数中，明确设置了get的方法：当访问proxyObj的任意属性时，输出target,key,receiver的值，并统一返回no。所以proxyObj.name和proxyObj.abc都会得到no。

到这里你会觉得原对象与代理对象之间有什么关系呢？为什么叫代理呢？

2.3 理解代理的作用

代理对象可以理解为明星的经纪人。

外界 <----> 原对象
外界 <----> 代理对象 <------> 原对象；
还以上面的代码为例，改进一下需求：如果有人问obj的名字，就直接告诉对方；如果有人问obj的年龄，就返回小5岁的年龄。﻿﻿

var obj = {name:'fan',age:100}
console.info(obj.age)          // 100
var proxyObj = new Proxy(obj,{
    get:function(target,key,receiver){
        console.info(target === obj);          //true
        console.info(receiver === proxyObj);    //true
        if('age' === key){
            return target[key] - 5;
        }
        else{
            return target[key]
        }
    ｝
})
console.info(proxyObj.age)  // 100- 5 = 95
get函数中的三个参数：target,key,receiver。
- target就是原对象j;
- keys是当前的属性名；
- receiver是代理对象。
  你可以在get方法中做任意的自定义的处理。

2.4 代理对象与原对象的关系

var arr = [2,1]
var proxyArr = new Proxy(arr,{} )
proxyArr.push(3);
console.info(arr) // [2,1,3]
console.info(arr === proxyArr) // false
arr.sort();
console.info(proxyArr[0]) // 1
以上代码中，这个代理对象并没有做任何的特殊操作。理解为明星的经理人消极怠工：原封不动地转告外界的信息给明星本身。所以在proxyArr上做到操作会直接影响到arr上。
同理，在arr上的操作，也会影响proxyArr。

但是要注意：proxyArr与arr是两个不同的对象：arr !== proxyArr。





2.5 代理列表

在new Proxy()的第二个参数中，可以设置的代理属性如下：

var proxyObj = new Proxy(obj, {
    get: function(tagert,key,receiver){},
    set: function(tagert,key,receiver){},
    has: function(tagert,key){},
    deleteProperty: function(tagert,key){},
    ownKeys: function(tagert){},
    getOwnPropertyDescriptor: function(tagert,key){},
    defineProperty: function(tagert,key,desc){},
    preventExtensions: function(tagert){},
    getPrototypeOf: function(tagert){},
    isExtensible: function(tagert){},
    setPrototypeof: function(tagert,proto){},
    apply: function(tagert,obj,args){},
    construct: function(tagert,args){},
})

3 get() 代理的应用

3.1 应用1: 访问不存在的属性名时报错

在实际开发中，通常会把所有的用到的标志字符串写在成常量的格式.一般的做法是单独写在一个对象中，然后在其他需要用到的地方引入这个对象。

const CON= {
  COMPANYNAME:"XX",
}
在后续后操作中，如下：

console.info(CON.COMPANYNAME)

// 不小心把属性名写错,并不会有什么特殊的提示效果。
console.info(CON.COMPANYNAME1)
以上的操作中，我们写错了属性名，但并不会特殊的提示，因为访问对象不存在的属性时会返回在udefined,而不是报错误给用户。这种体验不利于我们发现错误。

所以，改进如下：

const CON= {
  COMPANYNAME:"XX",
}

let proxyConst = new Proxy(con, {
  get: function (target, key, receiver) {
      if(key in target)
          return target[key];
      else{
          throw new Error("error:常量名"+key+"不存在！")
      }
  }
});

console.info(proxyConst.COMPANYNAME)

console.info(proxyConst.COMPANYNAME1) 
//  这里会报错。
3.2 应用2：允许数组下标是负值

在js中，数组的有效下表是从0开始的。

var arr = [1,2,3];
console.info(arr[0])  // 1
console.info(arr[-1]) // undefined
console.info(arr[100]) // undefined
值得注意的是，下标越界或者是负值的情况下，得到的结果是undefined，而不是报错。

如果我们希望数组可以取负值下表，且规则如下：

•-n表示倒数第n个元素。例如：-1表示倒数第一个元素。

可以使用Proxy解决如下：

var arr = [1,2,3];
var proxyArr = new Proxy(arr,{
  get: (target,prop)=>{
      let index = Number(prop);
      if(index < 0){
          prop = target.length + index;
      }
      return target[prop];
  }
})

console.info(arr[-1]);      // undefined
console.info(proxyArr[-1]); // 3
注意：

•Number()可以把传入的值转成数值型。非数值 --> NaN;
•如果是proxyArr.push(3)，由于此时的prop是'push',所以不会进入if分支。
•如果是proxyArr[-1],此时的prop是'-1',所以会进入到if分支：把prop从-1改成 2 ,从而实现了被代理的效果。
•此时，完全可以把proxyArr当作一个数组来使用，sort,push等方法均可以调用。Array.isArray(proxyArr) === true
当然，你也可以进一步封装成工厂函数。

function myArr(...args){
  var arr = new Array(...args);
  var proxyArr = new Proxy(arr,{
    get: (target,key)=>{
      let index = Number(key);
      if(index < 0){
          key = target.length + index;
      }
      return target[key];
    }
  })
  return proxyArr;
}
var obj = myArr([1,2,3]);
console.info(obj[0],obj[-1])
3.3 应用3 链式运算

回到开头提出的问题哈，

var double = n => n*2;
var pow2 = n => n*n;
var half = n => n/ 2;
var add1 = n => n+1;
function pipe (num){
    // 请完成代码
};
console.info( pipe(4).double.pow2.end); // 64
console.info( pipe(2).pow2.double.add1.end); // 9
提示一下：
让pipe()返回一个代理对象，假设这个对象就是obj，那么obj.double就是再次访问这个对象的属性，此时就可以代理对象的get代理函数去判断当前的访问的属性是不是end，如果不是，则收集这个操作，否则执行所有的操作。

参考代码如下：

function pipe(num){
  let funs = []
  let obj = new Proxy({},{
    get:function(target,prop){
      if(prop === 'end'){
        return funs.reduce((val,currentfn)=>currentfn(val),num);
      }else{
        funs.push(window[prop])
      }
      return obj;
    }
  })
  return obj;
}
这种写法在很多的工具库中都有，例如math.js[1]的chain.

4 小结

本文介绍proxy的基本用法和几个小应用，希望对你有帮助 。




版权信息：凡人进阶。转载请标明出处。如果对您有帮助，您可以：

•转发他人。小额打赏。关注本号。

References

[1] math.js: http://mathjs.org/docs/core/chaining.html
[2] reduce: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce