
import { loginModules } from "../../modules/login.js";
import roleMap from "../../modules/roleMap.js";
let LoginModules = new loginModules();

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    transitionModel: "",
    role: '',
    canInbound:true,
    canOutbound:true,
    canInitial:true,
    canCount:true,
    canTracking:true,
    canHistory:true,
    TrackingReport_wrapShow: false
  },
  onClose() {

    this.showToast({
      msg: "确定删除？"
    }).then(res => {
      this.setData({
        show: false,
        transitionModel: "fade-left"
      })
    })
  },

  // 判断是否登录
  isLoding() {
    const that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.data.isLogin = true;
        that.data.token = res.data
      },
      fail: function (err) {
        wx.showToast({
          title: '未检测到您的登录信息，请重新登录',
          icon: "none",
        });
        that.data.isLogin = false;
        setTimeout(() => {
          wx.reLaunch({
            url: '../login/login',
          })
        }, 1200)

      }
    })
  },


  // 获取用户信息
  getUserInfo() {
    console.log("获取用户信息")
    LoginModules.getUserInfo().then(res => {
      //  获取出入库的起始地和目的地
      let siteName = res.SiteName;
      wx.setStorageSync("siteName", siteName)
      wx.setStorageSync("userSiteId", res.SiteId)
      wx.setStorageSync("userRole", res.Role)
      this.setData({
        // 如果为空 默认为承运商
        role: res.Role||'承运商',
      })
      this.setData({
        canInbound:this.checkRole('Inbound'),
        canOutbound:this.checkRole('Outbound'),
        canInitial:this.checkRole('Initial'),
        canCount:this.checkRole('Count'),
        canTracking:this.checkRole('Tracking'),
        canHistory:this.checkRole('History')
      })
      this.data.userSiteId = res.SiteId
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.isLoding();
    //this.getUserInfo();

  },

  //  清除不必要的缓存
  clearStroageInfo() {
    wx.removeStorageSync("instartID");
    wx.removeStorageSync("inendID");
    wx.removeStorageSync("inNumber");
    wx.removeStorageSync("inTotal");
    wx.removeStorageSync("inTankList");
    wx.removeStorageSync("outTankList")

    wx.removeStorageSync("outendID");
    wx.removeStorageSync("OUTINFO")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 判断用户者当前账号为 henkel01 才显示‘跟踪报表’
    LoginModules.getUserInfo().then(res => {
      if (res.UserAccount === 'henkel01') {
        this.setData({
          TrackingReport_wrapShow: true
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  const userRole= wx.getStorageSync('userRole')
  this.setData({
    role: userRole,
  })

  const temp={
    canInbound:this.checkRole('Inbound'),
    canOutbound:this.checkRole('Outbound'),
    canInitial:this.checkRole('Initial'),
    canCount:this.checkRole('Count'),
    canTracking:this.checkRole('Tracking'),
    canHistory:this.checkRole('History')
  }
    this.setData(temp)
    this.clearStroageInfo()
    // 获取到用户信息 且 未登录不进行请求当前用户信息
    if (this.data.userSiteId) return
    if (!this.data.isLogin) return
    this.getUserInfo();
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
  checkRole(name) {
    return (roleMap[name] || []).indexOf(this.data.role) > -1
  },
  navTo(e) {
    const name = e.currentTarget.dataset.name
    let url = e.currentTarget.dataset.url
    if(this.checkRole(name)){
      wx.navigateTo({
        url
      })
    }else{
      wx.showToast({
        title: '请检查权限！',
        icon: 'none',
        duration: 2000
      })
    }
  }
})

