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
      interceptorItem.event = ['all']
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

  copyFn.interceptor = function (handler, event) {
    if (!Array.isArray(this.interceptors)) {
      this.interceptors = []
    }
    handler && this.interceptors.push(formatInterceptor(handler, event))
    return this
  }
  copyFn.on =  function () {
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
    var filterInterceptors = this.interceptors ? this.interceptors.filter(function (item) {
      return item.event.indexOf('all') > -1 || item.event.indexOf(ages[0]) > -1
    }) : []
    if (ages[0] && typeof ages[0] !== 'string') {
      newEventFn = eventFn
    } else {
      newEventFn = function (event) {
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
          eventFn(event)
        }
      }
    }
    functionIndex > -1 && ages.splice(functionIndex, 1, newEventFn)
    return preOnFn.apply(this, ages)
  }

})(Zepto || jQuery)