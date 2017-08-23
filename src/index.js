let Moon = null;

//=require ./util/constants.js
//=require ./util/defineProperty.js
//=require ./util/setup.js
//=require ./util/components.js
//=require ./util/map.js
//=require ./util/run.js

function MoonRouter(options) {
  // Moon Instance
  this.instance = null;

  // Base
  defineProperty(this, "base", options.base, "");

  // Default Route
  defineProperty(this, "default", options["default"], "/");

  // Route to Component Map
  const providedMap = options.map;
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
MoonRouter.init = (_Moon) => {
  Moon = _Moon;

  // Edit init for Moon to install Moon Router when given as an option
  var MoonInit = Moon.prototype.init;
  Moon.prototype.init = function() {
    if(this.options.router !== undefined) {
      this.router = this.options.router;
      this.router.install(this);
    }
    MoonInit.apply(this, arguments);
  }
}
