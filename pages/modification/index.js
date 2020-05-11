
// pages/modification/index.js
import { loginModules } from "../../modules/login.js";
let LoginModules = new loginModules();
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    original:"",
    newPass:"",
    repeatEnd:"",
    repeatFlag:false,
    repeatMsg:"",
    origMsg:"",
    btnForbidden: false,
    toastContent:'',//是否显示弹窗

  },
  originalEnd(e){
  
    this.setData({
      original: e.detail.value
    })
  },
  newEnd(e){
  
    this.setData({
      newPass: e.detail.value
    })
    this.repeatCheck()
  },
  repeatEnd(e){
   
    this.setData({
      repeatEnd: e.detail.value
    })
    this.repeatCheck()
  },
  formSubmit_resForm(e){
    
   let data = {
     original:this.data.original,
     newPass: this.data.newPass,
     repeatEnd: this.data.repeatEnd,
     repeatFlag: this.data.repeatFlag
   }
  
    if (data.original === "" || data.newPass === "" || data.repeatEnd === ""  ){
      this.CheckFeild("请输入密码")
      return
    } 
     if (data.repeatFlag){
  
       return
    }else{
       if (this.data.btnForbidden) return
       this.data.btnForbidden = true
      this.changePassword(this.cb)
    }
  },
  // 获取修改密码的返回结果
  cb(result){
    this.setData({
      toastContent:result.Message
    })
    this.data.btnForbidden = false
  },
  // 校验
  repeatCheck(){
    let newPass = this.data.newPass;
    let repeat = this.data.repeatEnd;
    if (newPass !== repeat){
      this.CheckFeild("两次密码不一致")
    }else{
      this.checkSucc()
    }

  },
  // 校验密码成功
  CheckFeild(msg){
    
      this.setData({
        repeatFlag: true,
        repeatMsg: msg
      })
    
    
  },
  // 校验密码失败
  checkSucc(){
    this.setData({
      repeatFlag: false,

    })
  },
  // changePassword
  changePassword(){
   let data = {
     "CurrentPassword":this.data.original,
     "NewPassword": this.data.newPass,
     "RepeatPassword": this.data.repeatEnd
   }
    LoginModules.changePassword(data).then(res=>{
     this.cb(res);
    },(err)=>{
      this.cb(err);
    })
  },
 
  goBack() {
   wx.navigateBack({
     
   })
   },

   ok(){
    wx.navigateBack({
    })
   }
 
})