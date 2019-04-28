//index.js
//获取应用实例
const app = getApp();
import sql from '../../utils/zxy.js';
const myClass = new sql();

Page({
  data: {
    g2:app.globalData,
    titles: [{ id: 0, title: '生活' }, { id: 1, title: '推荐' }, { id: 2, title: '搞笑' }, { id: 3, title: '电影' }, { id: 4, title: '音乐' }, { id: 5, title: '体育' }, { id: 6, title: '游戏' }, { id: 7, title: '相声' },],
    swiperIndex:1,
    tables:[],
    isClick:true,
    page:0,
    isClick2:true,
    myCol:[],
    myZan:[],
    curItem:9,
  },
  onLoad: function () {
    wx.hideShareMenu();
    wx.showLoading();
    let that=this
    this.getUserInfo();
    that.getTables();
    
  },
  getUserInfo: function() {
    wx.BaaS.auth.loginWithWechat().then(user => {
      // 登录成功
      if (user.is_authorized == false) {
        wx.redirectTo({
          url: '../../pages/login/login',
        })
      }
    }, err => {
      // 登录失败
    })
  },
  // 获取用户信息
  getToken: function () {
    let that = this
    return new Promise(
      (resolve,reject)=>{
        myClass.getToken().then(
          res => {
            if(res._attribute.collect!=undefined){
              that.setData({
                myCol: res._attribute.collect,
                user: res
              })
            }
            resolve(res)
          }, err => {
            console.log(err)
          }
        )
      }
    )
  },
//  随机排序
  shuffle: function (arr) {
    let i = arr.length,
    t, j;
    while(i) {
      j = Math.floor(Math.random() * i--);
      t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
  },
  // 获取列表数据
  getTables:function(a){
    let that=this
        myClass.getTables('70468', 4, that.data.page, '-created_at',a).then(
          res => {
            that.getToken().then(
               re=>{
                 if(re._attribute.zan!=undefined){
                   that.setData({
                     myZan:re._attribute.zan
                   })
                 }
                 let myZan=that.data.myZan
                 let myCol = that.data.myCol
                 that.shuffle(res.data.objects);
                 let list = res.data.objects.map(function (item) {
                   if (myCol.indexOf(item.id) > -1) {
                     item.isCol = true
                   }
                   else if (myZan.indexOf(item.id) > -1){
                     item.isZan = true
                     item.isCol = false
                   }
                   else{
                     item.isZan=false
                     item.isCol = false
                   }
                   return item;
                 });
                 wx.hideLoading();
                 that.setData({
                   tables:that.data.tables.concat(list)
                 })
               }
            )
          }).catch(
          err=>{
            console.log(err)
            wx.hideLoading();
            wx.showToast({
              title: '加载失败',
              icon:"info"
            })
          }
        )
  },
  // 改变顶部菜单选项
  change(e){
    let that=this
    let idx=e.currentTarget.dataset.idx;
    wx.showLoading();
    that.setData({
      swiperIndex: idx,
      title:e.currentTarget.dataset.title,
      tables:[],
      page: 0,
    })
    if (idx == 1){
      that.getTables()
    }
    else{
      let query = new wx.BaaS.Query()
      query.contains('kind', e.currentTarget.dataset.title)
      that.getTables(query)
    }
  },
// 判断收藏
  ifCollect: function (e) {
    let that = this
    that.getToken().then(
      res=>{
        let isClick = that.data.isClick
        let id = e.currentTarget.dataset.id
        let idx = e.currentTarget.dataset.idx
        let index = that.data.myCol.indexOf(id)
        if (isClick == true) {
          that.setData({
            isClick: false
          })
          if (index > -1) {
            that.nocollect(id, index, idx)
          } else {
            that.collect(id, idx)
          }
          setTimeout(function () {
            that.setData({
              isClick: true
            })
          }, 500)
        }
      }
    )
  },
  collect:function(id,idx){
     let that=this
     let list=that.data.tables
         that.data.myCol.unshift(id);
         let myCol = that.data.myCol
         that.data.user.set('collect', myCol).update().then(res => {
           // success
           myClass.getTableRecord('70468', id).then(
             res=>{
               let apply={
                 collection:res.data.collection+1
               }
               myClass.upData('70468', id, apply).then(
                  res=>{
                    list[idx].isCol = true
                    list[idx].collection=res.data.collection
                    that.setData({
                      tables: list,
                      curItem:idx
                    })
                  }
               )
             }
           )
         }).catch(
           err=>{
             console.log(err)
           }
         )
  },
  nocollect: function (id,index,idx) {
    let that = this
    let list = that.data.tables
        that.data.myCol.splice(index, 1)
        let myCol = that.data.myCol
        that.data.user.set('collect', myCol).update().then(res => {
          // success
          myClass.getTableRecord('70468', id).then(
            res => {
              let apply = {
                collection: res.data.collection - 1
              }
              myClass.upData('70468', id, apply).then(
                res => {
                  list[idx].isCol = false
                  list[idx].collection = res.data.collection
                  that.setData({
                    tables: list,
                    curItem:999,
                  })
                }
              )
            }
          )
        }).catch(
          err => {
            console.log(err)
          }
        )
  },

  //判断赞
  ifZan: function (e) {
    let that = this
    that.getToken().then(
      res=>{
        let isClick = that.data.isClick2
        let id = e.currentTarget.dataset.id
        let index = e.currentTarget.dataset.index
        let idx = that.data.user._attribute.zan.indexOf(id)
        if (isClick == true) {
          that.setData({
            isClick2: false
          })
          if (idx > -1) {
            that.noZan(id, idx,index)
          } 
          else {
            that.Zan(id,index)
          }
          setTimeout(function () {
            that.setData({
              isClick2: true
            })
          }, 500)
        }
      },err=>{
         console.log(err)
      }
    )
  },
  Zan: function (id,index) {
    let that = this
    that.data.user._attribute.zan.unshift(id)
    let myZan = that.data.user._attribute.zan
        that.data.user.set('zan', myZan).update().then(res => {
          myClass.getTableRecord('70468', id).then(
            res => {
              let apply = {
                zan: res.data.zan + 1
              }
              let list = that.data.tables
              myClass.upData('70468', id, apply).then(
                res => {
                  list[index].isZan = true
                  list[index].zan = res.data.zan
                  that.setData({
                    tables: list,
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
  },
  noZan: function (id,idx,index) {
        let that = this
        let myZan = that.data.user._attribute.zan
        myZan.splice(idx, 1)
    that.data.user.set('zan', myZan).update().then(res => {
          myClass.getTableRecord('70468', id).then(
            res => {
              let apply = {
                zan: res.data.zan - 1
              }
              let list = that.data.tables
              myClass.upData('70468', id, apply).then(
                res => {
                  list[index].isZan = false
                  list[index].zan=res.data.zan
                  that.setData({
                    tables: list,
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
  },

  onPullDownRefresh: function () {
    let that = this
    wx.stopPullDownRefresh();
    wx.showLoading()
    this.setData({
      tables: [],
      page: 0,
    })
    let page = that.data.page
    setTimeout(
      function () {
        that.getToken().then(
          res => {
            if(that.data.swiperIndex==1){
              that.getTables()
            }
            else{
              let query=new wx.BaaS.Query()
              query.contains('kind',that.data.title)
              that.getTables(query)
            }
          }
        );
      }, 300
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
      page: page
    })
    setTimeout(
      function () {
        if (that.data.swiperIndex == 1) {
          that.getTables()
        }
        else{
          let query = new wx.BaaS.Query()
          query.contains('kind', that.data.title)
          that.getTables(query)
        }
      }, 300
    )
  },
  onShareAppMessage: function (res) {
    let that = this
    if (res.from === 'button') {
      let apply = {
        share: res.target.dataset.share + 1
      }
      myClass.upData('70468', res.target.dataset.id, apply).then(
        re => {
          let list=that.data.tables
          list[res.target.dataset.idx].share+=1
          that.setData({
            tables:list
          })
        }
      )
      return {
        title: res.target.dataset.title,
        desc: '海草日记',
        path: '/pages/play/play?id=' + res.target.dataset.id,
        imageUrl:res.target.dataset.src,
      
      }
    }
    }
    
})
