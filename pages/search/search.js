// pages/search/search.js
import sql from '../../utils/zxy.js';
const myClass = new sql();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:[],
   page:0,
   val:"",
   mySearch:[],
   hotSearch:[],
   isList:false,
   searchVal:'',
   system:getApp().globalData.system,
    h2: getApp().globalData.height2,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.hideShareMenu();
     let that=this
     myClass.getToken().then(
       res=>{
         if (res._attribute.recentSearch!=undefined){
           that.setData({
             mySearch: res._attribute.recentSearch.slice(0, 8)
           })
         }
         myClass.getTableRecord('71070','5cb6f011e1256428a5bfc666').then(
            res=>{
              that.setData({
                 hotSearch:res.data.hotWord
              })
            }
         )
       }
     )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  iptblur:function(e){
    let that=this
    that.setData({
      val:e.detail.value,
    })
    if(e.detail.value==""){
      that.setData({
        isList:false
      })
    }
  },
  getSearch:function(e){
     let that=this
    that.setData({
      val: e.currentTarget.dataset.val
    })
     if(that.data.val==''){
     }else{
     that.setData({
       list:[],
       isList:true,
       page:0,
       isLoading: true,
     }) 
     myClass.getToken().then(
       res=>{
         let mySearch = that.data.mySearch
         let idx = mySearch.indexOf(that.data.val)
         mySearch.unshift(e.currentTarget.dataset.val)
         if (idx > -1) {
           mySearch.splice(idx + 1, 1)
         }
         res.set('recentSearch', mySearch).update().then(res => {
           // success
           that.setData({
             mySearch: mySearch.slice(0, 8),
             searchVal:that.data.val
           })
           that.getList();
         }, err => {
           // err 为 HError 对象
           that.setData({
             isLoading: false,
           })
           wx.showToast({
             title: '搜索失败',
           })
         })
       }
     )
     }
  },
  delete:function(){
     let that=this
     let mySearch=[]
    myClass.getToken().then(
      res=>{
      res.set('recentSearch', mySearch).update().then(res => {
        // success
        that.setData({
          mySearch: [],
        })
      }, err => {
        // err 为 HError 对象
      })},
      err=>{
        console.log(err)
      }
    )
  },
  getList:function(){
     let that=this
    // let foo = that.data.val
    // let val = Array.from(foo)
    let query=new wx.BaaS.Query()
    query.contains('text',that.data.val)
         myClass.getQuery('70468', 10, that.data.page, query,'-playNumber').then(
           res=>{
             that.setData({
               list:that.data.list.concat(res.data.objects),
               isLoading: false,
             })
           },
           err=>{
             that.setData({
               isLoading: false,
             })
             wx.showToast({
               title: '搜索失败',
             })
           }
         )
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      let that=this
      wx.stopPullDownRefresh();
      if(that.data.list.length>9){
        setTimeout(
          function(){
            let page = that.data.page
            page++;
            console.log(page)
            that.setData({
              page: page
            })
            that.getList()
          },300
        )
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})