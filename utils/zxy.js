class sql{
  constructor() {
  }
  addTable(tableId,apple){
    return new Promise(
      (resolve,reject)=>{
        // 向 tableName 为 'product' 的数据表插入一条记录
        let Product = new wx.BaaS.TableObject(tableId)
        let product = Product.create()
        // 设置方式一
        product.set(apple).save().then(res => {
          // success
          resolve(res)
        }, err => {
          //err 为 HError 对象
           reject(err)
        })
      }
    )

  }
  getTableRecord(tableId,recordID){
    return new Promise(
      (resolve,reject)=>{
        let Product = new wx.BaaS.TableObject(tableId)
        Product.get(recordID).then(res => {
          // success
          resolve(res)
        }, err => {
          // err
          reject(err)
        })
      }
    )
  }
  getTables(tableId,limit,page,order,query) {
    return new Promise(
      (resolve, reject) => {
        let Product = new wx.BaaS.TableObject(tableId)
        if(query==''||query==undefined){
          Product.limit(limit).offset(page * limit).orderBy(order).find().then(res => {
            // success
            resolve(res)
          }, err => {
            // err
            reject(err)
          })
        }
        else{
          Product.setQuery(query).limit(limit).offset(page * limit).orderBy(order).find().then(res => {
            // success
            resolve(res)
          }, err => {
            reject(err)
            // err
          })
        }
      }
    )
  }
  getToken(){
    return new Promise(
      (resolve,reject)=>{
        wx.BaaS.auth.loginWithWechat().then(res => {
          resolve(res)
        }, err => {
          // 登录失败
          reject(err)
        })
      }
    )
  }
  getQuery(tableId,limit,page,query,order){
    return new Promise(
      (resolve,reject)=>{
        let Product = new wx.BaaS.TableObject(tableId)
        Product.setQuery(query).limit(limit).offset(page*limit).orderBy(order).find().then(res => {
          // success
          resolve(res)
        }, err => {
          reject(err)
          // err
        })
      }
    )
  }
  upData(tableId,recordId,apply){
    return new Promise(
      (resolve,reject)=>{
        let Product = new wx.BaaS.TableObject(tableId)
        let product = Product.getWithoutData(recordId)
        product.set(apply)
        product.update().then(res => {
          // success
          resolve(res)
        }, err => {
          // err
          reject(err)
        })
      }
    )
  }
  deleRecord(table,recordID){
    return new Promise(
      (resolve,reject)=>{
        let Product = new wx.BaaS.TableObject(table)
        Product.delete(recordID).then(res => {
          // success
          resolve(res)
        }, err => {
          // err
          reject(err)
        })
      }
    )
  }
}
module.exports=sql;