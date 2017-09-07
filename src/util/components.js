const registerComponents = (instance, Moon) => {
  // Router View Component
  Moon.extend("router-view", {
    functional: true,
    render: function(m) {
      return m(instance.current.component, {attrs: {route: instance.route}}, {dynamic: 1}, []);
    }
  });

  // Router Link Component
  Moon.extend("router-link", {
    functional: true,
    render: function(m, state) {
      const data = state.data;
      const to = data["to"];
      let meta = {
        dynamic: 1
      };

      const same = instance.current.path === to;

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
        data["href"] = `#${to}`;
      }

      delete data["to"];

      if(same === true) {
        if(data["class"] === undefined) {
          data["class"] = instance.activeClass;
        } else {
          data["class"] += ` ${instance.activeClass}`;
        }
      }

      return m('a', {attrs: data}, meta, state.insert);
    }
  });
}
