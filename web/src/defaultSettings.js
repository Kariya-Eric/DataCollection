/**
 * 项目默认配置项
 * 
 * storageOptions:{} Vue-ls 插件配置向(localStorage/sessionStorage)
 */

export default {
    storageOptions: {
        namespace: 'pro__',    //key prefix
        name: 'ls',     //name variable Vue.[ls]
        storage: 'local'     // storage name session,local,memory
    }
}