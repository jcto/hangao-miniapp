import { loginModules } from "../../modules/login.js";
let LoginModules = new loginModules();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navItem:-1, //控制导航栏高亮
    tips:"数据加载中",
    testallHistry:[{TransType:'出库',DeliveryNumber:123,OpDate:"2019 4 20"},
    {TransType:'入库',DeliveryNumber:456,OpDate:"2019 4 20"}],
    allHistry:[],//所有记录,
   
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecode();
   
  },
  goPrev(){
   wx.reLaunch({
     url: '../index/index',
   })
  },
  toDetail(e){
    wx.showLoading({
      title: '加载中',
      mask: true,
      
    })
    let detail = JSON.stringify(e.currentTarget.dataset.detail);

    wx.navigateTo({
      url: `./../waybill/index?item=${detail}`,
    })
  },
  // 点击导航高亮
  chosenNavItem(evnet){
    let key = parseInt(evnet.currentTarget.dataset.key);
 
    this.setData({
      navItem:key
    })
  
  },
   // 获取出入库记录
  getRecode() {
    let data = {
      "SiteId": wx.getStorageSync("userSiteId"),
      "SiteName": wx.getStorageSync("siteName")
    }
    
    LoginModules.getRecode(data).then(res=>{
    
      
      let allHistry = res.Trans;
      this.classifyType(allHistry)
      console.log(allHistry)
      this.setData({
        allHistry,
        tips:"",
        getRecodeDone:true
       
      })
      wx.hideLoading()
    },reject=>{
      if (reject.statusCode == 404){
        this.setData({
          allHistry:[],
          outList:[],
          inList:[],
          tips:"当前仓库未查找到订单数据"
        })
      }
      wx.hideLoading()
      
    })
  },

  // 城市数据未请求完成
  _cityDataNoDone(){
    if(!this.data.cityData){
      return false
    }
    return true
  },

  // 出入库分类
  classifyType(all){
    let outList = [];
    let inList = [];
    all.forEach(item=>{
      if(item.TransType==="出库"){
        outList.push(item)
      }else{
        inList.push(item)
      }
    })
    this.setData({
      outList,
      inList
    })
  },

  

})