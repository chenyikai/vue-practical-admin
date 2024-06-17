import { defineStore } from "pinia";
import { set } from "lodash";

const popupManageStore = defineStore("popupManage", {
  state: () => {
    return {
      // 初始层级
      zIndex: 2000,
      popupData: {},
      // control容器的id
      container: "controlBox",
      // 每个元素上下左右的间隔
      padding: 12,
      fixed: ["search-bar"],
    };
  },
  actions: {
    // TODO 保证弹窗不会重叠
    setPopup(id) {
      const htmlElement = this.getElement(id);
      const {
        offsetWidth: width,
        offsetHeight: height,
        offsetLeft: left,
        offsetTop: top,
      } = htmlElement;

      if (!this.fixed.includes(id)) {
        const position = this.nextPosition(width, height);
      }

      const range = this.getElementRange(width, height, left, top);
      set(this.popupData, id, range);
    },
    nextZIndex() {
      this.zIndex += 100;
    },
    nextPosition(width, height) {
      const position = this.getElementRange(width, height, 0, 0);
      console.log(position);
      const ranges = Object.values(this.popupData);
      if (ranges.length === 0) {
        return {
          left: this.padding,
          top: this.padding,
        };
      }

      ranges.forEach((range) => {
        const [xMin, xMax] = range.xRange;
        // if (xMin <= position[0] && xMax >= position[0]) {
        //   console.log("起点在别的范围里了");
        // } else {
        //   console.log("起点没有在别的范围里了");
        // }
      });
    },
    getElement(id) {
      return document.getElementById(id);
    },
    /**
     *
     * @param width number 宽度
     * @param height number 高度
     * @param left number control容器左距离
     * @param top number control容器上距离
     * @return {Object}
     */
    getElementRange(width, height, left, top) {
      const xMax = width + left + this.padding;
      const xMin = left - this.padding;

      const yMax = height + top + this.padding;
      const yMin = top - this.padding;
      return {
        xRange: [xMin, xMax],
        yRange: [yMin, yMax],
      };
    },
  },
});

export default popupManageStore;
