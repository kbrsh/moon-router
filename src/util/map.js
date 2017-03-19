const map = (instance, routes) => {
  let routesMap = {};

  for(let route in routes) {
    let currentMapState = routesMap;

    // Split up by Parts
    const parts = route.slice(1).split("/");
    for(var i = 0; i < parts.length; i++) {
      const part = parts[i];

      // Found Named Parameter
      if(part[0] === ":") {
        currentMapState[":"] = part.slice(1);
      }

      // Add Part to Map
      if(!currentMapState[part]) {
          currentMapState[part] = {};
      }
      currentMapState = currentMapState[part];
    }

    // Add Component
    currentMapState["@"] = routes[route];
  }

  return routesMap;
}
