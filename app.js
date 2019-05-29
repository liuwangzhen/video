//app.js 这不是一个分支管理
App({
  onLaunch: function () {
    let sys = wx.getSystemInfoSync()
    this.globalData.system=sys
    if(sys.system.indexOf('iOS')>-1){
      this.globalData.height=sys.statusBarHeight
      this.globalData.height2 = 44
    }else{
      this.globalData.height = sys.statusBarHeight
      this.globalData.height2 = 48
    }
   
  
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init('f2f030f85a673a040b25')
  },
  globalData: {
    userInfo: null,
  }
})