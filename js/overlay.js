/*
  Author: Umberto Babini.
  Purpose: Switch an existing DOM element into a pop-up with overlay
*/
function MNVOverlay(){
  var me = this;
  this.addEventListenerByClass('.mnv-overlay', 'click', activateOverlay);

  function activateOverlay(e){
    var child = this.children[0], overlay = this, close;
    me.addClass(this, 'mnv-overlay-active');
    close = document.createElement('div');
    me.addClass(close, 'mnv-overlay-close');
    child.appendChild(close);
    close.addEventListener('click', function(e){
      me.removeClass(overlay, 'mnv-overlay-active');
      this.remove();
      e.preventDefault();
      e.stopPropagation();
    });
  };
}

MNVOverlay.prototype = new MNVBasic();

docReady(function(){
  new MNVOverlay();
});