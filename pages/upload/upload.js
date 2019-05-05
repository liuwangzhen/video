// pages/upload/upload.js
import sql from '../../utils/zxy.js';
const myClass=new sql();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"",
    kinds: ['生活', '体育', '搞笑', '音乐', '电影','其他'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.hideShareMenu()
  },
  // 单选框选择状态
  radioChange:function(e){
    console.log(e)
    this.setData({
      kind:e.detail.value
    })
  },
  // 输入文本内容
  content:function(e){
     let text= e.detail.value
     console.log(text)
     this.setData({
       text:text
     })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  // 选择的视频
  choseVideo(){
    let that=this
    console.log('1')
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      compressed:false,
      success(res) {
        console.log(res)
        that.setData({
          path:res.tempFilePath,
          duration:res.duration
        })
      }
    })
  },
  // 选择的图片
  choseImg(){
    let that=this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          img:tempFilePaths[0]
        })
      }
    })
  },
  // 提交
  submit(){
    let that=this
    if(that.data.img==""||that.data.path==""||that.data.text==""||that.data.kind==""){
      wx.showToast({
        title: '请填写完整',
      })
    }
    else{
      wx.showLoading({
        title: '正在提交',
      })
      that.uploadImg().then(
        re=>{
          that.uploadVideo(re).then(
            res=>{
              let apply={
                poster:re.data.path,
                text:that.data.text,
                video:res.data.path,
                duration:Math.floor(that.data.duration),
                kind:that.data.kind
              }
              myClass.addTable('70468',apply).then(
               res=>{
                 wx.hideLoading();
                 that.setData({
                   img:"",
                   path:"",
                   text:"",
                   kind:"",
                 })
                 wx.showToast({
                   title: '提交成功',
                   icon:'success',
                   duration:2000,
                 })
               }
              )
            }
          )
        }
      ).catch(
        err=>{
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '提交失败',
          })
        }
      )
    }
  },
  // 上传图片
  uploadImg(){
   let that=this
   return new Promise(
     (resolve,reject)=>{
       let MyFile = new wx.BaaS.File()
       let fileParams = { filePath: that.data.img }
       let metaData = { categoryName: '图片' }
       MyFile.upload(fileParams, metaData).then(res => {
         // 上传成功
         resolve(res)
          // res.data 为 Object 类型
       }, err => {
         // HError 对象
         reject(err)
       })
     }
   )
  },
  // 上传视频
  uploadVideo(){
    let that=this
    return new Promise(
      (resolve, reject) => {
        let MyFile = new wx.BaaS.File()
        let fileParams = { filePath: that.data.path }
        let metaData = { categoryName: '视频' }
        MyFile.upload(fileParams, metaData).then(res => {
          // 上传成功
          resolve(res)
          // res.data 为 Object 类型
        }, err => {
          // HError 对象
          reject(err)
        })
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})