// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 拨号功能
  contact(){

    wx.makePhoneCall({
      phoneNumber: '400-856-0969' //仅为示例，并非真实的电话号码
    })
  },
  goPrev() {
    wx.reLaunch({
      url: './../../pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let loginTime = wx.getStorageSync("loginTime");
    let phone = wx.getStorageSync("user").phone;
    console.log(phone)
    this.setData({
      loginTime,
      phone
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getOut(){
    wx.showLoading({
      title: '退出中，请稍等',
    })
    // wx.removeStorageSync("token"),
    //   wx.removeStorageSync("userSiteId"),
    //   wx.removeStorageSync("inendID"),
    //   wx.removeStorageSync("instartID"),
    // wx.removeStorageSync("siteName"),
    //   wx.removeStorageSync("inTotal"),
    //   wx.removeStorageSync("OUTINFO"),
    //   wx.removeStorageSync("inNumber"),
    wx.clearStorage()
    wx.redirectTo({
      url: '../login/login',
    })
  }
})