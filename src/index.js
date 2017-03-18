//=require ./util/run.js
//=require ./util/map.js

function MoonRouter(opts) {
  // Moon Instance
  this.instance = null;

  // Default Route
  this.default = opts.default || '/';

  // Route to Component Map
  this.map = map(this, opts.map) || {};

  // Current Path
  this.current = {
    path: window.location.hash.slice(1) || window.location.pathname,
    component: null
  };

  // Alias to Access Instance
  let self = this;

  // Setup Router View Component
  MoonRouter.Moon.component("router-view", {
    functional: true,
    render: function(h) {
      return h(self.current.component, {attrs: {}}, {shouldRender: true, eventListeners: {}});
    }
  });

  // Setup Router Link Component
  MoonRouter.Moon.component("router-link", {
    functional: true,
    props: ['to'],
    render: function(h, state) {
      return h('a', {attrs: {href: `#${state.data['to']}`}}, {shouldRender: true, eventListeners: {}}, state.slots['default']);
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
    if(this.$opts.router) {
      this.$router = this.$opts.router;
      this.$router.install(this);
    }
    MoonInit.apply(this, arguments);
  }
}
