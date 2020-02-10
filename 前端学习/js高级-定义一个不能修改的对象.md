js高级-定义一个不能修改的对象

原创 凡人的进阶  凡人进阶  2019-12-01
在实际开发中，我们会需要一个真正常量对象：这个对象一经初始化，就不能被添加属性，删除属性，修改属性。

1 简介

本文讨论如何定义一个常量对象。解释了es6中const关键字的用法，及它在作用于对象时的缺陷，用Object.freeze() 和 Proxy() 给出了一个定义常量对象的解决方案，最后封装成了一个工具方法。

2 内容

•问题描述
•学习const
•用Object.freeze() 冻结对象
•Proxy 监听对象操作
•封装

3 问题描述

对于给定的常量如下：

const constSettings = {
    appName:"a",
    info: {p1:200,p2:300 }
}
对上面的constSetting进行一些操作之后，要达到6个要求：

1. 不能添加属性

constSettings.other = "abc";  // 报错
      2. 不能删除属性
  delete constSettings.other;  // 报错
   3.不能修改属性

constSetting.appName = "good"; // 报错
      4.不能修改属性的属性

constSetting.info.p1 = 200;   // 报错
      5. 不能访问对象不存在的属性

const.aaa; // 报错
      6.不能重新给对象赋值

constSettings = {}; //  报错
报错的意思有两点：

•你的设置是不会生效的
•主动抛出一个Error让整个代码终止

显然，目前的常量对象只能满足第6条，而其它的要求就需要我们额外的功能来实现了。

为什么const加持的常量只能满足第6条呢？下面来说明。

4 学习const

const 是ES6中用来定义常量的关键字。

4.1 赋值运算符 =

const varName = initValue;
上面这句代码到底发生了什么事？

如果initValue是基本数据类型：常量varName中保存的就是initValue的值；

如果intValue是引用数据类型：先在堆区中保存initValue的值，然后把堆区中的这个地址保存在常量varName中。

在第二种情况下：const关键字还是不允许你修改varName中保存的数据-----initValue在堆区中的地址，但是，你可以沿着这个地址去修改堆区中的数据。

下面看两个例子。

4.2 const对基本数据类型是生效的

const a = 1;
a = 2; // 报错，达到了const的效果
由于数值1是基本数据类型，所以常量a中保存的是数据本身，它当然是不能修改的。

4.3 const对引用数据类型是无效的

const obj = {name:"a"};
obj = "a"      
// 报错，达到了const的效果
分析：

第一句代码让obj中保存是一个地址；第二句代码又试图它obj中保存字符串"a“，这是不被const允许的，所以报错了，也就是说在这种情况下const是有效的。

但是，看下面的代码：

const obj = {name:"a"};
obj.name = "b" 
// 不报错，成功地修改了obj的属性
分析：

第一句代码让obj中保存是一个地址，而真实的数据{name:'a'}保存在堆区中；第二句代码obj.name = "b" ，是沿这个地址在堆区中找到了数据，并修改了值。这个过程中并没有修改obj中保存的那个地址。所以const不会报错。

小结

const定义的对象只能保证这个对象不会被整体修改，却不能保存这个对象的属性不能修改。因此，我们想定义一个不被修改的常量，只靠const是远远不够的。

5 用Object.freeze() 冻结对象

Object.freeze()方法可以冻结一个对象。具体来说冻结指的是：

•不能向这个对象添加新的属性
•不能修改其已有属性的值
•不能删除已有属性
•以及不能修改该对象已有属性的可枚举性、可配置性、可写性。

具体用法参考：这里[1]

注意：这个方法返回值是你传入对象，而不是创建一个被冻结的副本，也就是说它直接修改了入参。

5.1 Object.freeze()的用法示例

const constSettings = {
    appName:"fan",
    info: {p1:200,p2:300 }
};
Object.freeze(constSettings);

constSettings.appName = 1 ; 
// 悄悄地无效

constSettings.other = "abc"; 
// 悄悄地无效

constSettings.info.p1 = 100; 
// 生效了

console.info(constSettings)
// {appName:"fan",info:{p1:100,p2:300}
注意：

1.不需要额外定义一个常量来接收freeze()的返回值，写成 const obj = Object.freeze(constSettings) 。freeze()会直接修改入参。
2.添加other属性，修改appName 这两个操作均没有显示地报错误，但也没有修改成功。
3.仍可以以修改属性的属性：constSettings.info.p1 = 100; 原因是freeze()只能冻住一层。

下面我们使用递归来解决这个只能冻住一层的问题。

5.2 递归Object.freeze()

观察如下代码

const constSettings = {
    appName:"fan",
    info: {p1:200,p2:300 }
};
Object.freeze(constSettings);
上面的constSettings对象确实被冻住了，但它的属性info的值也是一个对象，而这个对象并没有被冻住，所以你仍然可以通过constSettting.info找到这个对象，再对它的属性做进一步的修改操作。

下面，我们要通过递归，把属性的属性的属性.... 也冻起来(前提是它也是一个对象)。

通过一个函数来完成这个过程。下面的函数deepFreeze来自这里[2]

function deepFreeze(obj) {
  // 取出所有属性
  var propNames = Object.getOwnPropertyNames(obj);
  // 在冻结自身之前冻结属性值
  propNames.forEach(function(name) {
    var prop = obj[name];
    // 如果prop是个对象，冻结它
    if (typeof prop == 'object' && prop !== null)
      deepFreeze(prop);
  });

  // 冻结自身(no-op if already frozen)
  return Object.freeze(obj);
}

const constSettings = {
    appName:"a",
    info: {p1:200,p2:300 }
};

deepFreeze(constSettings);

constSettings.appName = 1
// 悄悄地无效
constSettings.other = "abc" 
// 悄悄地无效
constSettings.info.p1 = 100 
// 也悄悄地无效
console.info(constSettings)
悄悄地无效是指代码不报错，但是呢，也并不实现修改。 



下面，我们只剩一件事了：不要 悄悄地无效，要明确地抛出一个错误。这样让使用者尽早地发现这个问题。

6 Proxy 监听对象操作

关于Proxy的用法可以参考这里[3], 也可以去看看我的另一篇文章。这里不做详细的介绍。



具体我们前面提的需求：对一个常量对象，修改属性的操作是不合法的，要报错。此时，我们可以用Proxy来代理属性的set操作,在具体的逻辑中，什么事都不做：直接报错。

const constSettings = {
    appName:"fan",
    info: {p1:200,p2:300 }
};

// 给原对象产生一个代码对象
const con = new Proxy(constSettings, {
    set(target,paraName){
      //  操作不允许，报错
      alert(paraName+"  不许修改")
  }
})

con.appName = "good" // 会报错
当然，可以更进一步:

如果试图删除一个属性时也报错。需要拦截对象的delete操作。

如果试图访问一个不存在的属性时也报错。这只需要在get之前判断一下即可。



deleteProperty: function(target, p) {
   throw new Error("不能删除 "+p)
},
get(target,p){
  if(!target.hasOwnProperty(p)){
    throw new Error(p+ " 不存在")
  }
  else{
    return target[p]
  }
},
set(target,p,value){
  throw new Error(p+ " 不能修改")
}
7 封装

最后，把上面的功能全封装在一个函数中。

function createConst(obj) {
  // 取回属性
  var propNames = Object.getOwnPropertyNames(obj);

  // 在冻结自身之前冻结属性值
  propNames.forEach(function(name) {
    var prop = obj[name];

    // 如果prop是个对象，冻结它
    if (typeof prop == 'object' && prop !== null)
      obj[name] = createConst(prop);
  });

  // 冻结自身(no-op if already frozen)
  Object.freeze(obj);

  return new Proxy(obj,{
    deleteProperty: function(target, p) {
       throw new Error("不能删除 "+p)
    },
    get(target,p){
      if(!target.hasOwnProperty(p)){
        throw new Error(p+ " 不存在")
      }
      else{
        return target[p]
      }
    },
    set(target,p,value){
      throw new Error("不能改 "+p)
    }
  })
}

const settings = {
    appName:"a",
    info: {p1:200,p2:300 }
};

const con= createConst(settings)

// con就可以满足前面提的6个要求了。
8 小结

本文综合使用const, Object.freeze(), 递归，Proxy等技术实现一个无法被修改的常量对象。希望对你有帮助。



版权信息：凡人进阶。转载请标明出处。如果对您有帮助，您可以：

•转发他人。小额打赏。关注本号。

References

[1] Object.freeze: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
[2] Object.freeze: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
[3] Proxy: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy