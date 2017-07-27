if(document.getElementById("els")) {
  var els = document.getElementById("els");
} else {
  var els = document.createElement("div");
  els.id = "els";
  document.body.appendChild(els);
}

var createTestElement = function(id, html) {
  var el = document.createElement("div");
  el.setAttribute("m-mask", "");
  el.innerHTML = html;
  el.id = id;
  els.appendChild(el);
  return el;
}

var wait = function(cb) {
  return new Promise(function(resolve, reject) {
    Moon.nextTick(function() {
      try {
        if(cb.toString().indexOf("done") !== -1) {
          cb(resolve);
        } else {
          cb();
          resolve();
        }
      } catch(err) {
        reject(err);
      }
    });
  });
}
