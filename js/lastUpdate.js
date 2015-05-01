/*
  Author: Umberto Babini.
  Purpose: Provide a simple update of a field
*/
function MNVLastUpdate(container, selector, fadeOutTiming, timestamp){
  var update, tag, elSelector, fadeOutTiming, me, defaultTimestamp;
  // Set default value
  elSelector = (typeof selector === 'undefined') ? '.last-update' : selector;
  fadeOutTiming = (typeof selector === 'undefined') ? 2000 : fadeOutTiming;
  me = this;
  tag = container.querySelector(elSelector);

  update = function(){
    var timestampString = (typeof timestamp === 'function') ? timestamp() : timestamp;
    if(tag.length===0){
      me.log('Unable to find the element ' + elSelector);
    } else {
      me.addClass(tag, 'highlight');
      (document.all) ? (tag.innerText = timestampString) : (tag.textContent = timestampString);
      // Remove higlight after fadeOutTiming
      setTimeout(function(){
        me.removeClass(container.querySelector(elSelector), 'highlight');
      }, fadeOutTiming);
    }
  };

  defaultTimestamp = function(){
    var d = new Date();
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var n = weekday[d.getDay()];
    return n + ' ' + d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' at ' + d.getHours() + ':' + d.getMinutes() ;
  }
  me.addClass(tag, 'not-highlight');
  timestamp = (typeof timestamp === 'undefined') ? defaultTimestamp : timestamp;
  update();

  return {
    update: update
  }
}

MNVLastUpdate.prototype = new MNVBasic();