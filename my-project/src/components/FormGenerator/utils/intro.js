import introJs from 'intro.js'
import 'intro.js/introjs.css'
import '../styles/intro.less'

const intro = introJs()

intro.setOptions({
  nextLabel: '下一步',
  prevLabel: '上一步',
  skipLabel: '跳过',
  doneLabel: '完成',
  hidePrev: true, //第一步时候隐藏上一步
  exitOnEsc: true,
  exitOnOverlayClick: false,
  showStepNumbers: false,
  disableInteraction: true, //禁用高亮框内元素交互
  showBullets: true,
  overlayOpacity: 0.7
})

export default intro
