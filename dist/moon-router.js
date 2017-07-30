/**
 * Moon Router v0.1.3
 * Copyright 2016-2017 Kabir Shah
 * Released under the MIT License
 * https://github.com/KingPixil/moon-router
 */

(function(root, factory) {
  /* ======= Global Moon Router ======= */
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.MoonRouter = factory();
}(this, function() {
    var run = function (instance, path) {
      // Change Current Component and Build
      var parts = path.slice(1).split("/");
      var currentMapState = instance.map;
      var context = {
        query: {},
        params: {}
      }
    
      for(var i = 0; i < parts.length; i++) {
        var part = parts[i];
    
        // Query Parameters
        if(part.indexOf("?") !== -1) {
          var splitQuery = part.split("?");
          part = splitQuery.shift();
    
          for(var j = 0; j < splitQuery.length; j++) {
            var keyVal = splitQuery[j].split('=');
            context.query[keyVal[0]] = keyVal[1];
          }
        }
    
        if(currentMapState[part] === undefined) {
          if(currentMapState["*"]) {
            // Wildcard
            part = "*";
          } else if(currentMapState[":"]) {
            // Named Parameters
            context.params[currentMapState[":"].name] = part;
            part = ":";
          }
        }
    
        // Move through State
        currentMapState = currentMapState[part];
    
        // Path Not In Map
        if(currentMapState === undefined) {
          run(instance, instance.default);
          return false;
        }
      }
    
      // Handler not in Map
      if(currentMapState['@'] === undefined) {
        run(instance, instance.default);
        return false;
      }
    
      instance.current = {
        path: path,
        component: currentMapState['@']
      };
    
      // Setup Route Context
      instance.route = context;
    
      // Build Moon Instance
      if(instance.instance !== null) {
        instance.instance.build();
      }
    
      return true;
    }
    
    var map = function (routes) {
      var routesMap = {};
    
      for(var route in routes) {
        var currentMapState = routesMap;
    
        // Split up by Parts
        var parts = route.slice(1).split("/");
        for(var i = 0; i < parts.length; i++) {
          var part = parts[i];
    
          // Found Named Parameter
          if(part[0] === ":") {
            var named = {
              name: part.slice(1)
            }
            currentMapState[":"] = named;
            part = ":"
          }
    
          // Add Part to Map
          if(currentMapState[part] === undefined) {
              currentMapState[part] = {};
          }
          currentMapState = currentMapState[part];
        }
    
        // Add Component
        currentMapState["@"] = routes[route];
      }
    
      return routesMap;
    }
    
    
    function MoonRouter(opts) {
      // Moon Instance
      this.instance = null;
    
      // Default Route
      this.default = opts.default || "/";
    
      // Route to Component Map
      this.map = map(opts.map) || {};
    
      // Current Path
      var initPath = window.location.hash.slice(1);
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
      var self = this;
    
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
          var data = state.data;
          var to = data["to"];
          data["href"] = "#" + to;
          delete data["to"];
    
          if(to === self.current.path) {
            if(data["class"] === undefined) {
              data["class"] = self.activeClass;
            } else {
              data["class"] += " " + (self.activeClass);
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
    MoonRouter.init = function (Moon) {
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
    
    return MoonRouter;
}));
