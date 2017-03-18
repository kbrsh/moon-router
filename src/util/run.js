const run = (instance, path) => {
  // Change Current Component and Build
  const parts = path.slice(1).split("/");
  let currentMapState = instance.map;

  for(let i = 0; i < parts.length; i++) {
    const part = parts[i];
    currentMapState = currentMapState[parts[i]];
    if(!currentMapState) {
      run(instance, instance.default);
      return false;
    }
  }

  instance.current = {
    path: path,
    component: currentMapState['@']
  };

  if(instance.instance) {
    instance.instance.build();
  }

  return true;
}
