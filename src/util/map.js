const map = (routes) => {
  let routesMap = {};

  for(let route in routes) {
    let currentMapState = routesMap;

    // Split up by Parts
    const parts = route.slice(1).split("/");
    for(var i = 0; i < parts.length; i++) {
      let part = parts[i];

      // Found Named Parameter
      if(part[0] === ":") {
        let named = {
          name: part.slice(1)
        }
        currentMapState[":"] = named;
        part = ":"
      }

      // Add Part to Map
      if(currentMapState[part] === undefined) {
          currentMapState[part] = {};
      }
      currentMapState = currentMapState[part];
    }

    // Add Component
    currentMapState["@"] = routes[route];
  }

  return routesMap;
}
