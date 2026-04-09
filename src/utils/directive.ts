import type { DirectiveBinding, ObjectDirective } from "vue";

/**
 * 使用方式：<div v-draggable:xxxx>
 * v-draggable:xxxx
 * xxxx 是div的class名，不是被移动的div，是鼠标在哪块按下所需要的div class
 * <div class='A' v-draggable:B>
 *   <div class='B'> 鼠标在这个区域按下，会移动div</div>
 *   <div class='C'>我是内容</div>
 * </div>
 */
export const draggable: ObjectDirective<HTMLElement, never> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<never>) {
    const dialogHeaderEl = document.getElementsByClassName(binding.arg ?? "")[0] as
      | HTMLElement
      | undefined;
    if (!dialogHeaderEl) {
      return;
    }
    const header = dialogHeaderEl;
    const dragDom = el;

    header.style.cursor = "move";

    const sty =
      (dragDom as HTMLElement & { currentStyle?: CSSStyleDeclaration }).currentStyle ??
      window.getComputedStyle(dragDom, null);

    function dragHandler(e: MouseEvent | TouchEvent): void {
      e.preventDefault();
      e.stopPropagation();
      const touch = "touches" in e ? e.touches[0] : undefined;
      const clientX = touch?.clientX ?? (e as MouseEvent).clientX;
      const clientY = touch?.clientY ?? (e as MouseEvent).clientY;
      const disX = clientX - header.offsetLeft;
      const disY = clientY - header.offsetTop;
      const screenWidth = document.body.clientWidth;
      const screenHeight = document.documentElement.clientHeight;
      const dragDomWidth = dragDom.offsetWidth;
      const dragDomHeight = dragDom.offsetHeight;
      const minDragDomLeft = dragDom.offsetLeft;
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
      const minDragDomTop = dragDom.offsetTop;
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight;

      let styL: number;
      let styT: number;

      if (sty.left.includes("%")) {
        styL = document.body.clientWidth * (Number(sty.left.replace(/%/g, "")) / 100);
        styT = document.body.clientHeight * (Number(sty.top.replace(/%/g, "")) / 100);
      } else {
        styL = Number(sty.left.replace(/px/g, ""));
        styT = Number(sty.top.replace(/px/g, ""));
      }

      document.onmousemove = document.ontouchmove = function (ev: MouseEvent | TouchEvent): void {
        ev.preventDefault();
        ev.stopPropagation();
        const evTouch = "touches" in ev ? ev.touches[0] : undefined;
        const ex = evTouch?.clientX ?? (ev as MouseEvent).clientX;
        const ey = evTouch?.clientY ?? (ev as MouseEvent).clientY;
        let l = ex - disX;
        let t = ey - disY;
        if (-l > minDragDomLeft) {
          l = -minDragDomLeft;
        } else if (l > maxDragDomLeft) {
          l = maxDragDomLeft;
        }
        if (-t > minDragDomTop) {
          t = -minDragDomTop;
        } else if (t > maxDragDomTop) {
          t = maxDragDomTop;
        }
        dragDom.style.left = `${String(l + styL)}px`;
        dragDom.style.top = `${String(t + styT)}px`;
      };

      document.onmouseup = document.ontouchend = function (): void {
        document.onmousemove = null;
        document.ontouchmove = null;
        document.onmouseup = null;
        document.ontouchend = null;
      };
    }

    header.addEventListener("touchstart", dragHandler);
    header.addEventListener("mousedown", dragHandler);
  },
};
