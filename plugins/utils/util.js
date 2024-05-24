/**
 * 添加空图层
 */
export function addLayer(map, val) {
  if (!map.getLayer(val)) {
    map.addLayer({
      ...val,
    });
  }
}
/**
 * 移除图层
 */
export function clearByLayer(map, val) {
  if (map.getLayer(val)) {
    map.removeLayer(val);
  }
}
/**
 * 添加空数据源
 * 注意 setData 空数据 使用
 * { 'type' : 'FeatureCollection', 'features' : [] }
 */
export function addSource(map, sourceName) {
  if (!map.getSource(sourceName)) {
    map.addSource(sourceName, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
  }
}
export function changeSource(map, sourceName, val) {
  if (map.getSource(sourceName)) {
    if (!val) {
      map.getSource(sourceName).setData({
        type: "FeatureCollection",
        features: [],
      });
    } else {
      map.getSource(sourceName).setData(val);
    }
  }
}
export function clearBySource(map, val) {
  if (map.getSource(val)) {
    map.getSource(val).setData({
      type: "FeatureCollection",
      features: [],
    });
  }
}
export function removeBySource(map, val) {
  if (map.getSource(val)) {
    map.removeSource(val);
  }
}

export function addImageData(map, imgInfo) {
  if (!map.hasImage(imgInfo.name)) {
    if (imgInfo.option) {
      map.addImage(imgInfo.name, imgInfo.imgData, imgInfo.option);
    } else {
      map.addImage(imgInfo.name, imgInfo.imgData);
    }
  }
}
export function addUrlImage(map, imgInfo) {
  map.loadImage(imgInfo.url, function (error, image) {
    if (error) throw error;
    // addImageData(map, imgInfo)
    if (!map.hasImage(imgInfo.name)) {
      if (imgInfo.option) {
        map.addImage(imgInfo.name, image, imgInfo.option);
      } else {
        map.addImage(imgInfo.name, image);
      }
    }
  });
}

export function removeImage(map, imgName) {
  if (map.hasImage(imgName)) map.removeImage(imgName);
}
