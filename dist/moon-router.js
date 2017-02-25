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
    
    var this$1 = this;
    var goTo = function (instance, path) {
      window.location.hash = path;
      instance.current = {
        path: path,
        component: instance.map[path] ? instance.map[path] : instance.map[instance.default]
      }
      if(instance.instance) {
        instance.instance.build();
      }
    }
    
    
    function MoonRouter(opts) {
      this.default = opts.default || '/';
      this.map = opts.map || {};
      this.instance = false;
      this.current = {
        path: this.default,
        component: this.map[this.default]
      };
      var self = this;
    
      // Setup Router View Component
      MoonRouter.Moon.component("router-view", {
        functional: true,
        render: function(h) {
          return h(self.current.component, {}, {shouldRender: true, eventListeners: {}});
        }
      });
    
      // Setup Router Link Component
      MoonRouter.Moon.component("router-link", {
        functional: true,
        props: ['to'],
        render: function(h, ctx) {
          var navigate = function(e, path) {
            e.preventDefault();
            goTo(self, path);
          }
          return h('a', {
            href: "#" + ctx.data.to, class: self.current.path === ctx.data.to ? "router-link-active" : ""
          }, {
            shouldRender: true,
            eventListeners: {
            click: [function(e) {
              navigate(e, ctx.data.to)
            }]
          }}, ctx.slots.default);
        }
      });
    
      // Get hash (without '#') or the pathname
      var startRoute = window.location.hash.slice(1) || window.location.pathname;
      // Go to this url
      goTo(this, startRoute);
    }
    
    // Install MoonRouter to Moon Instance
    MoonRouter.prototype.install = function (instance) {
      this$1.instance = instance;
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
