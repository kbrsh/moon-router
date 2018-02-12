/**
 * Moon Router v0.1.3
 * Copyright 2016-2018 Kabir Shah
 * Released under the MIT License
 * https://github.com/kbrsh/moon-router
 */

const wildcardAlias = "*";
const queryAlias = "?";
const namedParameterAlias = ":";
const componentAlias = "@";

const map = (routes) => {
  let routesMap = {};

  for(let route in routes) {
    let currentMapState = routesMap;

    // Split up by parts
    const parts = route.substring(1).split("/");
    for(let i = 0; i < parts.length; i++) {
      let part = parts[i];

      // Found named parameter
      if(part[0] === namedParameterAlias) {
        let param = currentMapState[namedParameterAlias];
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
};

const run = (instance, path) => {
  // Change current component and build
  const parts = path.slice(1).split("/");
  let currentMapState = instance.map;
  let context = {
    query: {},
    params: {}
  };

  for(let i = 0; i < parts.length; i++) {
    let part = parts[i];

    // Query Parameters
    if(part.indexOf(queryAlias) !== -1) {
      const splitQuery = part.split(queryAlias);
      part = splitQuery.shift();

      for(let j = 0; j < splitQuery.length; j++) {
        const keyVal = splitQuery[j].split('=');
        context.query[keyVal[0]] = keyVal[1];
      }
    }

    if(currentMapState[part] === undefined) {
      let namedParameter = currentMapState[namedParameterAlias];

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
  const component = currentMapState[componentAlias];
  const components = instance.components;
  for(let i = 0; i < components.length; i++) {
    components[i].set("component", component);
  }

  return true;
};

const setup = (instance, mode) => {
  let getPath;
  let navigate;
  let custom = false;

  if(mode === undefined || mode === "hash") {
    // Setup Path Getter
    getPath = function() {
      return window.location.hash.substring(1);
    };

    // Create navigation function
    navigate = function(route) {
      window.location.hash = '#' + route;
      run(instance, route);
    };

    // Add hash change listener
    window.addEventListener("hashchange", function() {
      run(instance, instance.getPath());
    });
  } else if(mode === "history") {
    // Setup Path Getter
    getPath = function() {
      return window.location.pathname;
    };

    // Create navigation function
    navigate = function(route) {
      history.pushState(null, null, route);
      run(instance, route);
    };

    // Create listener
    custom = true;
    window.addEventListener("popstate", function() {
      run(instance, instance.getPath());
    });
  }

  instance.getPath = getPath;
  instance.navigate = navigate;
  instance.custom = custom;
};

const registerComponents = (instance, Moon) => {
  // Router View component
  Moon.extend("router-view", {
    data: function() {
      return {
        component: undefined
      }
    },
    render: function(m) {
      const currentComponent = this.get("component");
      let children;

      if(currentComponent === undefined) {
        children = [];
      } else {
        children = [m(currentComponent, {attrs: {route: instance.route}}, {}, [])];
      }

      return m("span", {}, {}, children);
    },
    hooks: {
      init() {
        instance.components.push(this);
      }
    }
  });

  // Router Link component
  Moon.extend("router-link", {
    props: ["to"],
    render: function(m) {
      const to = this.get("to");
      let attrs = {};
      let meta = {};

      const same = instance.current === to;

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
      init() {
        instance.components.push(this);
      }
    }
  });
};

let Moon;

function MoonRouter(options) {
  // Instance
  this.instance = undefined;

  // Default route
  const defaultRoute = options["default"];
  if(defaultRoute === undefined) {
    this["default"] = "/";
  } else {
    this["default"] = defaultRoute;
  }

  // Route to component map
  const providedMap = options.map;
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
  const activeClass = options.activeClass;
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
};

// Plugin init
MoonRouter.init = (_Moon) => {
  Moon = _Moon;
};

export default MoonRouter;
