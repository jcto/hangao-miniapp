// pagesA/storageList/index.js
let app = getApp();
Page({
  data: {
    show: true,
    transitionModel: "",
    list: [],
    DN: wx.getStorageSync("inNumber"),
   
    total: wx.getStorageSync("inTotal") ,//总桶数
    isShow:false,
    TKDN:""
  },

  
  // 删除
  onClose(e) {
    let index = e.currentTarget.dataset.index;
   
    if (e.target.id == "close") {
      this.showToast({
        msg: "是否删除"
      }).then(res => {
        this._removeList(index)
        wx.setStorageSync("inTankList", this.data.list)
      })
    }
  },
  TKInputEnd(e){
    let inputTK = e.detail.value;
    if (inputTK){
      this.tkCheck(inputTK)
    }
    

  },

  _removeList(index) {
    this.data.list.splice(index, 1)
    let tkDN = this.data.list;
    this.setData({
      list: tkDN
    })
  },
  // 扫码
  scan() {
    let that = this;
    let list = this.data.list;
    
    wx.scanCode({
      success: (res) => {
       
        let result = res.result;
        // if (result.length === 8) {
        //   console.log(res.result)
        //   list.unshift(result);
  
        //   let newList = [...new Set(list)]
         
        //   that.setData({
        //     list: newList,
           
          
        //   })

        // } else {
        //   wx.showToast({
        //     title: 'DN单号必须为八位',
        //     icon: "none"
        //   })
        // }
        that.tkCheck(result)
      },
      fail: (res) => {
        console.log(res);
        wx.showToast({
          title: '扫码失败，请重试',
          icon:"none"
        })
      }

    })
  },

  // tkCheck
  tkCheck(result){
    let list = this.data.list;
    if (result.length === 8) {
     
      list.unshift(result);

      let newList = [...new Set(list)]

      this.setData({
        list: newList,


      })
      wx.setStorageSync("inTankList", this.data.list)
    } else {
      wx.showToast({
        title: 'Tank编号为八位,请扫码Tank二维码',
        icon: "none"
      })
    }
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
  // 上一页
  goBack() {
    wx.setStorageSync("inTankList",this.data.list )
    wx.navigateBack({})
  },
   // chn新增加的方法
   close(e){
    debugger
    this.onClose(e.detail)
  },
  // 下一页
  next() {

    if (this.data.total != this.data.list.length){
     this.setData({
       isShow:true
     })
      return 
    }
    // 储存tk列表的值
    wx.setStorageSync("inTankList", this.data.list)
   
    
    wx.navigateTo({
      url: '../explain/index',
    })
  },
  onShow:function(){
   let tNum = wx.getStorageSync("inTotal");
    let list = wx.getStorageSync("inTankList");
    if(!list){
      list = []
    };
    let inNumber = wx.getStorageSync("inNumber");
    console.log("tNum",tNum)
   this.setData({
     total: tNum,
     DN: inNumber,
     list
   })
  },


})