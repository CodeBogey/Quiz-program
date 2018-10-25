import Taro from '@tarojs/taro'
// import { setGlobalData, getGlobalData } from './global_data'

// 拓展 finally 方法，用于替代 wx 的 complete 方法
Promise.prototype.finally = function (callback) {
  let P = this.constructor
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  )
}

// const baseUrl = 'https://www.luonet.com'
const baseUrl = 'http://192.168.0.14:8099'

const request = function (obj = {}) {
  const defaultConfig = {
    header: {
      'Content-Type': 'application/json'
      // 'Authorization': getGlobalData('access_token')
    }
  }
  const config = Object.assign({}, defaultConfig, obj)
  config.url = baseUrl + config.url
  return Taro.request(config)
}

export default request
