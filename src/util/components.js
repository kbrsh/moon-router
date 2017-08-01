const registerComponents = (instance, Moon) => {
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
      const data = state.data;
      const to = data["to"];
      let meta = {
        shouldRender: true,
        eventListeners: {}
      };

      if(instance.listener !== null) {
        data["href"] = instance.base + to;
        meta.eventListeners.click = [function(event) {
          event.preventDefault();
          instance.listener(to);
        }];
      } else {
        data["href"] = `#${to}`;
      }

      delete data["to"];

      if(to === instance.current.path) {
        if(data["class"] === undefined) {
          data["class"] = instance.activeClass;
        } else {
          data["class"] += ` ${instance.activeClass}`;
        }
      }

      return m('a', {attrs: data}, meta, state.slots["default"]);
    }
  });
}
