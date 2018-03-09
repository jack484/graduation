'use strict'

import axios from 'axios'
import qs from 'qs'

import { serviceUrl, ERR_OK } from './api'

// 请求时的拦截处理
axios.interceptors.request.use((config) => {
  // 发送请求之前做一些处理
  return config
}, (error) => {
  // 当请求异常时做一些处理
  return Promise.reject(error)
  console.log(error)
})

// 响应时拦截处理
axios.interceptors.request.use((response) => {
  // 返回响应时做一些处理
  return response
}, (error) => {
  // 这里把错误信息扶正, 后面就不需要写 catch 了
  return Promise.reject(error.response)
  console.log(error)
})

// 数据统一处理
// 链式处理第一步
// 判断http状态码是否正常，请求正常则返回响应，请求异常则返回错误
// 最后返回结果给checkCode()
function checkStatus (response) {
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status ===200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下, 把错误信息返回去
  // 因为前面我们把错误扶正了, 不然像 404, 500 这样的错误是走不到这里的
  return {
    status: -404,
    msg: '网络异常'
  }
}

//链式处理第二步
//处理上一步checkStatus返回的结果，分别处理网络异常，以及后端返回的异常
function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    // console.log(res.msg)
    // alert(res.msg)
  }
  if (res.data.code != ERR_OK) {
    // console.log(res.data)
    // alert(res.data)
  }
  return res
}

export default {
  // post (url, data) {
  //   return axios({
  //     method: 'post', // 请求协议
  //     // baseURL: serviceUrl, // 公共url
  //     url, // 请求地址
  //     data: qs.stringify(data), // post请求时带的参数
  //     timeout: 10000, // 设置超时时间单位毫秒
  //     headers: {
  //       'X-Requested-With': 'XMLHttpRequest',
  //       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  //     }
  //   }).then((response) => {
  //     // console.log(response)
  //     return checkStatus(response)
  //   }).then((res) => {
  //     // console.log(res)
  //     return checkCode(res)
  //   })
  // },
  get (url, params) {
    return axios({
      method: 'get',
      // baseURL: serviceUrl,
      url,
      params, // get请求时带的参数
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      return checkCode(res)
    })
  },
  post (url, serviceCode, params) {
    let v_params = {
        'serviceCode': serviceCode,
        'data': JSON.stringify(params)
      }
      // console.log(v_params)
    return axios({
      method: 'post', // 请求协议
      // baseURL: serviceUrl, // 公共url
      url, // 请求地址
      data: qs.stringify(v_params), // post请求时带的参数
      timeout: 10000, // 设置超时时间单位毫秒
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then((response) => {
      // console.log(response)
      return checkStatus(response)
    }).then((res) => {
      // console.log(res)
      return checkCode(res)
    })
  },
}
