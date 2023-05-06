import Vue from 'vue'

const DRAWING_CACHE = {
    DRAWING_VERSION: '1.0.0',
}

function getCache() {
    const cache = Vue.ls.get('DRAWING_CACHE')
    if (!cache) {
        Vue.ls.set('DRAWING_CACHE', {})
        return {}
    }
    return cache
}

export function getDrawingList() {
    // 加入缓存版本的概念，保证缓存数据与程序匹配
    const cache = getCache()
    if (cache.version !== DRAWING_CACHE.DRAWING_VERSION) {
        cache.version = DRAWING_CACHE.DRAWING_VERSION
        Vue.ls.set('DRAWING_CACHE', cache)
        saveDrawingList([])
        return null
    }
    const drawingItems = cache.drawingItems
    if (drawingItems) return drawingItems
    return null
}

export function saveDrawingList(list) {
    const cache = getCache()
    cache.drawingItems = list
    Vue.ls.set('DRAWING_CACHE', cache)
}

export function getIdGlobal() {
    const cache = getCache()
    if (cache.idGlobal) return parseInt(cache.idGlobal, 10)
    return 100
}

export function saveIdGlobal(id) {
    const cache = getCache()
    cache.idGlobal = id
    Vue.ls.set('DRAWING_CACHE', cache)
}

export function getFormConf() {
    const cache = getCache()
    const formConf = cache.formConf
    if (formConf) return formConf
    return null
}

export function saveFormConf(obj) {
    const cache = getCache()
    cache.formConf = obj
    Vue.ls.set('DRAWING_CACHE', cache)
}
