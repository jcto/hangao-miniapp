import { loginModules } from "../../modules/login.js";
let LoginModules = new loginModules();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    transitionModel: "",
    list:[
    ],
    DN:"000000",
 
    add:false,
    btnForbidden: false,
    toastContent:"",
    
  
  },
  goPrev(){
   wx.reLaunch({
     url: './../../pages/index/index',
   })
  },
  onClose(e) {
    // console.log(e)
    let index = e.currentTarget.dataset;

    if (e.target.id == "close") {
      this.showToast({
        msg: "是否删除"
      }).then(res => {
        this._removeList(index)
      })
    }

  },

  _removeList(index) {
    this.data.list.splice(index, 1)
    let tk = this.data.list;
    this.setData({
      list: tk
    })
  },
  // 扫码
  scan() {
    let that = this;
    let list = this.data.list;

    wx.scanCode({
      success: (res) => {
      
        let result = res.result;
        // console.log(res)
        if(result.length === 8){
          let list = that.data.list;
        
          list.unshift(result);

          let newList = [...new Set(list)]
          // sNum = newList.length;
          that.setData({
            list: newList,
            DN: result
           
          })

        }else{
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

  

  // 初始化入库列表
  initPage(){
    if(this.data.btnForbidden) return;
    this.data.btnForbidden = true
    let dn = this.data.list;
    let data = {
      "SiteId":"",
      "PackageNo": dn
    }

    LoginModules.initPackage(data).then(res=>{
      console.log(res)
      this.setData({
        toastContent:res.Message
      })
     
    })
    this.data.btnForbidden = false
  },
  
   // chn新增加的方法
   close(e){
    this.onClose(e.detail)
  },

ok(){
  wx.redirectTo({
    url: "./../../pages/index/index"
  })
}
})

