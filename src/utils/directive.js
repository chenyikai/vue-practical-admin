/**
 *  使用方式  <div v-draggable:xxxx>
 *  v-draggable:xxxx
 *  xxxx 是div的class名   注意 不是被移动的div  是鼠标在哪块按下 所需要的div class
 *  <div class='A' v-draggable:B>
 *     <div class='B'> 鼠标在这个区域按下，会移动div</div>
 *    <div class='C'>我是内容</div>
 *  </div>
 *
 */
export const draggable = {
  mounted(el, binding, vnode) {
    /**
     * @type { HTMLElement }
     */
    // console.log(el, binding, vnode, 'el')
    const dialogHeaderEl = document.getElementsByClassName(binding.arg)[0]
    // console.log(dialogHeaderEl, 'dialogHeaderEl')
    const dragDom = el

    dialogHeaderEl.style.cursor = 'move'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
    function dragHandler(e) {
      e.preventDefault()
      e.stopPropagation()
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop
      const screenWidth = document.body.clientWidth
      const screenHeight = document.documentElement.clientHeight
      const dragDomWidth = dragDom.offsetWidth
      const dragDomheight = dragDom.offsetHeight
      const minDragDomLeft = dragDom.offsetLeft
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth
      const minDragDomTop = dragDom.offsetTop
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight
      let styL, styT

      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/px/g, '')
        styT = +sty.top.replace(/px/g, '')
      }

      document.onmousemove = document.ontouchmove = function (e) {
        e.preventDefault()
        e.stopPropagation()
        let l = e.clientX - disX
        let t = e.clientY - disY
        if (-l > minDragDomLeft) {
          l = -minDragDomLeft
        } else if (l > maxDragDomLeft) {
          l = maxDragDomLeft
        }
        if (-t > minDragDomTop) {
          t = -minDragDomTop
        } else if (t > maxDragDomTop) {
          t = maxDragDomTop
        }
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`
      }

      document.onmouseup = document.ontouchend = function () {
        document.onmousemove = null
        document.ontouchmove = null
        document.onmouseup = null
        document.ontouchend = null
      }
    }

    dialogHeaderEl.addEventListener('touchstart', dragHandler)
    dialogHeaderEl.addEventListener('mousedown', dragHandler)
  },
}
