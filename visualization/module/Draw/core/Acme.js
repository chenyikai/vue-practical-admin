import { point } from "@turf/turf";

class Acme {
  constructor(lonLat, properties, options) {
    this.position = lonLat;
    this.properties = properties;
    this.options = options;
  }

  getFeature() {
    return point([this.position], this.properties, this.options);
  }

  update({ lonLat, properties, options }) {
    this.position = lonLat || this.position;
    this.properties = properties || this.properties;
    this.options = options || this.options;

    return this.getFeature();
  }
}

export default Acme;
