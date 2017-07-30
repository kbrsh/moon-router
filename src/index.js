//=require ./util/run.js
//=require ./util/map.js

function MoonRouter(opts) {
  // Moon Instance
  this.instance = null;

  // Default Route
  this.default = opts.default || "/";

  // Route to Component Map
  this.map = map(opts.map) || {};

  // Current Path
  const initPath = window.location.hash.slice(1);
  this.current = {
    path: initPath || "/",
    component: null
  };
  if(initPath !== this.current.path) {
    window.location.hash = this.current.path;
  }

  // Route Context
  this.route = {};

  // Active Class
  this.activeClass = opts.activeClass || "router-link-active";

  // Alias to Access Instance
  let self = this;

  // Setup Router View Component
  MoonRouter.Moon.component("router-view", {
    functional: true,
    render: function(m) {
      return m(self.current.component, {attrs: {route: self.route}}, {shouldRender: true}, []);
    }
  });

  // Setup Router Link Component
  MoonRouter.Moon.component("router-link", {
    functional: true,
    render: function(m, state) {
      const data = state.data;
      const to = data["to"];
      data["href"] = `#${to}`;
      delete data["to"];

      if(to === self.current.path) {
        if(data["class"] === undefined) {
          data["class"] = self.activeClass;
        } else {
          data["class"] += ` ${self.activeClass}`;
        }
      }

      return m('a', {attrs: data}, {shouldRender: true}, state.slots["default"]);
    }
  });

  // Attach Event Listener
  window.onhashchange = function() {
    run(self, window.location.hash.slice(1) || window.location.pathname);
  }

  // Initialize Route
  run(this, this.current.path);
}

// Install MoonRouter to Moon Instance
MoonRouter.prototype.install = function(instance) {
  this.instance = instance;
}

// Init for Plugin
MoonRouter.init = (Moon) => {
  // Bind Current Moon to Moon Router
  MoonRouter.Moon = Moon;
  var MoonInit = Moon.prototype.init;

  // Edit init for Moon to install Moon Router when given as an option
  Moon.prototype.init = function() {
    if(this.$options.router !== undefined) {
      this.$router = this.$options.router;
      this.$router.install(this);
    }
    MoonInit.apply(this, arguments);
  }
}
