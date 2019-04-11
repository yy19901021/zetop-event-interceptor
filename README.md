## Zepto事件拦截器插件
主要作用是zetop.on添加的事件函数执行之前，对其进行拦截。
### 用法
```
  .......引入js.......
  
  $(selector).interceptor(headler, event).on() // 添加拦截器
  $(selector).interceptorCancel(events) // 取消拦截器
```
### 参数说明
#### 添加拦截器
- headler：拦截器执行函数，在on里面定义的函数之前执行，如果返回的是true 则on定义的事件函数继续执行，否则不执行.(如果headler不传，则不会进行拦截)
- event: 需要拦截的事件 可以是（字符串， 数组，和 undefined）undefined时默认拦截所有事件
#### 取消拦截器
event: 取消事件拦截 可以是（字符串， 数组，和 undefined）undefined时清除所有拦截
