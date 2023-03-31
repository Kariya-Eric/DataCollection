import logo from '@/assets/logo.jpg'

const initState = {
  /**
   * logo 的图片地址，默认是 @/assets/logo.svg
   */
  logo,
  /**
   * logo 旁边的 slogan
   */
  slogan: '数据采集系统',

}

const app = {
  state: {
    ...initState
  },

  mutations: {

  }
}

export default app
