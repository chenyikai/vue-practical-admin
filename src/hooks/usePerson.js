import * as turf from "@turf/turf";
import { createApp } from "vue";
import UserMarkerTemp from "@/components/UserMarkerTemp/UserMarkerTemp.vue";

class MyLatLng {
  constructor(lng, lat) {
    const Rc = 6378137; // 赤道半径
    const Rj = 6356725; // 极半径

    // 经度转为度分秒
    this.mLoDeg = lng;
    this.mLoMin = (lng - this.mLoDeg) * 60;
    this.mLoSec = (lng - this.mLoDeg - this.mLoMin / 60.0) * 3600;

    // 纬度转为度分秒
    this.mLaDeg = lat;
    this.mLaMin = (lat - this.mLaDeg) * 60;
    this.mLaSec = (lat - this.mLaDeg - this.mLaMin / 60.0) * 3600;

    this.mLongitude = lng;
    this.mLatitude = lat;
    this.mRadLo = (lng * Math.PI) / 180.0; // 经度弧度
    this.mRadLa = (lat * Math.PI) / 180.0; // 纬度弧度

    this.Ec = Rj + ((Rc - Rj) * (90.0 - this.mLatitude)) / 90.0;
    this.Ed = this.Ec * Math.cos(this.mRadLa);
  }
}

function courseAngle(lngA, latA, lngB, latB) {
  const A = new MyLatLng(lngA, latA);
  const B = new MyLatLng(lngB, latB);
  const dx = (B.mRadLo - A.mRadLo) * A.Ed;
  const dy = (B.mRadLa - A.mRadLa) * A.Ec;
  let angle = 0.0;
  angle = (Math.atan(Math.abs(dx / dy)) * 180.0) / Math.PI;
  const dLo = B.mLongitude - A.mLongitude;
  const dLa = B.mLatitude - A.mLatitude;
  if (dLo > 0 && dLa <= 0) {
    angle = 90.0 - angle + 90;
  } else if (dLo <= 0 && dLa < 0) {
    angle += 180.0;
  } else if (dLo < 0 && dLa >= 0) {
    angle = 90.0 - angle + 270;
  }
  return angle;
}

class PointLocation {
  /**
   *
   * @param {*} options
   * pointOrigin：左上角经纬度（原点，必须准确） {lon:120,lat:32}
   * pointDest：左上角到右上角这条直线上的任意一点（目标点，任意一点） {lon:120,lat:32}
   * 使用前两者画出一条平面的商演线
   * horDis与原点的横向距离，默认0
   * verDis与原点的纵向距离，默认0
   */
  constructor(options) {
    const { pointOrigin, pointDest, horDis, verDis } = options;
    this.pointOrigin = pointOrigin;
    this.pointDest = pointDest;
    if (horDis === 0) {
      this.horDis = 0;
    } else {
      this.horDis = horDis ? horDis / 1000 : this.horDis;
    }

    if (verDis === 0) {
      this.verDis = 0;
    } else {
      this.verDis = verDis ? verDis / 1000 : this.verDis;
    }
    this.transAngle = this.getAngleFromTwoPoints(
      this.pointOrigin,
      this.pointDest,
    );
  }

  /**
   *
   * @param {*} horDis horDis与元点的横向距离，默认0
   * @param {*} verDis verDis与元点的纵向距离，默认0
   * @returns 根据与原点的横向距离和纵向距离，计算出该点的经纬度
   */
  getTargetPoint(horDis, verDis) {
    if (horDis === 0) {
      this.horDis = 0;
    } else {
      this.horDis = horDis ? horDis / 1000 : this.horDis;
    }

    if (verDis === 0) {
      this.verDis = 0;
    } else {
      this.verDis = verDis ? verDis / 1000 : this.verDis;
    }
    const { lon, lat } = this.pointOrigin;
    const pointOrigin = turf.point([lon, lat]);
    const pointHor = turf.transformTranslate(pointOrigin, this.horDis, 90, {
      units: "kilometers",
    });
    const verAngle = this.verDis >= 0 ? 180 : 0;
    const pointHorVer = turf.transformTranslate(
      pointHor,
      this.verDis,
      verAngle,
      {
        units: "kilometers",
      },
    );
    const options = { pivot: [lon, lat] };
    const targetPoint = turf.transformRotate(
      pointHorVer,
      this.transAngle,
      options,
    );

    const lonT = targetPoint.geometry.coordinates[0];
    const latT = targetPoint.geometry.coordinates[1];
    return {
      lon: lonT,
      lat: latT,
    };
  }

  /**
   *
   * @param {*} lonA 原点经度
   * @param {*} latA 原点纬度
   * @param {*} lonB 目标点经度
   * @param {*} latB 目标点纬度
   * @returns 根据原点与目标点形成的射线，得到与正东方向的夹角
   */
  courseAngle(lonA, latA, lonB, latB) {
    const angle = courseAngle(lonA, latA, lonB, latB);
    return angle;
  }

  /**
   *
   * @param {*} pointA 原点
   * @param {*} pointB 目标点
   * @returns 根据原点与目标点形成的射线，得到与正北方向的夹角
   */
  getAngleFromTwoPoints(pointA, pointB) {
    const bearing = this.courseAngle(
      pointA.lon,
      pointA.lat,
      pointB.lon,
      pointB.lat,
    );
    return bearing > 90 ? bearing - 90 : 270 + bearing;
    // return bearing > 90 ? bearing - 90 : 360 - (bearing - 90);
  }
}

export default () => {
  const PERSON_DELETE = "person_delete";
  const PERSON_SET = "person_set";

  function tran({
    leftUpper: left,
    rightUpper: right,
    position: { x, y },
    p = 8.75,
  }) {
    const locationPoint = new PointLocation({
      pointOrigin: {
        lon: left.lng, // 左上角经度
        lat: left.lat, // 左上角纬度
      },
      pointDest: {
        lon: right.lng, // 右上角经度
        lat: right.lat, // 右上角纬度
      },
      horDis: 0,
      verDis: 0,
    });

    window.GET_TARGET_POINT = (position) => {
      return locationPoint.getTargetPoint(
        position[0] / Number(p),
        position[1] / Number(p),
      );
    };

    const { lon, lat } = window.GET_TARGET_POINT([x, y]);
    return {
      lng: lon,
      lat,
    };
  }

  function onPosition(val) {
    return new Promise((resolve, reject) => {
      try {
        if (val.data.deviceStatus === 2) {
          resolve({ type: PERSON_DELETE, data: val.data });
          return;
        }

        const dom = document.createElement("div");
        const dialog = createApp(UserMarkerTemp, {
          params: val.data,
        });
        dialog.mount(dom);

        const transformData = tran(val.data);
        const options = {
          ...val.data,
          id: val.data.cardId,
          lon: transformData.lng,
          lat: transformData.lat,
          element: dom,
        };

        resolve({ type: PERSON_SET, data: options });
      } catch (e) {
        reject(e);
      }
    });
  }

  return {
    PERSON_SET,
    PERSON_DELETE,
    PointLocation,
    tran,
    onPosition,
  };
};
