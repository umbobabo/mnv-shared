function MNVBasic(){
  // Set log Off
  var me = this;
  this.logEnabled = false;
  this.log = function (txt, error){
    // Disabled log but print errors anyway
    if(this.hasOwnProperty('logEnabled') && !this.logEnabled && typeof error === 'undefined'){
      return;
    }
    var msg = '';
    msg = (this.id !== undefined) ? this.id : 'Unspecified widget';
    msg += ' --> ' + txt;
    if(window.console && window.console.log){
      if(error && window.console.error){
        console.error( msg );
      } else {
        console.log( msg );
      }
    }
  };

  this.ready = function(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };

  this.trigger = function(ev, data){
    var myEvent;
    function noCustomEvent(ev, data){
      var myEvent = document.createEvent('CustomEvent');
      myEvent.initCustomEvent(ev, true, true, data);
      return myEvent;
    }
    if (window.CustomEvent) {
      try {
        myEvent = new CustomEvent(ev, {
          detail: data
        });
      }
      catch (e){
        myEvent = noCustomEvent(ev, data);
      }
    } else {
      myEvent = noCustomEvent(ev, data);
    }
    log('triggered: ' + ev + ' with data');
    this.dispatchEvent(myEvent);
  };

  this.ajax = function(url, fn, datatype){
    var request = new XMLHttpRequest(), dt = (typeof datatype !== 'undefined') ? datatype : 'json';
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data;
        if(dt==='json'){
          data = JSON.parse(request.responseText);
        } else {
          data = request.responseText;
        }
        fn(data);
      } else {
        // We reached our target server, but it returned an error
        log('Server error');
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      log(this.error);
    };

    request.send();
  }

  this.jsonp = function(url, callbackName, callback) {
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);

    window[callbackName] = function(data) {
      delete window[callbackName];
      // Get all the node List
      var scripts = document.getElementsByTagName('script');
      if(me.hasAttributeEqualTo(scripts, 'src', script.src )){
        document.body.removeChild(script);
      }
      callback(data);
    };
  }

  this.addClass = function(el, className){
    if (el.classList){
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  }

  this.removeClass = function(el, className){
    if (el.classList){
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  this.hasAttributeEqualTo = function(els, attr, val){
    if(els.tagName){
      return els.hasAttribute(attr) === val;
    } else {
      // els is a nodeList
      var i = 0;
      for(i=0; i< els.length; i++){
        if(els[i].hasAttribute(attr) && els[i][attr] === val){
          return els[i];
        }
      };
      return false;
    }
  }

  this.ordinal_suffix_of = function(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
  }

  this.addEventListenerByClass = function(className, event, fn) {
    var list = document.querySelectorAll(className);
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener(event, fn, false);
    }
  }

}

(function(funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);