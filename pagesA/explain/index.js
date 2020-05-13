
import { loginModules } from "../../modules/login.js";
import { config } from "./../../utils/config"
let LoginModules = new loginModules();
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    imgKeys: [],
    fontMaxFlag: false,
    fontMax: "您还可以输入150个字",
    note: "",
    valTips:"",
    isShow:false,
    btnForbidden: false,
    formInfoTrue:false,
    textareaDisabled:true
    
  },
  // 上传图片预览
  uploadImg() {
    if(this.data.upImgDone) {
      return
    }
    const that = this;
    wx.chooseImage({
      count: 9,
      success: function (res) {
        console.log(res)

        let tempFilePaths = res.tempFilePaths;
        that.upImg(tempFilePaths)
        // let imgPath = that.data.imgList.concat(tempFilePaths);
        // // console.log(imgPath)


      },
      fail: function (err) {

        console.log(err.errMsg)
        wx.showToast({
          title: err.errMsg,
          icon: "none"
        })

      }
    })
  },


  upImg(fileArray) {
    let that = this;
    this._tipsUpImging()
    for (let index = 0; index < fileArray.length; index++) {
      wx.uploadFile({
        url: config.baseUrl +'/FileUpload/FromDataUpload',
        filePath: fileArray[index],
        name: 'file',
        header: {
          Authorization: `Bearer ${wx.getStorageSync("token")}`
        },
        success(res) {
          let data = res.data
          let code = res.statusCode.toString();
          // 请求成功
          if (code.startsWith("2")) {
            let imgPath = fileArray[index];


            // console.log(data)
            data = JSON.parse(data);

            let imgKeys = data.ImageUrls[0];
            let imgItem = {
              path: imgPath,
              key: imgKeys
            }
            let imgList = that.data.imgList.concat(imgItem);

           
            that.setData({
              imgList
            })
            that._tipsUpImgDone()
            console.log(that.data.imgList)

          }

        }
      })
    }
  },

_tipsUpImging(){
  wx.showLoading({
    title: '图片上传中……',
  })
  this.data.upImgDone = true;
},
_tipsUpImgDone(){
  wx.hideLoading()
  this.data.upImgDone = false;
},
  // 获取服务器返回图片keys
  getImgKeys() {
    let imgList = this.data.imgList;
    // let imgKeys = this.data.imgKeys;
    let keys = [];
    let that = this;

    imgList.forEach(item => {
      keys.push(item.key);

      that.setData({
        imgKeys: keys
      })
    })
  },

  formSubmit: function (e) {
    if (this.data.btnForbidden) return

    console.log("按钮被点击")
    wx.showLoading({
      title: '信息提交中',
    })
    this.data.btnForbidden = true
    
    this.getImgKeys()
    if (this.data.imgKeys.length<=0){
      this.data.isShow = true
      wx.hideLoading()
      this.setData({
        isShow:true,
        valTips:"最少上传一张图片"
      })
      this.data.btnForbidden = false
      return
    }
    this.valDn()
   
  },

  ok(){
    this.setData({
      isShow:false
    });
    if (this.data.formInfoTrue){
      wx.reLaunch({
        url: '../../pages/index/index',
      })
    }
  },

  // 校验
  valDn() {
    // tkList格式化  
    let inTankList = wx.getStorageSync("inTankList") ;
    let TranDetails = [];
    inTankList.forEach(item => {
      let trankItem = {
        "F_Id": "",
        "F_PackageId": "",
        "F_CodeNo": item,
        "F_PackageStatus": "",
        "F_TransId": ""
      }
      TranDetails.push(trankItem)
    });

    let tank = {
      "F_Id": "无需使用",
      "F_PackageQty": wx.getStorageSync("inTotal") ,
      "F_DeliveryNumber": this.data.inNum,
      "F_InStockDate": app.initTime(),
      "F_OpDate": "",
      "F_StartSite": wx.getStorageSync("instartID"),
      "F_PackageStatus": "",
      "F_OutStockDate": "",
      "F_SysDate": "",
      "F_EndSite": wx.getStorageSync("inendID"),//todo
      "F_OpUser": "",
      "F_SysUser": "",
      "F_TransType": "入库",
      "F_Attachment": "",
      "Attachments": this.data.imgKeys,
      "F_Memo": this.data.note,
      "TranDetails": TranDetails
    }

    LoginModules.validation(tank).then(res => {
      console.log("校验被调用",res)
      wx.hideLoading()
      this.data.btnForbidden = false
      if (res.StatusCode ==="Error"){
        console.log(res)
        this.setData({
          valTips: res.Message,
          isShow:true

        })
      } else if (res.StatusCode === "Warn"){
        let that = this;
        wx.showModal({
          title: '温馨提示',
          content: res.Message,
          success(mod) {
            if (mod.confirm) {
              
            that.create(tank)
            } else if (mod.cancel) {
              console.log('用户点击取消')
            }
          }
        })
       
      }
      else{
        this.create(tank)
      }
      
     
    })
   
  },

  // 测试出入库
  create(tank) {
    console.log("入库数据",tank)
 
    let that = this
    LoginModules.createTran(tank).then(res => {
      wx.hideLoading()
      this.data.btnForbidden = false
      wx.removeStorageSync('inTotal')
      wx.removeStorageSync('inTankList')

      this.setData({
        isShow: true,
        valTips: "数据提交成功",
        formInfoTrue:true
        
      })
    
    })
  },


  inputKey(e) {
    let val = e.detail.value;
    let index = e.detail.value.length;
    // 显示字数提示
    let len = 150 - index;
    this.setData({
      fontMax: `您还可以输入${len}个字`,
      note: val
    })
   
  },
  goBack() {
    wx.navigateBack({
    })
  },

  // 删除图片
  deleteImg(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.key;

    if (e.target.id == "cuo") {
      this.showToast({
        msg: "是否删除"
      }).then(res => {
        this._removeList(index)
      })
    }

  },
  // 删除图片
  _removeList(index) {
    this.data.imgList.splice(index, 1)
    let imgPath = this.data.imgList;
    this.setData({
      imgList: imgPath
    })
  },
  //提示框封装
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


  // textarea 判断字数是否超标

  showTips() {
    this.setData({
      fontMaxFlag: true
    })
  },
  hideTips() {
    console.log(this.data.note)
    this.setData({
      fontMaxFlag: false
    })
  },

onLoad:function(){
  let inNum = wx.getStorageSync("inNumber");
  this.setData({
    inNum: inNum
  })
  console.log(inNum)
},
onShow:function(){
    let inNum = wx.getStorageSync("inNumber");
    this.setData({
      inNum: inNum
    })
  },

  ceshi(){
    console.log("车市")
  }

})