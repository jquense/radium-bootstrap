'use strict';

var { canUseDOM } = require('react/lib/ExecutionEnvironment');

var endEvent;

if ( canUseDOM ) {
  var el = document.createElement("div");

  if ( 'transition' in el.style )
    endEvent = 'transitionend'

  el = null;
}

module.exports = {

  support: !!endEvent,

  on: function(node, handler, duration) {
    var fakeEvent = { target: node, currentTarget: node }
      , fired;

    if(!!endEvent){
      node.addEventListener(endEvent, done);

      setTimeout(function(){
        if (!fired) done(fakeEvent)
      }, duration || 2000)

    } else
      setTimeout(done.bind(null, fakeEvent), 0)

    function done(event) {
      if (event.target !== event.currentTarget) return
      fired = true
      event.target.removeEventListener(endEvent, done);
      handler.call(this)
    }
  }
}

