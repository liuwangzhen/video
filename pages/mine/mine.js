// pages/mine/mine.js
import sql from "../../utils/zxy.js";
import regeneratorRuntime from '../../utils/runtime'
const myClass=new sql();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     user:"",
     tables:[],
     page:0,
     myCol:[],
     isHasCollect:false,
     isLoading:true,
     isAdmin:false,
     h2:getApp().globalData.height2,
     system:getApp().globalData.system,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.getToken().then(
      res => {
        this.getLists()
        this.getAdmin(res.id)
      }
    );
  },
//  判断是否是管理员
  getAdmin: function (recordID) {
    let that = this
    let query = new wx.BaaS.Query()
    query.compare('adminid', '=', recordID)
    myClass.getQuery('71926', 10, 0, query, 'created_at').then(
      res => {
        if (res.data.objects != "") {
          that.setData({
            isAdmin: true
          })
        }
      }
    )
  },
  // 获取用户信息
  getToken:function(){
    let that=this
    return new Promise(
      (resolve,reject)=>{
        myClass.getToken().then(
          res => {
            if (res._attribute.collect.length>0){
              that.setData({
                isHasCollect:true
              })
            }else{
              that.setData({
                isHasCollect: false
              })
            }
            that.setData({
              user: res,
              myCol: res._attribute.collect,
              isLoading:false
            })
            resolve(res)
          }, err => {
            console.log(err)
          }
        )
      }
    )
    
  },
  // 获取收藏列表
  getLists:async function(){
     let that=this
     let aa= that.data.myCol.slice(that.data.page*4,4*(that.data.page+1))
     let arr=new Array
     for(let i of aa){
        await myClass.getTableRecord('70468',i).then(
         res=>{
           arr.push(res.data)
           return arr
         }
       )
     }
     that.setData({
       tables:that.data.tables.concat(arr)
     })
     
  },
  // 取消收藏
  nocollect: function (e) {
    let that = this
    let id=e.currentTarget.dataset.id
    let idx=e.currentTarget.dataset.idx
    that.getToken().then(
      user => {
        let index = that.data.myCol.indexOf(id);
        that.data.tables.splice(idx, 1)
        let list = that.data.tables
        if(index>-1){
          that.data.myCol.splice(index, 1)
          let myCol = that.data.myCol
          user.set('collect', myCol).update().then(res => {
            myClass.getTableRecord('70468', id).then(
              res => {
                let apply = {
                  collection: res.data.collection - 1
                }
                myClass.upData('70468', id, apply).then(
                  res => {
                    that.setData({
                      tables: list
                    })
                  }
                )
              }
            ).catch(
              err => {
                console.log(err)
              }
            )
            // success
          }, err => {
            // err 为 HError 对象
          })
        }
        else{
        }
      }
    )
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
    let that=this
    wx.stopPullDownRefresh();
     this.setData({
       tables:[],
       page:0,
       isLoading:true,
     })
     let page=that.data.page
     setTimeout(
       function(){
         that.getToken().then(
           res => {
             that.getLists()
           }
         );
       },300
     )
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    wx.stopPullDownRefresh();
    let page = that.data.page
    page++;
    that.setData({
      page:page
    })
    setTimeout(
      function(){
            that.getLists()
      },300
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let that = this
    if (res.from === 'button') {
      let apply = {
        share: res.target.dataset.share + 1
      }
      myClass.upData('70468', res.target.dataset.id, apply).then(
        re => {
          let list = that.data.tables
          list[res.target.dataset.idx].share += 1
          that.setData({
            tables: list
          })
        }
      )
      return {
        title: res.target.dataset.title,
        desc: '海草日记',
        path: '/pages/play/play?id=' + res.target.dataset.id,
        imageUrl: res.target.dataset.src,
      }
    }
  }
})