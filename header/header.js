const app = getApp();
Component({
  options: {
    
  },
  

  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '海草日记',
    },
    previousPage: {
      type: String,
      value: false
    },
    bgone:{
      type: String,
      value: 'background-color:rgb(141, 71, 71)',
    },
    bgtwo:{
      type: String,
      value: 'background-color:rgb(141, 71, 71)',
    },
    colorO:{
      type:String,
      value:'#000'
    },
   
    canGoIndex: {
      type: Boolean,
      value: false
    },
   isPadding: {
      type: Boolean,
      value: false
    },
    isPaddingTwo: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 私有数据，可用于模板渲染
    canGoBack: false,
    g2: app.globalData
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名

  },
  // 此处attached的声明会被lifetimes字段中的声明覆盖
  attached() {
    // 在组件实例进入页面节点树时执行
    let that = this
    
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },
  ready() {
        this.setData({
          canGoBack:getCurrentPages().length > 1,
        })
    
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() { },
    hide() { },
    resize() { },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goback: function () {
      wx.navigateBack({
        delta: 1,
      })
    },
    groupClick: function (e) {
      var group = 'css'
      console.log(group)
      // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
      this.triggerEvent('okEvent', { group }, {})
    },
   
    goIndex: function () {
      wx.switchTab({
        url: '../../pages/index/index',
      })
    }
  }
})