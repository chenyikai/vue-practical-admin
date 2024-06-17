<script setup>
import { ref, watch, onMounted } from "vue";
import { mapStore } from "@/store/index.js";
// import { Mapbox } from "plugins/index.js";
import wind4 from "@/assets/images/map/wind/4.png";
import wind5 from "@/assets/images/map/wind/5.png";
import wind6 from "@/assets/images/map/wind/6.png";
import wind7 from "@/assets/images/map/wind/7.png";
import wind8 from "@/assets/images/map/wind/8.png";
import wind9 from "@/assets/images/map/wind/9.png";
import wind10 from "@/assets/images/map/wind/10.png";
import wind11 from "@/assets/images/map/wind/11.png";
import wind12 from "@/assets/images/map/wind/12.png";
import { kvToJson } from "@/utils/util.js";
import { Mapbox } from "plugins/index.js";
import {
  getWindZlevelColors,
  getAreasWithSixHourForecast,
} from "@/api/map/meteorology.js";

defineOptions({
  name: "FisheryMeteorology",
});

const MapStore = mapStore();
const isShow = ref(false);
const images = {
  4: wind4,
  5: wind5,
  6: wind6,
  7: wind7,
  8: wind8,
  9: wind9,
  10: wind10,
  11: wind11,
  12: wind12,
  "12-": wind12,
};
const rotateList = {
  北: 0,
  东北偏北: 30,
  东北: 45,
  东北偏东: 60,
  东: 90,
  东南偏东: 120,
  东南: 135,
  东南偏南: 150,
  南: 180,
  西南偏南: 210,
  西南: 225,
  西南偏西: 240,
  西: 270,
  西北偏西: 300,
  西北偏北: 315,
};
let promiseList = ref([]);

let groundList = ref([]);
let forecastData = ref(new Map());
let weatherData = ref([]);
let activeGround = ref(undefined);
let vcolors = ref([]);

function open(data) {
  if (data === 3) {
    isShow.value = true;
    Mapbox.getMap()
      .getStyle()
      .layers.forEach((layer) => {
        if (layer.id.startsWith("ehh-fishing-ground")) {
          Mapbox.getMap().setLayoutProperty(layer.id, "visibility", "visible");
        }
      });
    getFishingGroundData();
  } else {
    Mapbox.getMap()
      .getStyle()
      .layers.forEach((layer) => {
        if (layer.id.startsWith("ehh-fishing-ground")) {
          Mapbox.getMap().setLayoutProperty(layer.id, "visibility", "none");
        }
      });
    isShow.value = false;
  }
}

async function createFishingGroundIconImage(
  map,
  timestrap,
  dataList = [],
  colors,
) {
  for (const key of Object.keys(images)) {
    promiseList.value.push(
      new Promise((resolve) => {
        const src = images[key];
        images[key] = new Image();
        images[key].src = src;
        images[key].onload = () => {
          resolve();
        };
      }),
    );
  }
  await Promise.all(promiseList.value);

  const canvas = document.createElement("canvas");
  canvas.width = 169;
  canvas.height = 57;
  const ctx = canvas.getContext("2d");

  const imageCanvas = document.createElement("canvas");

  function getImage(image, properties) {
    imageCanvas.width = 30;
    imageCanvas.height = 30;
    const imageCanvasContext = imageCanvas.getContext("2d");
    imageCanvasContext.clearRect(0, 0, 100, 100);
    imageCanvasContext.translate(15, 15);
    imageCanvasContext.rotate(
      (Math.PI / 180) * rotateList[properties.windDirection],
    );
    imageCanvasContext.translate(-15, -15);
    imageCanvasContext.drawImage(image, 0, 0, 30, 30);

    const imageData = imageCanvasContext.getImageData(0, 0, 30, 30);

    // for (let i = 0; i < imageData.data.length; i += 4) {
    //   let r = imageData.data[i];
    //   let g = imageData.data[i + 1];
    //   let b = imageData.data[i + 2];
    //   let a = imageData.data[i + 3];
    //   if (r !== 0 || g !== 0 || b !== 0 || a !== 0) {
    //     const newR = parseInt(`0x${color.substring(1, 3)}`, 16);
    //     const newG = parseInt(`0x${color.substring(3, 5)}`, 16);
    //     const newB = parseInt(`0x${color.substring(5, 7)}`, 16);
    //     imageData.data[i] = newR;
    //     imageData.data[i + 1] = newG;
    //     imageData.data[i + 2] = newB;
    //   }
    // }
    imageCanvasContext.clearRect(0, 0, 100, 100);
    imageCanvasContext.putImageData(imageData, 0, 0);

    // imageCanvasContext.translate(-15, -15);

    // const newImage = new Image();
    // newImage.src = imageCanvas.toDataURL();
    // imageCanvasContext.rotate(-15);
    // imageCanvasContext.rotate(
    //   -(Math.PI / 180) * rotateList[properties.windDirection]
    // );
    return imageCanvas;
  }

  async function createBackgroundContent(
    x,
    y,
    width,
    height,
    radius,
    colors,
    properties,
  ) {
    const color = colors.find(
      (item) => item.value.toString() === properties.windZLevel,
    );

    ctx.fillStyle = `${color.color || colors[0].color}CC`;

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;

    const r = x + width;
    const b = y + height;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(r - radius, y);
    ctx.quadraticCurveTo(r, y, r, y + radius);
    ctx.lineTo(r, y + height - radius);
    ctx.quadraticCurveTo(r, b, r - radius, b);
    ctx.lineTo(x + radius, b);
    ctx.quadraticCurveTo(x, b, x, b - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
    ctx.beginPath();
    // 绘制左边圆形
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(x, y + height / 2, height / 2 + 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    if (properties.windZLevel) {
      if (parseInt(properties.windZLevel) <= 4) {
        const image = images[4];
        ctx.drawImage(image, x - 14, y - 5, 30, 30);
      } else {
        const image = images[properties.windZLevel];
        const imagev = getImage(
          image,
          // color.color || colors[colors.length - 1].color
          properties,
        );
        ctx.drawImage(imagev, x - 14, y - 2, 30, 30);
      }
    }

    let text = "";
    if (properties.windZLevel === "12-") {
      text += "12级以上";
      text += "  ";
      if (properties.wave === "7-") {
        text += "7米以上";
      } else {
        text += `${properties.wave}米`;
      }
    } else {
      text += properties.windZLevel
        .split("-")
        .map((item) => `${item}级`)
        .join("~");
      text += "  ";
      text += `${properties.wave}米`;
    }

    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.font = "bold 14px 微软雅黑";

    ctx.fillText(text, x + 25, y + 19);
  }

  function createName(name) {
    ctx.restore();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = "normal 16px Microsoft YaHei";
    ctx.textBaseline = "bottom";
    const textWidth = ctx.measureText(name).width + 2;
    if (textWidth > 169) {
      canvas.width = textWidth;
    }
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = "normal 16px Microsoft YaHei";
    ctx.textBaseline = "bottom";
    ctx.strokeText(name, canvas.width / 2, 20);
    ctx.fillText(name, canvas.width / 2, 20);
  }

  for (let data of dataList) {
    ctx.clearRect(0, 0, 5000, 1000);

    createName(data.properties.name);

    if (canvas.width > 170) {
      await createBackgroundContent(
        canvas.width / 2 - 70,
        26,
        150,
        24,
        12,
        colors,
        data.properties,
      );
    } else {
      await createBackgroundContent(
        17,
        26,
        150,
        24,
        12,
        colors,
        data.properties,
      );
    }

    map.addImage(
      data.properties.code + timestrap,
      ctx.getImageData(0, 0, canvas.width, canvas.height),
    );
  }
}

function initMap() {
  getColorMap().then(() => {
    addListener(Mapbox.getMap());
  });
}

function getColorMap() {
  return new Promise((resolve) => {
    getWindZlevelColors().then(({ data }) => {
      const colors = data.data;
      vcolors.value = colors;
      const fillColorExpressions = [
        "case",
        ["has", "windZLevel"],
        [
          "match",
          ["get", "windZLevel"],
          ...colors
            .map((colorItem) => [colorItem.value.toString(), colorItem.color])
            .flat(),
          colors[0].color,
        ],
        "#FFFFFF",
      ];
      createGroundFill(fillColorExpressions);
      resolve();
    });
  });
}

function createGroundFill(Property) {
  const layer = {
    id: "ehh-fishing-ground-fill",
    type: "fill",
    source: "ehh-fishing-ground",
    layout: {
      visibility: "none",
    },
    paint: {
      "fill-color": Property,
      "fill-opacity": ["case", ["has", "windZLevel"], 0.5, 0.5],
    },
  };
  const groundStorke = {
    id: "ehh-fishing-ground-storke",
    type: "line",
    source: "ehh-fishing-ground",
    layout: {
      visibility: "none",
    },
    paint: {
      "line-color": "#FFFFFF",
      "line-width": 1,
    },
  };
  const groundName = {
    id: "ehh-fishing-ground-name",
    type: "symbol",
    source: "ehh-fishing-ground",
    filter: ["all", ["==", "$type", "Point"]],
    layout: {
      visibility: "none",
      "icon-image": ["concat", ["get", "code"], ["get", "timestrap"]],
      // "text-allow-overlap": false,
      // "text-field": ["get", "name"],
      "icon-size": [
        "interpolate",
        ["exponential", 1],
        ["zoom"],
        1,
        0.3,
        5,
        1,
        20,
        1,
      ],
      "icon-pitch-alignment": "map",
      "icon-rotation-alignment": "map",
    },
    paint: {
      // "text-color": "#000000",
      // "icon-halo-color": "#FFFFFF",
      // "icon-halo-width": 1,
    },
    minzoom: 0,
  };

  if (!Mapbox.getMap().getLayer(layer.id)) {
    Mapbox.getMap().addLayer(groundName);
    Mapbox.getMap().addLayer(groundStorke, "ehh-fishing-ground-name");
    Mapbox.getMap().addLayer(layer, "ehh-fishing-ground-storke");
  }
}

function getFishingGroundData() {
  getAreasWithSixHourForecast({ needAreaFields: 1 }).then(({ data }) => {
    forecastData.value = data.dataset;
    groundList.value = kvToJson(data.responseData.k, data.responseData.v);
    onCurrentDataChange(data.datetimeList[0]);
  });
}

function addListener(map) {
  map.on("click", "ehh-fishing-ground-fill", (e) => {
    const data = groundList.value.find(
      (item) => item.areaCode === e.features[0].toJSON().properties.code,
    );
    handleResultClick({
      name: e.features[0].toJSON().properties.name,
      ...data,
    });
  });
}

function handleResultClick(data) {
  activeGround.value = data.name;
  weatherData.value = kvToJson(data.list.k, data.list.v);
  console.log(activeGround.value, weatherData.value);
}

function onCurrentDataChange(val) {
  const codes = [...forecastData.value.keys()].map((item) => item.code);
  const values = [...forecastData.value.values()].map((item) => item.get(val));
  const features =
    Mapbox.getMap().getSource("ehh-fishing-ground")._data.features;
  features.forEach((item) => {
    const index = codes.findIndex((code) => item.properties.code === code);
    if (index !== -1) {
      item.properties = Object.assign(item.properties, values[index]);
      item.properties.timestrap = val;
    }
  });
  createFishingGroundIconImage(
    Mapbox.getMap(),
    val,
    features.filter((item) => item.geometry.type === "Point"),
    vcolors.value,
  );
  Mapbox.getMap().getSource("ehh-fishing-ground").setData({
    type: "FeatureCollection",
    features,
  });
}

onMounted(() => {
  Mapbox.mapLoaded().then(() => initMap());
});

watch(
  () => MapStore.$state.qxType,
  (news) => {
    open(news);
  },
);
</script>

<template>
  <div></div>
</template>

<style scoped lang="scss"></style>
