import RBush from "rbush";
import { polygon } from "@turf/turf";
export class Element {
  constructor(minX, minY, maxX, maxY) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
    this.position = null;
  }

  add(delta, position) {
    this.minX = this.minX + delta.x;
    this.maxX = this.maxX + delta.x;
    this.minY = this.minY + delta.y;
    this.maxY = this.maxY + delta.y;
    this.position = position;
  }

  rect() {
    return {
      x: Math.round(this.minX),
      y: Math.round(this.minY),
      x2: Math.round(this.maxX),
      y2: Math.round(this.maxY),
      w: Math.round(this.maxX - this.minX),
      h: Math.round(this.maxY - this.minY),
    };
  }

  polygon_() {
    return polygon([
      [
        [this.minX, this.minY],
        [this.maxX, this.minY],
        [this.maxX, this.maxY],
        [this.minX, this.maxY],
        [this.minX, this.minY],
      ],
    ]);
  }

  intersects(other) {
    return !(
      other.minX > this.maxX ||
      other.maxX < this.minX ||
      other.minY > this.maxY ||
      other.maxY < this.minY
    );
  }
}
// export const Position = {
//   center: 0,
//   top_right: 1,
//   bottom_right: 2,
//   bottom_left: 3,
//   top_left: 4,
//   right: 5,
//   bottom: 6,
//   left: 7,
//   top: 8,
// }
export const Position = {
  center: 0,
  top_right: 1,
  bottom_right: 2,
  bottom_left: 3,
  top_left: 4,
  // right: 5,
  // bottom: 6,
  // left: 7,
  // top: 8,
};
//碰撞实现
export class Collision {
  constructor(map, positionCallback, self) {
    this.map = map;
    this.text_tree = new RBush();
    this.ship_list = [];
    this.data = [];
    this.callback = positionCallback;
    this.rootThis = self;
  }

  // 单条插入 (计算原点)
  insert(obj) {
    this.data.push(obj);

    let bbox = this.callback(obj, this.map, Position.center);
    this.text_tree.insert(bbox);
  }
  // 单条插入（不计算原点）
  insert2(obj) {
    this.data.push(obj);
  }
  //排序 确保每个点位都是与[0,0]经纬度距离排序
  sort() {
    this.data.sort((a, b) => {
      const af = a;
      const bf = b;
      const ap = af.geometry;
      const bp = bf.geometry;

      // to 0,0
      const a_weight =
        ap.coordinates[0] * ap.coordinates[0] +
        ap.coordinates[1] * ap.coordinates[1];
      const b_weight =
        bp.coordinates[1] * bp.coordinates[1] +
        bp.coordinates[0] * bp.coordinates[0];

      if (a_weight > b_weight) {
        return 1;
      } else if (a_weight < b_weight) {
        return -1;
      }

      return 0;
    });
  }
  // 全部清空
  clear() {
    this.text_tree.clear();
    this.data.length = 0;
  }

  update() {
    const dpr = window.devicePixelRatio || 1;
    for (let datum of this.data) {
      let visibility = true;
      for (let i = 1; i < 5; ++i) {
        let bbox = this.callback(datum, this.map, i);
        const canvas_bbox = {
          minX: 0,
          minY: 0,
          maxX: this.map._canvas.width / dpr,
          maxY: this.map._canvas.height / dpr,
        };

        if (!bbox || !bbox.intersects(canvas_bbox)) {
          visibility = false;
          // datum.properties.visibility = false
          // datum.properties.imageName = `ehhTransparentShip`
          continue;
        }

        if (!this.text_tree.collides(bbox)) {
          bbox.raw = datum;
          bbox.visibility = true;
          // datum.properties.visibility = true
          // datum.properties.imageName = `ehhTransparentShip`
          this.text_tree.insert(bbox);
          break;
        }
      }
    }
    return this.text_tree.all();
  }
}
