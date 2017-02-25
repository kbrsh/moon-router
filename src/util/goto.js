const goTo = (instance, path) => {
  window.location.hash = path;
  instance.current = {
    path: path,
    component: instance.map[path] ? instance.map[path] : instance.map[instance.default]
  }
  if(instance.instance) {
    instance.instance.build();
  }
}
