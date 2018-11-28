import {commonParams} from './config'
import axios from 'axios'

export function getVkey(mid) {
  const url = '/api/vkey'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    loginUin: 0,
    format: 'jsonp',
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
    // jsonpCallback: callback,
    // callback: callback
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
