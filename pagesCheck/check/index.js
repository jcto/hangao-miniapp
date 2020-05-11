const app = getApp();
import { loginModules } from "../../modules/login.js";
let LoginModules = new loginModules();
Page({
  data: {
    show: true,
    transitionModel: "",
    list: [],
    startPlaceTips: "暂无",
   
    Qty:"暂无",
    btnForbidden: false,
    cityIsLoding:false
    
  },
  onClose(e) {
    // console.log(e)
    // console.log(e.currentTarget.dataset)
    let index = e.currentTarget.dataset.index;
    if (e.target.id == "close") {
      this.showToast({
        msg: "是否删除"
      }).then(res => {
        this._removeList(index)
      })
    }
  },

  
  // 删除列表项
  _removeList(index) {
    this.data.list.splice(index, 1)
    let imgPath = this.data.list;
    this.setData({
      list: imgPath
    })
  },
  // 扫码
  scan() {

    
    
    let that = this;
    let list = this.data.list;
    wx.scanCode({
      success: (res) => {

        let result = res.result;
        if (result.length === 8) {
          let list = that.data.list;
          list.unshift(result);

          let newList = [...new Set(list)]

          that.setData({
            list: newList,


          })

        } else {
          wx.showToast({
            title: 'Tank编号为八位,请扫码Tank二维码',
            icon: "none"
          })
        }
      },
      fail: (res) => {
        // console.log(res);
      }

    })
  },

  

  // 判断是否选择了仓库
  chosenSite(){
    let data = {
      index:this.data.multiIndexStart
    }
    if (data.index[0]===-1 && data.index[1]===-1 ){
      wx.showToast({
        title: '请选择仓库',
        icon: 'none',
        
      })
      return false
    }
    return true
    
  },

  // 返回上一项、
  goBack(){
    wx.navigateBack({})
  },
  onLoad(){
    this.getStockQty()
  },


  // 获取库存数量
  getStockQty(){
    let data = {
      "SiteId": wx.getStorageSync("userSiteId"),
      "SiteName": wx.getStorageSync("siteName")
    }
    LoginModules.getStockQty(data).then(res=>{
      // console.log(res,"获取库存")
      this.setData({
        Qty:res.Qty
      })
    }

    )
  },
  

  // 提交
  present(){
    if ( this.listIsNull()){
      this.getCheck()
      
    }
   
  },

  // 判断提交列表是否为空
  listIsNull(){
    if (this.data.list.length <= 0){
      wx.showToast({
        title: '提交项目不得为空',
        icon:"none"
      })
      return false
    }
    return true
  },

  // 盘点
  getCheck(){
    if (this.data.btnForbidden) return
    this.data.btnForbidden = true
    let data = {
      "SiteId": wx.getStorageSync("userSiteId"),
      "Codes": this.data.list
    }
    LoginModules.getCheck(data).then(res=>{
      // console.log(res)
      wx.showToast({
        title: res.Message ,
        icon:"none"
      })
      setTimeout(()=>{
        wx.navigateBack({
        })
      },1000)
    })
    this.data.btnForbidden = false
  }
})