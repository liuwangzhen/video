const app = getApp();
// const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function (e) {
     this.setData({
       id:e.id
     })
  },
  userInfoHandler(data) {
    let that = this
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      user.set({ 'collect': [], "zan": [] }).update().then(
        res => {
          wx.reLaunch({
            url: '/pages/play/play?id=' + that.data.id
          })
        })
      // user 包含用户完整信息，详见下方描述
    }, err => {
      // **err 有两种情况**：用户拒绝授权，HError 对象上会包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 HError 对象（详情见下方注解
      wx.showToast({
        title: '授权失败'
      })
    })
  },




  //获取用户信息接口


})