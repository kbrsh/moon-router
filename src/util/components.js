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
}
