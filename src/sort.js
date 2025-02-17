export function entity_sorter(hass, method) {
  if(typeof(method) === "string") {
    method = {method};
  }
  return function(a, b) {
    const entityA = typeof(a) === "string"
    ? hass.states[a]
    : hass.states[a.entity];
    const entityB = typeof(b) === "string"
    ? hass.states[b]
    : hass.states[b.entity];

    if(entityA === undefined || entityB === undefined) return 0;

    const [lt, gt] = method.reverse ? [-1, 1] : [1, -1];
    function compare(_a, _b) {
      if(method.ignore_case && _a.toLowerCase) _a = _a.toLowerCase();
      if(method.ignore_case && _b.toLowerCase) _b = _b.toLowerCase();
      if(_a === undefined && _b === undefined) return 0;
      if(_a === undefined) return lt;
      if(_b === undefined) return gt;
      if(_a < _b) return gt;
      if(_a > _b) return lt;
      return 0;
    }
    switch(method.method) {
      case "domain":
        return compare(
        entityA.entity_id.split(".")[0],
        entityB.entity_id.split(".")[0]
        );
      case "entity_id":
        return compare(
          entityA.entity_id,
          entityB.entity_id
          );
      case "friendly_name":
      case "name":
        return compare(
          entityA.attributes.friendly_name || entityA.entity_id.split(".")[1],
          entityB.attributes.friendly_name || entityB.entity_id.split(".")[1]
          );
      case "state":
        return compare(
          entityA.state,
          entityB.state
          );
      case "attribute":
        let _a = entityA.attributes;
        let _b = entityB.attributes;
        let attr = method.attribute;
        while(attr) {
          let k;
          [k, attr] = attr.split(":");
          _a = _a[k];
          _b = _b[k];
          if(_a === undefined && _b === undefined) return 0;
          if(_a === undefined) return lt;
          if(_b === undefined) return gt;
        }
        return compare(_a, _b);
      default:
        return 0;
    }
  }
}
