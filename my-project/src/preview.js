import Vue from 'vue'
import './core/use' // use lazy load components
const $previewApp = document.getElementById('previewApp')

window.addEventListener('message', init, false)

function init(event) {
  if (event.data.type === 'refreshFrame') {
    const code = event.data.data
    $previewApp.innerHTML = `<style>${code.css}</style><div id="app"></div>`
    newVue(code.js, code.html)
  }
  if (event.data.type === 'resetForm') {
    this.vm.$refs.child.resetForm()
  }
  if (event.data.type === 'submitForm') {
    this.vm.$refs.child.submitForm().then(res => {
      if (res != undefined) {
        parent.getMessageFromFrame({ submit: res })
      }
    })
  }
  if (event.data.type === 'saveForm') {
    this.vm.$refs.child.submitForm().then(res => {
      if (res != undefined) {
        parent.getMessageFromFrame({ save: res })
      }
    })
  }
}

function newVue(main, html) {
  main = eval(`(${main})`)
  main.template = `<div>${html}</div>`
  const vm = new Vue({
    components: {
      child: main
    },
    template: `<div><child ref='child'/></div>`
  }).$mount('#app')
  window.vm = vm
}
