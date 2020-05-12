import { loginModules } from "../../modules/login.js";
let LoginModules = new loginModules();
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // phoneTips:false,
    // passwordTips:true,
    checked:false,
    phone:"",
    password:"",
    inputUsername:"",
    inputPassword: "",
    btnForbidden:false
  },



  changePhone(e){
    debugger
    this.setData({
      inputUsername:e.detail
    })
  },
  changePassword(e){
    debugger
    this.setData({
      inputPassword: e.detail
    })
  },
  onChange(event) {
    this.setData({
      checked: event.detail
    });
   
  },

 


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  // try{
  //   let user = wx.getStorageSync("user");
  //   console.log(user)


  //   this.setData({
  //     // inputUsername: user.phone,
  //     // inputPassword: user.password,
  //     phone: user.phone,
  //     password: user.password,
  //     // checked:true
  //   })
  //   this.phone({ detail: user.phone });
  // } catch (err) {
  //   //在这里处理错误
  // }

   
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  formSubmit_phone(e){
    if (this.data.btnForbidden) return
    console.log(this.data.btnForbidden)
    this.data.forbidden = true;
    
   
    // 判断是否为空
    if (this.data.inputUsername && this.data.inputPassword ){
      wx.showLoading({
        title: '正在登录',
      })
      // 记住账号
      this.rememberMe(this.data.inputUsername, this.data.inputPassword);
      let loginData = {
        "username": this.data.inputUsername,
        "password": this.data.inputPassword,
        "grant_type": "password"
      };
     LoginModules.register(loginData).then((res)=>{
      
      wx.hideLoading()
       
       wx.setStorageSync("token", res.access_token)
      
        wx.reLaunch({
          url: "./../index/index"
        })
     },(err)=>{
      
       this.data.btnForbidden = false;
     
     })
     
    

    } else {
      wx.showToast({
        title: '账号密码有误',
        icon:"none"
      })
    }

   
  },
  
  //  记住我的
  // rememberMe(username,password) {
    
  //   if(this.data.checked){
  //     const user = {
  //       phone: username,
  //       password: password
      
  //     }
  //     wx.setStorageSync('user', user)
  //   }else{
  //     wx.removeStorageSync('user')
  //   }

    
  // }
  // 更新记住我的账号密码
  rememberMe(username, password) {

   
      const user = {
        phone: username,
        password: password

      }
      wx.setStorageSync('user', user)
    


  }
})