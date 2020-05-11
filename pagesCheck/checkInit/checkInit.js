import { loginModules } from "../../modules/login.js";
let LoginModules = new loginModules();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   hideMessage:true,
   day:"",
   list:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 提示框
  showToast(params) {
    return new Promise((resole, reject) => {
      this._showToast(params, resole, reject)
    })
  },
  _showToast(params, resole, reject) {
    wx.showModal({
      title: params.title || "提示",
      content: params.msg,
      success(res) {
        if (res.confirm) {
          resole(res)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 结束盘点
  checkInit(){
    let that = this;
    LoginModules.endCheck().then(res=>{
      console.log(res)
      that.setData({
        hideMessage:false,
        day: res.StockDate,
        Profit: res.Profit,
        Loss: res.Loss,
        ResultTaking: res.ResultTaking

      })
     
    })
    
  },
  goPrev(){
    wx.reLaunch({
      url: '../../pages/index/index',
    })
  },
  closeMessageBox(){
    this.setData({
      hideMessage: true
    })
    wx.reLaunch({
      url: '../../pages/index/index',
    })
  },

})