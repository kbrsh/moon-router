/**
 * Moon Router v0.1.3
 * Copyright 2016-2017 Kabir Shah
 * Released under the MIT License
 * https://github.com/kbrsh/moon-router
 */

(function(root, factory) {
  /* ======= Global Moon Router ======= */
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.MoonRouter = factory();
}(this, function() {
    var Moon = null;
    
    var wildcardAlias = "*";
    var queryAlias = "?";
    var namedParameterAlias = ":";
    var componentAlias = "@";
    
    var defineProperty = function(obj, prop, value, def) {
      if(value === undefined) {
        obj[prop] = def;
      } else {
        obj[prop] = value;
      }
    }
    
    var setup = function (instance, mode) {
      var getPath = null;
      var navigate = null;
      var custom = false;
    
      if(mode === undefined) {
        // Setup Path Getter
        getPath = function() {
          var path = window.location.hash.slice(1);
    
          if(path.length === 0) {
            path = "/";
          }
    
          return path;
        }
    
        // Create navigation function
        navigate = function(route) {
          window.location.hash = route;
          run(instance, route);
        }
    
        // Add hash change listener
        window.addEventListener("hashchange", function() {
          instance.navigate(instance.getPath());
        });
      } else if(mode === "history") {
        // Setup Path Getter
        getPath = function() {
          var path = window.location.pathname.substring(instance.base.length);
    
          if(path.length === 0) {
            path = "/";
          }
    
          return path;
        }
    
        // Create navigation function
        navigate = function(route) {
          history.pushState(null, null, instance.base + route);
          run(instance, route);
        }
    
        // Create listener
        custom = true;
        window.addEventListener("popstate", function() {
          run(instance, instance.getPath());
        });
      }
    
      var initPath = getPath();
      instance.current = {
        path: initPath,
        component: null
      };
    
      instance.getPath = getPath;
      instance.navigate = navigate;
      instance.custom = custom;
    
      navigate(initPath);
    }
    
    var registerComponents = function (instance, Moon) {
      // Router View Component
      Moon.component("router-view", {
        functional: true,
        render: function(m) {
          return m(instance.current.component, {attrs: {route: instance.route}}, {shouldRender: true}, []);
        }
      });
    
      // Router Link Component
      Moon.component("router-link", {
        functional: true,
        render: function(m, state) {
          var data = state.data;
          var to = data["to"];
          var meta = {
            shouldRender: true
          };
    
          var same = instance.current.path === to;
    
          if(instance.custom === true) {
            data["href"] = instance.base + to;
            meta.eventListeners = {
              "click": [function(event) {
                event.preventDefault();
                if(same === false) {
                  instance.navigate(to);
                }
              }]
            };
          } else {
            data["href"] = "#" + to;
          }
    
          delete data["to"];
    
          if(same === true) {
            if(data["class"] === undefined) {
              data["class"] = instance.activeClass;
            } else {
              data["class"] += " " + (instance.activeClass);
            }
          }
    
          return m('a', {attrs: data}, meta, state.slots["default"]);
        }
      });
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
            var param = currentMapState[namedParameterAlias];
            if(param === undefined) {
              currentMapState[namedParameterAlias] = {
                name: part.slice(1)
              };
            } else {
              param.name = part.slice(1);
            }
    
            currentMapState = currentMapState[namedParameterAlias];
          } else {
            // Add Part to Map
            if(currentMapState[part] === undefined) {
                currentMapState[part] = {};
            }
    
            currentMapState = currentMapState[part];
          }
        }
    
        // Add Component
        currentMapState["@"] = routes[route];
      }
    
      return routesMap;
    }
    
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
        if(part.indexOf(queryAlias) !== -1) {
          var splitQuery = part.split(queryAlias);
          part = splitQuery.shift();
    
          for(var j = 0; j < splitQuery.length; j++) {
            var keyVal = splitQuery[j].split('=');
            context.query[keyVal[0]] = keyVal[1];
          }
        }
    
        if(currentMapState[part] === undefined) {
          var namedParameter = null;
    
          if(currentMapState[wildcardAlias] !== undefined) {
            // Wildcard
            part = wildcardAlias;
          } else if((namedParameter = currentMapState[namedParameterAlias]) !== undefined) {
            // Named Parameters
            context.params[namedParameter.name] = part;
            part = namedParameterAlias;
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
      if(currentMapState[componentAlias] === undefined) {
        run(instance, instance.default);
        return false;
      }
    
      // Setup current information
      instance.current = {
        path: path,
        component: currentMapState[componentAlias]
      };
    
      // Setup Route Context
      instance.route = context;
    
      // Build Moon Instance
      if(instance.instance !== null) {
        instance.instance.build();
      }
    
      return true;
    }
    
    
    function MoonRouter(options) {
      // Moon Instance
      this.instance = null;
    
      // Base
      defineProperty(this, "base", options.base, "");
    
      // Default Route
      defineProperty(this, "default", options["default"], "/");
    
      // Route to Component Map
      var providedMap = options.map;
      if(providedMap === undefined) {
        this.map = {};
      } else {
        this.map = map(providedMap);
      }
    
      // Route Context
      this.route = {};
    
      // Active Class
      defineProperty(this, "activeClass", options["activeClass"], "router-link-active");
    
      // Register Components
      registerComponents(this, Moon);
    
      // Initialize Route
      setup(this, options.mode);
    }
    
    // Install MoonRouter to Moon Instance
    MoonRouter.prototype.install = function(instance) {
      this.instance = instance;
    }
    
    // Init for Plugin
    MoonRouter.init = function (_Moon) {
      Moon = _Moon;
    
      // Edit init for Moon to install Moon Router when given as an option
      var MoonInit = Moon.prototype.init;
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
