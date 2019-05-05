// pages/play/play.js
import zxy from '../../utils/zxy.js';
const myClass = new zxy();
import regeneratorRuntime from '../../utils/runtime'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // h2: wx.getSystemInfoSync().screenHeight - wx.getSystemInfoSync().statusBarHeight,
    h2: wx.getSystemInfoSync().screenHeight,
    w2: wx.getSystemInfoSync().screenWidth,
    h3:0,
    scrollTop: 0,
    isZan: false,
    isCol: false,
    isClick: true,
    isClick2: true,
    list: [],
    page: 0,
    height2: getApp().globalData.height2,
    isAdmin: false,
    bgauto: 'background-color:rgb(0,0,0);color:rgb(255,255,255);',
    video2:'hidden',
    isPlay:true,
    percent:0,
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    let that = this
    wx.showLoading({
      title: "加载中"
    });
    if(options.id!=undefined&options.id!=null)
    {
    this.setData({
      id: options.id
    })
    }
    that.getRecomend().then(
      res=>{
        if (that.data.id == undefined || that.data.id ==null){
          let id = that.data.idArr[0]
          that.setData({
            id:id,
            curIndex: 0,
          })
        }else{
          let index=that.data.idArr.indexOf(that.data.id)
          that.setData({
            curIndex:index
          })
        }
        this.getUserInfo(that.data.id).then(
          res => {
            that.getAdmin(res.id)
            that.getRecord(that.data.id).then(
              res => {
                that.setData({
                  content: res.data,
                  video2: "hidden",
                  goTurn: ""
                })
              }
            )
          }
        )
      }
    );
  },
  // 获取管理员
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
  // 删除
  delete: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除',
          })
          myClass.deleRecord('70468', e.currentTarget.dataset.id).then(
            res => {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
              wx.navigateBack({
                delta: 1
              })
            }
          ).catch(
            err => {
              wx.hideLoading()
              wx.showToast({
                title: '删除失败',
                icon: 'warn'
              })
              console.log(err)
            }
          )
        } else if (res.cancel) {
        }
      }
    })
  },
  // 播放次数
  getPlay: function (id,playNumber) {
    let that = this
    let apply = {
      playNumber: playNumber + 1
    }
    let list = that.data.content
    myClass.upData('70468', id, apply).then(
      res => {
        
      }
    ).catch(
      err => {
        console.log(err)
      }
    )
  },
  // 获取视频信息
  getRecord(id) {
    let that = this
    return new Promise(
      (resolve, reject) => {
        myClass.getTableRecord('70468', id).then(
          res => {
            if(that.data.myCol.indexOf(id)>-1){
              that.setData({
                isCol:true
              })
            }else{
              that.setData({
                isCol: false
              })
            }
            wx.hideLoading();
            let playNumber=res.data.playNumber
            that.getPlay(id,playNumber);
            resolve(res)
          }, err => {
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
    let that = this
    return new Promise(
      (resolve, reject) => {
        wx.BaaS.auth.loginWithWechat().then(user => {
          // 登录成功
          if (user.is_authorized == false) {
            wx.redirectTo({
              url: '../../pages/login3/login3?id=' + id,
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
  
// 触摸上下滑动翻页
  touchstart: function (e) {
    this.setData({
      pageY1: e.changedTouches[0].pageY
    })
  },
  touchend: function (e) {
    let that = this
    let pageY = e.changedTouches[0].pageY - that.data.pageY1
    let index = that.data.curIndex
    if (pageY > 10) {
      if (index > 0) {
        index--
        that.getRecord(that.data.idArr[index]).then(
          res => {
            that.setData({
              curIndex: index,
              video2: "animationBot",
              goTurn: "videoTop",
              h3: wx.getSystemInfoSync().screenHeight,
              content: res.data,
              isPlay: true,
            })
            setTimeout(function () {
              that.setData({
                content2: res.data,
                goTurn: "",
                video2: "hidden",
                h3:0
              })
            }, 400)
          }
        ).catch(
          err => {
            console.log(err)
          }
        )
      }
    } else if (pageY < -10) {
      if (index < that.data.idArr.length - 1) {
        index++
        that.getRecord( that.data.idArr[index]).then(
          res=>{
            that.setData({
              curIndex: index,
              content: res.data,
              video2: "animationTop",
              goTurn: "videoBot",
              isPlay: true,
              h3: wx.getSystemInfoSync().screenHeight
            })
            setTimeout(function () {
              that.setData({
                content2: res.data,
                goTurn:"",
                video2:"hidden",
                h3:0,
              })
            }, 400)
          }
        ).catch(
          err=>{
            console.log(err)
          }
        )
      }
    } else {
      if(that.data.isPlay==true){
        this.videoContext.pause()
        that.setData({
          isPlay:false
        })
      }else{
        this.videoContext.play()
        that.setData({
          isPlay: true
        })
      }
    }
  },
  Play:function(){
    let that=this
    this.videoContext.play()
    that.setData({
      isPlay: true
    })
  },
  bindtimeupdate:function(e){
     let that=this
     let p=Math.round(e.detail.currentTime/e.detail.duration*100)
     that.setData({
       percent:p
     })
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
            icon: "success"
          })
          myClass.getTableRecord('70468', id).then(
            res => {
              let apply = {
                collection: res.data.collection + 1
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
          // success
        })
      }
    ).catch(
      err => {
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
          // success
          that.setData({
            isCol: false,
            myCol: res.data.collect
          })
          wx.showToast({
            title: '已取消',
            icon: "success"
          })
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
                    isCol: false,
                  })
                }
              )
            }
          )
          that.setData({
            myCol: res.data.collect
          })
        })
      }
    ).catch(
      err => {
        console.log(err)
      }
    )
  },
  // 获得推荐
  getRecomend: function () {
    let that = this
    return new Promise(
      (resolve,reject)=>{
        let Product = new wx.BaaS.TableObject("70468")
        Product.limit(99).offset(0).orderBy(["-created_at"]).select('id').find().then(res => {
          let list = res.data.objects.map(function (item) {
            return item = item.id
          })
          that.setData({
            idArr: list,
          })
          resolve(res)
        }
        )
      }
    )
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
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
  onPullDownRefresh: function (e) {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    wx.stopPullDownRefresh();
  },
  waiting: function () {
    //  wx.showLoading({
    //    title: '加载中',
    //  })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    let apply = {
      share: that.data.content.share + 1
    }
    myClass.upData('70468', that.data.idArr[that.data.curIndex], apply).then(
      res => {
        that.setData({
          content: res.data,
        })
      }
    )
    return {
      title: that.data.content.text,
      desc: '海草日记',
      path: '/pages/douyinplay/douyinplay?id=' + that.data.content.id,
      imageUrl: that.data.content.poster,
    }
  }
})