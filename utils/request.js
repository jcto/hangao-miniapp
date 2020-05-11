

import {config} from "./config.js"

let token = wx.getStorageSync("token")
class HTTP {
  that = this;
  request(params) {
    // 防止为获取到token
  if(!token){
     token = wx.getStorageSync("token")
  }
    if (params.Authorization){
      params.auto = "Basic MTIzNDo1Njc4"
    }else{
      params.auto = `Bearer ${wx.getStorageSync("token")}` 
    }

    if(!params.type){
      params.type = "application/x-www-form-urlencoded"
    }
   

    return new Promise((resole, reject) => {
      this._request(params, resole, reject)
    })
  }
  _request(params, resole, reject) {
    // console.log(params)
    if (!params.method) {
      params.method = "POST"
    };
    
    let that = this;
    // console.log(that)
    wx.request({
      url: config.baseUrl + params.url,
      header: {
        "content-type": params.type,
        "Authorization": params.auto ,
      },
      data: params.data,
      method: params.method,
      success: function (res) {
       
        if (params.tips) {
          resole(res.data)
          return
        } else {

          if (res.data.Message) {
            let msg = res.data.Message;
            //that._showToa(msg)
          }
        }
        let code = res.statusCode.toString();
        // 请求成功
        if (code.startsWith("2")) {
          resole(res.data)
         
         
        } else { 
       
          
          
          if(code == 400) {
           that._showToa("账号密码错误")
          }
         
          if(code == 401){
            that._showToa("token失效请重新登录")
            let userInfo = wx.getStorageSync("user")
            console.log(userInfo)
            wx.clearStorageSync()
            wx.setStorageSync("user", userInfo)
            wx.reLaunch({
              url: '../login/login',
            })
          }
          reject(res)
         
          
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "请检测客户端与服务器的联通",
          icon: "none",
          duration: 2000
        })
      }
    })
  }
  _showToa(meg) {
    wx.showToast({
      title: meg,
      icon:"none"
    })
  }
};

export {
  HTTP
}