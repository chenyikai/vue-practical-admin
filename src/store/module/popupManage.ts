import { defineStore } from "pinia";
import { set } from "lodash-es";

interface ElementRange {
  xRange: [number, number];
  yRange: [number, number];
}

const popupManageStore = defineStore("popupManage", {
  state: () => ({
    zIndex: 2000,
    popupData: {} as Record<string, ElementRange>,
    container: "controlBox",
    padding: 12,
    fixed: ["search-bar"] as string[],
  }),
  actions: {
    setPopup(id: string): void {
      const htmlElement = this.getElement(id);
      if (!htmlElement) {
        return;
      }
      const {
        offsetWidth: width,
        offsetHeight: height,
        offsetLeft: left,
        offsetTop: top,
      } = htmlElement;

      if (!this.fixed.includes(id)) {
        this.nextPosition(width, height);
      }

      const range = this.getElementRange(width, height, left, top);
      set(this.popupData, id, range);
    },
    nextZIndex(): number {
      this.zIndex += 100;
      return this.zIndex;
    },
    nextPosition(width: number, height: number): { left: number; top: number } | undefined {
      const ranges = Object.values(this.popupData);
      if (ranges.length === 0) {
        return { left: this.padding, top: this.padding };
      }
      // TODO: 保证弹窗不会重叠
      void this.getElementRange(width, height, 0, 0);
      return undefined;
    },
    getElement(id: string): HTMLElement | null {
      return document.getElementById(id);
    },
    getElementRange(width: number, height: number, left: number, top: number): ElementRange {
      return {
        xRange: [left - this.padding, width + left + this.padding],
        yRange: [top - this.padding, height + top + this.padding],
      };
    },
  },
});

export default popupManageStore;
