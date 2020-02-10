js函数-防抖与节流

原创 凡人的进阶  凡人进阶  2019-11-08
防抖和节流是前端面试中的高频问题；一方面它们的应用场景比较多，另一方面它们背后的代码也有一定的难度：高阶函数，定时器，逻辑，下上文等，用来考评面试者的基础功底及实践能力是比较不错的选择。

1 简介

本文介绍了防抖和节流的基本原理，实现方式，它是高阶函数的又一个经典应用。

代码有点难度哈，希望你能有所收获。

2 内容

•基本场景
•防抖的实现原理及代码实践
•节流的实现原理及代码实践
•对比记忆

3 一道小面试题

假设html页面上有一个input框，我们通过js监听它的input事件。代码如下：

html

<input  type="text" id="input">
js代码

<script>
function f(e){
    console.log(Date.now(),e.target.value)
}
document.getElementById("input").addEventListener("input",functioin(e){
  f(e)
})
</script>
如果你在input框中按下字母'a'不放，你看到的效果应该是这样:约间隔30ms左右，这个事件会被触发一次，从而调用一次函数f。


就从这个实际的情况出发，希望你在不直接修改f的情况下，实现一个效果：当用户在input框中按下字母'a'不放时，f这个函数不要调用的这么频繁，改成约每200ms调用一次。改造之后的代码下：

<script>
function f(e){
    console.log(Date.now(),e.target.value)
}
function youFunc(func,t){
    // 请写出你的代码
}
var f1 = youFunc(f,200)
document.getElementById("input").addEventListener("input",functioin(e){
  f1(e)
})
</script>
请你完成yourFunc中的代码内容。如果你可以很轻易的就完成，那就不必往下读啦。如果你认真地看完了，你就可以完成这个题了。

4 防抖和节流的通用场景

这两个功能都是用来对函数的调用做降频(降低单位时间内被调用的次数)处理的。

当一个函数被以较高的频率调用时（在极短的时间内被调用了多次），从于某些原因的考虑，我们希望对它实际被执行的频率做一些限制。

结合代码来说更具体一些。如下，我们先定义一个简单的函数。

function getTime (){
    console.log(Date.now())
}
那么有哪些情况下它会被高频调用呢？

// 手动调用多次：被连续调用100次
for(var i=0; i< 100; i++){
    getTime()
}

// 高频事件响应函数：当作mousemove事件的回调函数。
document.onmousemove = getTime()

// 高频事件响应函数：当作keyup事件的回调函数。
input.onkeyup = getTime()
为什么要限制它真实被执行的频率(这里是要降低)呢？这就要结合具体的业务场景来说了。

1.一个功能本身就是要限制被调用的次数。例如用户请求登陆的次数不能太频繁。
2.一个功能没有必须被频繁调用。例如，在输入框中输入信息之后，输入内容的每一次变化都需要去后端取回后台建议的数据。举个例子：用户在极短的时间内连续输入"javascript"，这10个字符，如果不做降频处理的话就会发出10次请求，每次请求的关键字依次是"j","ja","jav"，..."javascript"。而其实对用户真正有用的可能只是搜索"javascript"的结果，那这样的话，前几次的请求大概率都是无用的。




5 防抖

它的英文是：debounce。

在某个场景下，函数f被高频调用 ，我们希望降低被调用频率，可以对函数f进行n秒防抖处理，得到新函数f1，那么这个f1函数具备的特性是：

1.函数f1调用后，从此时开始：
2.  随后的n秒内没有再次调用f1，则在第n秒执行真正的f代码。
3.  随后n秒后，再次调用f1，则回到第一步，再开始计时。

函数防抖就是法师发大招时候要读进度条，技能读条没完再按技能就会重新读条。（要重新来等进度条）

为了方便演示效果，我们设计如下案例。在页面上有一个按钮，我们每次点击它，它就会调用f，打印出当前时间。如果你的手机点击的足够快，就可以模拟一个高频调用函数f的例子了。

html代码

<button id="btn">普通，点一次调用一次</button>
js代码：

function f () {
  console.log(Date.now())
}
document.getElementById("btn").onclick = f
上面的这个f函数后面会反复使用哈。


下面，我们在此具体上来实现防抖效果。



在代码实现上，有如下三个策略。

5.1 防抖-立即执行版

立即执行版的意思是：

var f1 = 防抖_立即执行(f,n)
这样得到的新函数f1，具有如下特点：

1.函数f1调用后，立即执行f(),并从此时开始：
2.随后的n秒内，并没有再次调用f1，则在第n秒后，可以再次成功调用f1,相当于是回到第一步
3.随后的n秒内再次调用f1，不会执行f函数，再次以此时间为起点，回到第2步。

举一个极端的例子：对f函数进行立即执行的n秒防抖处理之后得到f1函数而言，假设你从早上8:00开始，以每秒100次的速度去调用f1，持续到中午12:00。最终的结果是，f函数只是在8:00时执行了一次。

看例子啦。

<button id="btn_debounce_now">防抖3s，立即执行</button>
快速连接点击这个按钮，查看效果。

js代码如下：

function debounce_callnow(f,t=3000){
   var time = null  
   return function(){    
     if(!time){      
       f();    
     } else {      
         console.log("不要着急，等3s后再点才有效")    
     }    
     clearTimeout(time)    
     time = setTimeout(()=>{ 
        time = null;    
     },t)
 }
​         
 function f () {  
    console.log(Date.now())
 }
​     
 var  f1 = debounce_callnow(f)
 document.getElementById("btn_debounce_now").onclick = f1;


这是一个典型的高阶函数：它接收一个函数为实参，并且还返回了一个函数。它的执行效果是：第一次点击时，能执行f，在接下的3秒内的点击都是无效的，而每一次无效的点击都会重新开始计时三秒。


5.2 防抖-非立即执行版

非立即执行版的意思是：

var f1 = 防抖_非立即执行(f,n)
这样得到的新函数f1，具有如下特点：

1.函数f1调用后，不执行f(),从此时开始：
2.随后的n秒内，并没有再次调用f1，则在第n秒时，调用f()
3.随后的n秒内再次调用f1，不会执行f函数，再次以此时间为起点，回到第2步。

举一个极端的例子：对f函数进行非立即执行的n秒防抖处理之后得到f1函数而言，假设你从早上8:00开始，以每秒100次的速度去调用f1，持续到中午12:00。最终的结果是，f函数在12:00过n秒时，执行了一次。

html:

<button type="primary" id="btn_debounce_end">防抖3s，延迟执行</button>
快速点击这个按钮，观察效果。

js代码

function debounce_callend(f,t=3000){
  let time = null
  return ()=>{
    if(time) {
      clearTimeout(time);
      console.log('不是立即执行的，点一次等3s后看结果');
    }
    time = setTimeout(()=>{
      f();
    },t)
  }
}
function f () {
  console.log(Date.now())
}
var  f1 = debounce_callend(f)

document.getElementById("btn_debounce_end").onclick = f1;
非立即执行版的意思是触发事件后函数f不会立即执行，而是在3秒后执行，如果在 n 秒内又触发了事件，去调用f1，则会重新计算函数执行时间。


5.3 混合版本

也可以把非立即执行版和立即执行版的防抖函数结合起来。

var f1 = 防抖(f,n)
这样得到的新函数f1，具有如下特点：

1.函数f1调用后，执行一次f(),从此时开始：
2.随后的n秒内，并没有再次调用f1，则在第n秒时，调用f()
3.随后的n秒内再次调用f1，不会执行f函数，再次以此时间为起点，回到第2步。

举一个极端的例子：对f函数进行的n秒防抖处理之后得到f1函数而言，假设你从早上8:00开始，以每秒100次的速度去调用f1，持续到中午12:00。最终的结果是，f函数分别在8：00和12:00过n秒时，各执行了一次，共执行了两次。

html

<button type="primary" id="btn_debounce_both">防抖3s，立即执行+延迟执行</button>
快速点击这个按钮，观察效果。js

function debounce_callboth(f,t=3000){
  let time = null
  return ()=>{
    if(!time){
      f();
    }
    clearTimeout(time)
    time = setTimeout(()=>{
      time = null;
      f();
    },t)
  }
}
function f () {
  console.log(Date.now())
}
var  f1 = debounce_callboth(f)
document.getElementById("btn_debounce_both").onclick = f1


效果如上。

6 节流


它的英文是：throttle。在某个场景下，函数f被高频调用 ，我们希望降低被调用频率，可以对函数f进行n秒节流处理，得到新函数f1，那么这个f1函数具备的特性是：

函数f1调用后，随后的[0,n]秒内将不能再次被调用，也不就是说下一次被成功调用的必须是在n秒之后了。

函数节流就是fps游戏的射速:就算一直按着鼠标射击，也只会按规定射速射出子弹（不会无限速度发子弹的）。

节流会稀释函数的执行频率。

6.1 节流-立即执行版

立即执行版的意思是：

var f1 = 节流_立即执行(f,n)
这样得到的新函数f1，具有如下特点：

1.函数f1调用后，立即执行f(),并从此时开始：
2.随后的n秒内，再次调用f1，不会执行f函数
3.随后的n秒后，再次调用f1，回到第一步。

举一个具体的例子：对f函数进行立即执行的10秒节流处理之后得到f1函数而言，假设你从早上8:00开始，以每秒1次的速度去调用f1，持续到中午12:00。最终的结果是，f函数在如下时间节点被调用：

•8:00:00执行一次
•8:00:10执行一次
•8:00:20执行一次
•...
•11:59:50执行一次
•12:00:00执行一次

还是看之前的按钮代码

html

<button id="btn_throttle_now">节流3s，立即执行</button>
快速点击这个按钮，观察效果。js

// 默认3000毫秒
function throttle_callnow(f,t=3000){
  let preTime = 0;
  return function() {
    var now = Date.now();
    if(now - preTime >= t){
      f();
      preTime = now;
    }else {
      console.log("两次执行时间必须要超过"+t/1000+"s")
    }
  }
}
function f () {
  console.log(Date.now())
}
var  f1 = throttle_callnow(f)

document.getElementById("btn_throttle_now").onclick = f1;
第一次点击就会执行。之后，无论你点击速度有多快，反正是隔3秒才执行一次。




6.2 节流-非立即执行版

非立即执行版的意思是：

var f1 = 节流_非立即执行(f,n)
这样得到的新函数f1，具有如下特点：

1.函数f1调用后，设置定时器，等n秒再执行f(),并从此时开始：
2.随后的n秒内，再次调用f1，不执行f
3.第n秒，执行f.
4.n秒后，再次调用f1，回到第一步。

举一个具体的例子：对f函数进行非立即执行的10秒节流处理之后得到f1函数而言，假设你从早上8:00开始，以每秒1次的速度去调用f1，持续到中午12:00。最终的结果是，f函数在如下时间节点被调用：

•8:00:10执行一次
•8:00:20执行一次
•...
•11:59:50执行一次
•12:00:00执行一次
•12:00:10执行一次

html

<button id="btn_throttle_end">节流3s，延迟执行</button>
快速点击这个按钮，观察效果。

js代码如下：

function throttle_callend(f,t=3000){
  let timer= null;
  return function() {
    if(!timer) {
      timer = setTimeout(()=>{
        f();
        // t毫秒后才能重设定时器
        timer = null
      },t)
    }else{
      console.log(t/1000+"s之间的重复点击是无效的")
    }
  }
}
function f () {
  console.log(Date.now())
}
var  f1 = throttle_callend(f)
// 添加事件响应
document.getElementById("throttle_callend").onclick = f1;
第一次点击，等3秒后，f就会执行。无论你点击速度有多快，反正是隔3秒才执行一次f。




6.3 节流-混合版

混合版的意思是：

var f1 = 节流(f,n)
这样得到的新函数f1，具有如下特点：

1.函数f1调用时，删除定时器，检查离上次调用时间是否间隔了n秒（及以上），
2.如果是：则执行f()
3.如果不是：则开启一个n秒后执行f的定时器。

举一个具体的例子：对f函数进行10秒节流处理之后得到f1函数而言，假设你从早上8:00开始，以每秒1次的速度去调用f1，持续到中午12:01。最终的结果是，f函数在如下时间节点被调用：

•8:00:00执行一次
•8:00:10执行一次
•...
•11:59:50执行一次
•12:00:00执行一次
•12:00:11执行一次

html

<button id="btn_throttle_both">
节流3s，立即执行+延迟执行
</button>
快速点击这个按钮，观察效果。js

function throttle_callboth(f,t=3000) {
  let timer = null
  let preTime = 0
  return function() {
    var now = Date.now()
    clearTimeout(timer)
    if (now - preTime >= t) {
      f()；
      preTime = now；
    } else {
      console.log('间隔不足,开始定时器')
      timer = setTimeout(() => {
        f()；
      }, t)
    }
  }
}
function f () {
  console.log(Date.now())
}
// 节流处理，默认3秒
var f1 = throttle_callboth(f)
// 给按钮添加点击事件
document.getElementById("throttle_callend").onclick = f1;
效果如下：


7 总结

•相同点：函数防抖和函数节流都是防止某一时间高频调用某函数f，而使用高阶函数的技巧对函数f进行包装以得到新函数f1,f1的功能与f相同，只是在有效调用上做了限制;
•不同点：函数防抖是某一段时间内只有效执行一次（或者两次吧），而函数节流是间隔一段时间有效执行一次。
•  本文只是基本实现其原理，对参数和上下文并没有处理。建议使用underscore库中的工具方法：节流[1] ，防抖[2]

推荐记忆方案：记住一个好理解的，另一个对比。

•节流是节约用水：把一直连续放水的水龙头关小，直到让水是一点一点向下滴（函数还是可以被调用多次，只不过是频率变慢了）。其实你只要记住这一个，就能区别于防抖啦。

8 练习题

题1：

前提，在网页中，从顶部向底部匀速，连续不断地滚动滚动，给添加scroll事件监听时，并对回调函数进行节流处理和防抖处理，如果时间都给1s，

function f(){
   console.log(Date.now()
}
var f1 = 防抖(f,1000)
var f2 = 节流(f,1000)
window.onscroll = f2;// 或者f1
它们展现的效果会有什么区别？

题2：

现在请回去完成前面的小面试题哈。

References

[1] 节流: https://underscorejs.org/#throttle
[2] 防抖: https://underscorejs.org/#debounce