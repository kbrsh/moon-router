/*
* Moon Router v0.0.1
* Copyright 2016-2017, Kabir Shah
* https://github.com/KingPixil/moon-router/
* Free to use under the MIT license.
* https://kingpixil.github.io/license
*/

(function(root, factory) {
  /* ======= Global Moon Router ======= */
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.MoonRouter = factory();
}(this, function() {
    var run = function (instance, path) {
      // Change Current Component and Build
      var parts = path.slice(1).split("/");
      var currentMapState = instance.map;
    
      for(var i = 0; i < parts.length; i++) {
        var part = parts[i];
        currentMapState = currentMapState[parts[i]];
        if(!currentMapState) {
          run(instance, instance.default);
          return false;
        }
      }
    
      instance.current = {
        path: path,
        component: currentMapState['@']
      };
    
      if(instance.instance) {
        instance.instance.build();
      }
    
      return true;
    }
    
    var map = function (instance, routes) {
      var routesMap = {};
    
      for(var route in routes) {
        var currentMapState = routesMap;
        var parts = route.slice(1).split("/");
        for(var i = 0; i < parts.length; i++) {
          var part = parts[i];
          currentMapState[part] = {};
          currentMapState = currentMapState[part];
        }
    
        currentMapState["@"] = routes[route];
      }
    
      return routesMap;
    }
    
    
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
      var self = this;
    
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
          return h('a', {attrs: {href: ("#" + (state.data['to']))}}, {shouldRender: true, eventListeners: {}}, state.slots['default']);
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
    MoonRouter.init = function (Moon) {
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
    
    return MoonRouter;
}));
