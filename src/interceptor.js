/**
 * @Zepto事件拦截器插件
 * 
 */
(function ($) {
  var preOnFn = $.fn.on
  var copyFn = $.fn
  function formatInterceptor (handler, event) {
    var interceptorItem = {}
    if (event === undefined) {
      interceptorItem.event = ['ALL_EVENTS']
    } else  if (typeof event === 'string') {
      interceptorItem.event = [event]
    } else if (Array.isArray(event)) {
      interceptorItem.event = event
    }
    if (handler && typeof handler != 'object') {
      interceptorItem.handler = handler
    }
    return interceptorItem
  }
  function delEqulVal (delArr, arr) {
    for (var i = 0; i < delArr.length; i++) {
      var element = delArr[i];
      var index = arr.indexOf(element)
      if (index > -1) {
        arr.splice(index, 1)
      }
    }
  }
  // 添加拦截器
  copyFn.interceptor = function (handler, event) {
    this.each(function () {
      if (!Array.isArray(this.interceptors)) {
        this.interceptors = []
      }
      handler && this.interceptors.push(formatInterceptor(handler, event))
    })
    return this
  }
  copyFn.interceptorCancel = function (event) {
    this.each(function () {
      if (event !== undefined) {
        var delEvents = []
        if (typeof event === 'string') {
          delEvents.push(event)
        } else if (Array.isArray(event)) {
          delEvents = delEvents.concat(event)
        }
        for (var j = 0; j < this.interceptors.length; j++) {
          var element = this.interceptors[j];
          delEqulVal(delEvents, element.event)
          if (element.event.indexOf('ALL_EVENTS') > -1) {
            if (!element.exclude ) {
              element.exclude = []
            }
            element.exclude = element.exclude.concat(delEvents)
          } else if (element.event.length === 0) {
            this.interceptors.splice(j, 1)
            j--
          }
        }
      } else {
        this.interceptors = []
      }
    })
    return this
  }
  copyFn.on = function () {
    var ages = Array.prototype.slice.call(arguments)
    var functionIndex = -1
    var eventFn = ages.filter(function (item, index) {
      if (typeof item === 'function') {
        functionIndex = index
        return typeof item === 'function'
      }else {
        return false
      }
    })[0]
    var newEventFn
    var that = this
    if (ages[0] && typeof ages[0] !== 'string') {
      newEventFn = eventFn
    } else {
      newEventFn = function (event) {
        var filterInterceptors = this.interceptors ? this.interceptors.filter(function (item) {
          return (item.event.indexOf('ALL_EVENTS') > -1 &&  (!item.exclude || item.exclude.indexOf(ages[0]) === -1) )|| item.event.indexOf(ages[0]) > -1
        }) : []
        var isOk = filterInterceptors.every(function (item) {
          var el = item.handler
          if (typeof el === 'function') {
            return  el()
          } else if (typeof el === 'string') {
            return !!el
          } else if (typeof el == 'boolean'){
            return el
          } else {
            return false
          }
        })
        if (isOk) {
          eventFn.call(this, event)
        }
      }
    }
    functionIndex > -1 && ages.splice(functionIndex, 1, newEventFn)
    return preOnFn.apply(that, ages)
  }

})(Zepto)