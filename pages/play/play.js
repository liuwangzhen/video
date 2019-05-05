// pages/play/play.js
import zxy from '../../utils/zxy.js';
const myClass =new zxy();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    h2: wx.getSystemInfoSync().screenHeight-wx.getSystemInfoSync().statusBarHeight,
    scrollTop:0,
    isZan:false,
    isCol:false,
    isClick:true,
    isClick2:true,
    list:[],
    page:0,
    height2:getApp().globalData.height2,
    isAdmin:false,
    bgauto:'background-color:rgb(0,0,0);color:rgb(255,255,255);'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that=this
   wx.showLoading({
     title:"加载中"
   });
   this.setData({
     id:options.id
   })
   this.getUserInfo(options.id).then(
      res=>{
          that.getAdmin(res.id)
      }
   )
   this.getRecord().then(
     res=>{
       that.getPlay()
       that.getRecomend()
     }
   )
  //  获取节点信息
    const query = wx.createSelectorQuery()
    query.select('#cont').boundingClientRect(function (rect) {
      that.setData({
        textHeight: rect.height
      })
    }).exec();
  },
  // 获取管理员
  getAdmin: function (recordID){
     let that=this
     let query=new wx.BaaS.Query()
    query.compare('adminid','=',recordID)
    myClass.getQuery('71926',10,0,query,'created_at').then(
      res=>{
        if(res.data.objects!=""){
          that.setData({
            isAdmin:true
          })
        }
      }
    )
  },
  // 删除
  delete:function(e){
    let that=this
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success(res){
        if(res.confirm){
          wx.showLoading({
            title: '正在删除',
          })
          myClass.deleRecord('70468',e.currentTarget.dataset.id).then(
            res=>{
              wx.showToast({
                title: '删除成功',
                icon:'success'
              })
              wx.navigateBack({
                delta:1
              })
            }
          ).catch(
            err=>{
              wx.hideLoading()
              wx.showToast({
                title: '删除失败',
                icon: 'warn'
              })
              console.log(err)
            }
          )
        }else if(res.cancel){
        }
      }
    })
  },
  // 播放次数
  getPlay:function(){
    let that=this
        let apply = {
          playNumber: that.data.content.playNumber + 1
        }
        let list = that.data.content
        myClass.upData('70468', that.data.id, apply).then(
          res => {
            list.playNumber+=1
            that.setData({
              content: list
            })
          }
        ).catch(
      err => {
        console.log(err)
      }
    )
  },
  // 获取视频信息
  getRecord(){
    let that=this
    return new Promise(
      (resolve,reject)=>{
        myClass.getTableRecord('70468',that.data.id).then(
           res=>{
             that.setData({
              content:res.data
             })
             wx.hideLoading();
             resolve(res)
           },err=>{
             reject(err)
             wx.hideLoading();
             wx.showToast({
               title: '加载失败',
             })
           }
        )
      }
    )
  },
  // 获取用户登陆信息
  getUserInfo: function (id) {
    let that=this
    return new Promise(
      (resolve,reject)=>{
        wx.BaaS.auth.loginWithWechat().then(user => {
          // 登录成功
          if (user.is_authorized == false) {
            wx.redirectTo({
              url: '../../pages/login2/login2?id=' + id,
            })
          }
          if (user._attribute.collect.indexOf(id) > -1) {
            that.setData({
              isCol: true
            })
          }
          if (user._attribute.zan.indexOf(id) > -1) {
            that.setData({
              isZan: true
            })
          }
          that.setData({
            myCol: user._attribute.collect,
            myZan: user._attribute.zan,
          })
          resolve(user)
        }, err => {
          // 登录失败
          reject(err)
        })
      }
    )
  },
   // 获取滚动条当前位置
  onPageScroll: function (e) {
  let that=this
  if(e.scrollTop<that.data.textHeight){
    let c1 = 255 / that.data.textHeight
    let c2=Math.round(0+c1*e.scrollTop)
    let c3=Math.round(255-c1*e.scrollTop)
    let bg = "background-color:rgb(" + c2 + "," + c2 + "," + c2 + ");" + "color:rgb(" + c3 + "," + c3 + "," + c3 + ");"
     that.setData({
       bgauto:bg
     })
  }
    this.setData({
      scrollTop:e.scrollTop
    })
  },
  //判断赞
  ifZan:function(e){
    let that=this
    let isClick = that.data.isClick2
    let id = e.currentTarget.dataset.id
    let index = that.data.myZan.indexOf(id)
    if (isClick == true) {
      that.setData({
        isClick2: false
      })
      if (index > -1) {
        that.noZan(id, index)
      } else {
        that.Zan(id)
      }
      setTimeout(function () {
        that.setData({
          isClick2: true
        })
      }, 500)
    }
  },
  Zan:function(id){
    let that=this
    myClass.getToken().then(
      res=>{
        let myZan = res._attribute.zan
        myZan.unshift(id)
        res.set('zan', myZan).update().then(res => {
          myClass.getTableRecord('70468', id).then(
            res => {
              let apply = {
                zan: res.data.zan + 1
              }
              let list = res.data
              myClass.upData('70468', id, apply).then(
                res => {
                  list.zan = res.data.zan
                  that.setData({
                    content: list,
                    isZan: true
                  })
                }
              )
            }
          ).catch(
            err => {
              console.log(err)
            }
          )
            that.setData({
              myZan:res.data.zan
            })
        })
      }
    )
  },
  noZan:function(id,index){
    let that=this
    myClass.getToken().then(
      res => {
        let myZan = res._attribute.zan
        myZan.splice(id,1)
        res.set('zan', myZan).update().then(res => {
          myClass.getTableRecord('70468', id).then(
            res => {
              let apply = {
                zan: res.data.zan - 1
              }
              let list = res.data
              myClass.upData('70468', id, apply).then(
                res => {
                  list.zan = res.data.zan
                  that.setData({
                    content: list,
                    isZan: false
                 })
                }
              )
            }
          ).catch(
            err => {
              console.log(err)
            }
          )
          that.setData({
            myZan: res.data.zan
          })
        })
      }
    )
  },
  //判断收藏
    ifcollect: function (e) {
    let that = this
    let isClick = that.data.isClick
    let id = e.currentTarget.dataset.id
    let index = that.data.myCol.indexOf(id)
    if (isClick == true) {
      that.setData({
        isClick: false
      })
      if (index > -1) {
        that.nocollect(id, index)
      } else {
        that.collect(id)
      }
      setTimeout(function () {
        that.setData({
          isClick: true
        })
      }, 500)
    }
  },
  collect: function (id) {
    let that = this
    myClass.getToken().then(
      user => {
        that.data.myCol.unshift(id);
        let myCol = that.data.myCol
        user.set('collect', myCol).update().then(res => {
          that.setData({
            isCol: true,
            myCol: res.data.collect
          })
          wx.showToast({
            title: '收藏成功',
            icon:"success"
          })
          myClass.getTableRecord('70468', id).then(
            res => {
              let apply = {
                collection: res.data.collection + 1
              }
              let list =res.data
              myClass.upData('70468', id, apply).then(
                res => {
                  list.collection = res.data.collection
                  that.setData({
                    content: list,
                  })
                }
              )
            }
          )
          // success
        })
      }
    ).catch(
      err => {
        console.log(err)
      }
    )
  },
  nocollect: function (id, index) {
    let that = this
    myClass.getToken().then(
      user => {
        user._attribute.collect.splice(index, 1)
        let myCol = user._attribute.collect
        user.set('collect', myCol).update().then(res => {
          that.setData({
            isCol: false,
            myCol: res.data.collect
          })
          wx.showToast({
            title: '已取消',
          })
          // success
          myClass.getTableRecord('70468', id).then(
            res => {
              let apply = {
                collection: res.data.collection - 1
              }
              let list = res.data
              myClass.upData('70468', id, apply).then(
                res => {
                  list.collection = res.data.collection
                  that.setData({
                    content: list,
                  })
                }
              )
            }
          )
          
        })
      }
    ).catch(
      err => {
        console.log(err)
      }
    )
  },
// 获得推荐
  getRecomend:function(){
    let that=this
    let query1 = new wx.BaaS.Query()
    query1.contains('kind', that.data.content.kind)
    let query2 = new wx.BaaS.Query()
    query2.compare('id', '!=', that.data.id)
    //...
    // and 查询
    let query = wx.BaaS.Query.and(query1, query2)
    myClass.getTables('70468', 4, that.data.page, ['-playNumber'], query).then(
      res=>{
        that.setData({
          list:that.data.list.concat(res.data.objects)
        })
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
     let that=this
    wx.stopPullDownRefresh();
    let page = that.data.page
    page++;
    that.setData({
      page: page
    })
    setTimeout(
      function () {
          that.getRecomend()
      }, 300
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    let apply={
      share:that.data.content.share+1
    }
    myClass.upData('70468', that.data.id, apply).then(
      res => {
        that.setData({
          content: res.data,
        })
      }
    )
      return {
        title: that.data.content.text,
        desc: '海草日记',
        path: '/pages/play/play?id=' + that.data.content.id,
        imageUrl: that.data.content.poster,
        
      }
  }
})