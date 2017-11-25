/**
 * Moon Router v0.1.3
 * Copyright 2016-2017 Kabir Shah
 * Released under the MIT License
 * https://github.com/kbrsh/moon-router
 */

(function(root, factory) {
  /* ======= Global Moon Router ======= */
  if(typeof module === "undefined") {
    root.MoonRouter = factory();
  } else {
    module.exports = factory();
  }
}(this, function() {
    var Moon;
    
    var wildcardAlias = "*";
    var queryAlias = "?";
    var namedParameterAlias = ":";
    var componentAlias = "@";
    
    var setup = function (instance, mode) {
      var getPath;
      var navigate;
      var custom = false;
    
      if(mode === undefined || mode === "hash") {
        // Setup Path Getter
        getPath = function() {
          return window.location.hash.substring(1);
        }
    
        // Create navigation function
        navigate = function(route) {
          window.location.hash = '#' + route;
          run(instance, route);
        }
    
        // Add hash change listener
        window.addEventListener("hashchange", function() {
          run(instance, instance.getPath());
        });
      } else if(mode === "history") {
        // Setup Path Getter
        getPath = function() {
          return window.location.pathname;
        }
    
        // Create navigation function
        navigate = function(route) {
          history.pushState(null, null, route);
          run(instance, route);
        }
    
        // Create listener
        custom = true;
        window.addEventListener("popstate", function() {
          run(instance, instance.getPath());
        });
      }
    
      instance.getPath = getPath;
      instance.navigate = navigate;
      instance.custom = custom;
    }
    
    var registerComponents = function (instance, Moon) {
      // Router View component
      Moon.extend("router-view", {
        data: function() {
          return {
            component: undefined
          }
        },
        render: function(m) {
          var currentComponent = this.get("component");
          var children;
    
          if(currentComponent === undefined) {
            children = [];
          } else {
            children = [m(currentComponent, {attrs: {route: instance.route}}, {}, [])];
          }
    
          return m("span", {}, {}, children);
        },
        hooks: {
          init: function init() {
            instance.components.push(this);
          }
        }
      });
    
      // Router Link component
      Moon.extend("router-link", {
        props: ["to"],
        render: function(m) {
          var to = this.get("to");
          var attrs = {};
          var meta = {};
    
          var same = instance.current === to;
    
          if(instance.custom === true) {
            attrs.href = to;
            meta.events = {
              "click": [function(event) {
                event.preventDefault();
                if(same === false) {
                  instance.navigate(to);
                }
              }]
            };
          } else {
            attrs.href = '#' + to;
          }
    
          if(same === true) {
            attrs["class"] = instance.activeClass;
          }
    
          return m('a', {attrs: attrs}, meta, this.insert);
        },
        hooks: {
          init: function init$1() {
            instance.components.push(this);
          }
        }
      });
    }
    
    var map = function (routes) {
      var routesMap = {};
    
      for(var route in routes) {
        var currentMapState = routesMap;
    
        // Split up by parts
        var parts = route.substring(1).split("/");
        for(var i = 0; i < parts.length; i++) {
          var part = parts[i];
    
          // Found named parameter
          if(part[0] === ":") {
            var param = currentMapState[namedParameterAlias];
            if(param === undefined) {
              currentMapState[namedParameterAlias] = {
                name: part.substring(1)
              };
            } else {
              param.name = part.substring(1);
            }
    
            currentMapState = currentMapState[namedParameterAlias];
          } else {
            // Add part to map
            if(currentMapState[part] === undefined) {
                currentMapState[part] = {};
            }
    
            currentMapState = currentMapState[part];
          }
        }
    
        // Add component
        currentMapState["@"] = routes[route];
      }
    
      return routesMap;
    }
    
    var run = function (instance, path) {
      // Change current component and build
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
          var namedParameter = currentMapState[namedParameterAlias];
    
          if(namedParameter !== undefined) {
            // Named Parameter
            context.params[namedParameter.name] = part;
            part = namedParameterAlias;
          } else if(currentMapState[wildcardAlias] !== undefined) {
            // Wildcard
            part = wildcardAlias;
          }
        }
    
        // Move through state
        currentMapState = currentMapState[part];
    
        // Path not in map
        if(currentMapState === undefined) {
          run(instance, instance.default);
          return false;
        }
      }
    
      // Handler not in map
      if(currentMapState[componentAlias] === undefined) {
        run(instance, instance.default);
        return false;
      }
    
      // Setup current information
      instance.current = path;
    
      // Setup Route Context
      instance.route = context;
    
      // Build Instance
      instance.instance.build();
    
      // Build components
      var component = currentMapState[componentAlias];
      var components = instance.components;
      for(var i$1 = 0; i$1 < components.length; i$1++) {
        components[i$1].set("component", component);
      }
    
      return true;
    }
    
    
    function MoonRouter(options) {
      // Instance
      this.instance = undefined;
    
      // Default route
      var defaultRoute = options["default"];
      if(defaultRoute === undefined) {
        this["default"] = "/";
      } else {
        this["default"] = defaultRoute;
      }
    
      // Route to component map
      var providedMap = options.map;
      if(providedMap === undefined) {
        this.map = {};
      } else {
        this.map = map(providedMap);
      }
    
      // Route context
      this.route = {};
    
      // Components
      this.components = [];
    
      // Active class
      var activeClass = options.activeClass;
      if(activeClass === undefined) {
        this.activeClass = "router-link-active";
      } else {
        this.activeClass = activeClass;
      }
    
      // Register components
      registerComponents(this, Moon);
    
      // Initialize route
      setup(this, options.mode);
    }
    
    // Install router to instance
    MoonRouter.prototype.init = function(instance) {
      this.instance = instance;
      this.navigate(this.getPath());
    }
    
    // Plugin init
    MoonRouter.init = function (_Moon) {
      Moon = _Moon;
    }
    
    return MoonRouter;
}));
