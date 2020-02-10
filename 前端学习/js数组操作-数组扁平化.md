js数组操作-数组扁平化

原创 凡人进阶  凡人进阶  2019-11-04
js数组操作-数组扁平化

数组的扁平化，就是将一个嵌套多层的数组(嵌套可以是任何层数)转换为只有一层(或者指定层)的数组。这个操作在实际开发过程还是有一定的需求场景的。在es6中已经提供了实现这个功能的方法，本文讨论了模拟实现的方案。

关键字：模拟实现 Array.prototype.flat

1 简介

本文介绍了ES6中给数组提供的flat 它的功能是把数组扁平拉开及如何去模拟实现。

如果你已经知道了答案，或者暂时不想学习这个看起来没有什么实际用处的功能，你可以跳过哈。

2 内容

•ES6中flat功能介绍
•toString+split模拟实现
•循环+递归实现

3 ES6中flat功能介绍

它的格式是：

var 新数组 = 数组.flat(level=1);
注意：

•它默认只扁平化一层：即把二维数组展开成一组数组；把三维数组展开成二维数组等。
•如果希望展开指定的层数，则可以传入一个具体的数值；
•如果希望一步到位，展开成最简单的一维数组，可以传入Infinity

[1, 2, [3, [4, 5]]].flat()  
// 结果是：[1, 2, 3, [4, [5]]] 。
// 在保留最外层的[]情况下，把3前面的[去掉。

[1, 2, [3, [4, [5]]]].flat(2)  
// 结果是：[1, 2, 3, 4, [5]] 。
// 在保留最外层的[]情况下，去掉里面的两层[]：把3,4前面的[去掉

[1, 2, [3, [4, [5]]]].flat(Infinity) 
// 结果是：[1, 2, 3, 4, 5]
// 展开成一维数组
下面的内容讨论如何去模拟实现这个功能。

4 toString+split

如果数组的元素都是数字或者是字符串（或者你不在意它们之间的区别），可以考虑使用 toString 方法加上split方法。

整体分成两步：

// 1.用数组的toSting()把数组转成字符串
[1,[2,[3,[4,[5,6]]]]].toString(); 
// 得到：1,2,3,4,5,6

// 2.用字符串的split()把字符串还原成数组
"1,2,3,4,5,6".split(",");
//得到：["1","2","3","4","5","6"]
写成函数就是：

function yourFlat(arr) {
    return arr.toString().split(',')
}
var arr = [1,[2,[3,[4,[5,6]]]]];
var arr1 = yourFlat(arr)
console.log(arr1) // [1,2,3,4,5,6]
注意：

•这里有一个bug:原数组中的数值被转成字符串了。如果你不在意这个类型的问题，那你可以使用这种做法。或者根据实现需求，得到全字符串元素的数组之后再把其中的字符串转回成数值。

再进一步，使用箭头函数来简化一下代码：

var yourFlat = arr => arr.toString().split(',')
5 循环+递归

对于arr这个要拉平的数组来说，我们先从最简单的二维情况说起，再拓展到多维的情况。

5.1 循环处理二维数组

我们先把情况简化一下：arr只是一个二维数组。思路就是：

第一步：定义一个空数组rs；

第二步：循环arr中的元素；

•如果当前元素arr[i]是数组，则把arr[i]这个数组中的全部元素添加到rs中。
•如果当前元素arr[i]不是数组，则这个元素添加到rs中。

第三步：返回rs；

var arr = [1,2,3,4,[5,6]];
function yourFlat(arr){
    var rs = [];
    for(var i = 0; i < arr.length; i++){
      if(Array.isArray(arr[i])){
        rs.push(...arr[i]) //注意这里
      } else {
        rs.push(arr[i])
      }
    }
   return rs;
}
注意：rs.push(...arr[i])的用法。

解释如下：push()方法用来把某些元素添加到数组的最后面，它会修改原数组，并且返回值是修改数组后，数组的长度。如果你希望一次性添加多个元素到数组，可以写成arr.push(x,y,z...)这种格式，但是，如果你直接传入一个数组的话，它会把整个数组为一个元素添加进去。

var arr = [1,2,3]
arr.push(4,5);  
// 返回值是5，arr的状态是[1,2,3,4,5]

arr.push([4,5]) 
// 返回值是4，arr的状态是：[1,2,3,[4,5]]
在数组的前面加... 是ES6中给数组新的一个运算符，它就可以把数组展开。

你也可以换一个写法：

rs = rs.concat(arr[i])
注意哈，别省略了赋值，而写成了rs.concat(arr[i]) 。原因是rs.concat()不会修改rs这个数组，你必须重新赋值才可以保存结果。

5.2 循环+递归处理多维数组

现在把情况搞复杂一些，从arr从二维数组升级成一个多维数组。那又该怎么做呢？答案是：在循环的基础上加上递归来处理。

思路是：

第一步：定义一个空数组rs；

第二步：循环arr中的元素；

•如果当前元素arr[i]是数组，则递归。
•如果当前元素arr[i]不是数组，则这个元素添加到rs中。

第三步：返回rs；

下面是代码。

function yourFlat(arr){
    var rs = [];
    for(var i = 0; i < arr.length; i++){
      if(Array.isArray(arr[i])){
        rs.push(...yourFlat(arr[i]))
      } else {
        rs.push(arr[i])
      }
    }
   return rs;
}
var arr = [1,[2,[3,[4,[5,6]]]]];
var arr1 = yourFlat(arr)
console.log(arr1) // [1,2,3,4,5,6]
你还可以进一步用箭头和数组的reduce方法来改写这个函数：

var yourFlat = arr => arr.reduce((prev, next)=>prev.concat(Array.isArray(next) ? yourFlat(next) : next), [])
好的，你可以稍微想一想，如何对一个多维数组实现扁平到指定的层级？

var arr =  [1,[2,[3,[4,[5,[6]]]]]];

var arr1 = flat(arr,1); 
// 期望结果：[1,2,[3,[4,[5,[6]]]]];

var arr2 = flat(arr,2); 
// 期望结果：[1,2,3,[4,[5,[6]]]];
下面的内容是参考代码，我建议你自己先想一想。

6 相对完整的例子

思路：

第一步：定义一个空数组 rs；

第二步：循环arr中的元素；

•如果当前元素arr[i]是数组

•再次判断，是否达到扁平的级数

•否，则递归。
•是，添加到rs


•如果当前元素arr[i]不是数组，则这个元素添加到rs中。


第三步：返回rs；

代码如下：

var yourFlat = function(arr,level=1){
  var rs = [];
  for(var i = 0; i < arr.length; i++){
    if(Array.isArray(arr[i])){
      if(level>1){
        rs = rs.concat(flat(arr[i],level-1))
      }else {
        rs = rs.concat(arr[i])
      } 
    } else {
      rs = rs.concat(arr[i])
    }
  }
  return rs;
}
注意到上面代码中两层if中的代码有部分是重复的，稍微再优化一下：

var yourFlat = function(arr,level=1){
  var rs = [];
  for(var i = 0; i < arr.length; i++){
    if(Array.isArray(arr[i]) && level>1){
        rs = rs.concat(yourFlat(arr[i],level-1))
    } else {
      rs = rs.concat(arr[i])
    }
  }
  return rs;
}
如果用reduce改写的话，是这样：

var yourFlat = (arr,level=1)=>
  arr.reduce((prev,next)=>prev.concat(level>1 && Array.isArray(next) ? yourFlat(next,level-1):next),[]);
7 小结

•本文讨论了如何去数组进行扁平化处理的两种实现方法。
•其实ES6中已经提供了这个功能。
•在著名的underscore[1]库中也封装这个功能。