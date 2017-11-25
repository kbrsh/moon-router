let Moon;

//=require ./util/constants.js
//=require ./util/setup.js
//=require ./util/components.js
//=require ./util/map.js
//=require ./util/run.js

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
}

// Plugin init
MoonRouter.init = (_Moon) => {
  Moon = _Moon;
}
