const app = getApp();
import { loginModules } from "../../modules/login.js";
import { filterSite } from "../../modules/filterSite.js";
let LoginModules = new loginModules();
let startColumnsData;
let endPickData;
let endColumnsData;

Page({
  /**
   * 页面的初始数据
   */

  data: {
    navTitle: "",
    // startPlace: wx.getStorageSync("siteName"),
    DnNum: "",//dn单号
    dnTips: "",
    Tipsflag: false,

    siteArray: [],
    total: 0,//桶数,
    totalflag: false,
    totalTips: "",
   
   
   
   
    addDnStartPlace:"",
    
    startPlaceTips: "点击选择仓库",
    endtPlaceTips: "点击选择仓库",

    showPopupFlag:false, //双向栏显示隐藏
    CityAndStorage:[],
    endPopupFlag:false
   
  },
  goPrev() {
   
    wx.reLaunch({
      url: './../../pages/index/index',
    })
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, startColumnsData[value[0]]);
    this.setData({
      endtPlaceTips:'点击选择仓库'
    })
    this.updateEndPickData()
  },


  next() {
    // 为空判断
    if (!this.data.totalflag || !this.data.Tipsflag) {
      this.checkDN(this.data.DnNum);
      this.checkTotal(this.data.total)
      return
    }
    let checkDestination = this._checkDestination();
    if (!checkDestination) return
    let OUTINFO = {};
    OUTINFO.total = parseInt(this.data.total),
      OUTINFO.TKNUMBER = this.data.DnNum,
      wx.setStorageSync("OUTINFO", OUTINFO)
    wx.navigateTo({
      url: '../removal/index',
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initTime()
    // this.getOut();
    // 获取城市以及对应的仓库
    this.getCityAndStroage();

    //  获取始发地和目的地联动数据

    LoginModules.getOutCity().then((res) => {
      this.initPickData(res);
    });
  },
  _checkDestination() {
    let outstartID = wx.getStorageSync("outstartID");
    let outendID = wx.getStorageSync("outendID")
    console.log(outendID, outstartID, "_checkDestination")
    if (outstartID === outendID) {
      wx.showToast({
        title: '起始站点和目的站点不能一致',
        icon: 'none',

      })
      return false
    } else if (outstartID == "" || outendID == "") {
      if (outstartID == "") {
        wx.showToast({
          title: '起始站点不存在',
          icon: 'none',

        })
      } else {
        wx.showToast({
          title: '目的站点不存在',
          icon: 'none',

        })
      }
      return false
    } else {
      return true
    }


  },

  goBack() {
    
    this.goPrev()
  },
  // 时间获取以及格式化




  // 判断是否符合输入规则
  changeDnNum(e) {
    this.checkDN(e.detail)
    this.data.DnNum = e.detail
  },


  // 单号效验
  checkDN(DN) {
    // console.log(DN, "DN")
    let arr1 = "";
    if (DN.length >= 3) {
      arr1 = DN.slice(0, 2);
      arr1 = parseInt(arr1);
    }

    let DNLIst = DN.split('');

    let DNLISTNAN = false
    DNLIst.forEach(item => {

      if (isNaN(Number(item))) {
        DNLISTNAN = true

      }

    })

    if (!DN) {
      this.setData({
        dnTips: "DN号不能为空",
        Tipsflag: false

      })
    } else if (DNLISTNAN) {

      this.setData({
        dnTips: "DN单号只能是数字",
        Tipsflag: false

      })
    } else if (DN.length !== 10) {

      this.setData({
        dnTips: "DN单号必须为10位",
        Tipsflag: false

      })
    } else if (arr1 !== 99 && arr1 !== 88 && arr1 !== 77 && arr1 !== 66 && arr1 !== 55 && arr1 !== 44 && arr1 !== 33 && arr1 !== 22 && arr1 !== 11) {

      this.setData({
        dnTips: "DN单号必须为99-11开头",
        Tipsflag: false

      })


    } else {
      this.setData({
        dnTips: "",
        Tipsflag: true

      })
    }
  },
  initTime() {
    let NowTime = app.initTime()
    this.setData({
      time: NowTime
    })
  },

  // 扫码
  scan() {
    debugger
    let that = this;
    wx.scanCode({
      success: (res) => {
        let DnNum =res.result;
        
        that.setData({
          DnNum
        })
        that.checkDN(DnNum)
      },
      fail: (res) => {
        console.log(res);
      }

    })
  },



  // 效验桶数
  checkTotal(total) {

    let barrelage = (parseInt(total))
    console.log(barrelage, "barrelage")
    if (isNaN(Number(total))) {
      this.setData({
        totalTips: "数量只能为数字",
        totalflag: false,
        total: barrelage
      })
    } else if (parseInt(total) === 0) {
      this.setData({
        totalTips: "数量不能为零",
        totalflag: false,
        total: barrelage
      })
    }
    else if (!total) {
      this.setData({
        totalTips: "数量不能为空",
        totalflag: false,
        total: barrelage
      })
    } else {
      this.setData({
        totalTips: "",
        totalflag: true,
        total: barrelage
      })
    }
  },

//  请求以及格式化数据
  getCityAndStroage() {
    LoginModules.getCity().then(res => {
      this.data.CityAndStorage = res
      let city =  this.classify(res);
      let cityStore = {}
      let AllDataArray = []
      let itemArray = [];
      for (let i = 0; i < city.length; i++) { 
        itemArray[i]=[]
        for(let k =0;k< city[i].allData.length;k++){
          itemArray[i].push(city[i].allData[k].SiteName)
          console.log(city[i].allData[k].SiteName)
        }  
        cityStore[city[i].City] = itemArray[i]
      }
      // let columns= [
      //   {
      //     values: Object.keys(cityStore),
      //     className: 'column1'
      // },
      //   {
      //     values: cityStore['成都'],
      //     className: 'column2',
      //     defaultIndex: 0
      // }
      // ]
      this.setData({
        // columns,
        cityStore,
        storeageIsOk: true,
      })
    })  
  },

  // 起始地仓库唤醒
  showStorage(){
    this.setData({
      showPopupFlag:true
    }) 
  },
  showendStorage(){
    this.setData({
      endPopupFlag: true
    }) 
  },
  // 目的地确定下拉框
  onendConfirm(event){
    const { picker, value, index } = event.detail;
    this.setData({
      endPopupFlag: false,
      endtPlaceTips: value
    })

    console.log(`当前值：${value}, 当前索引：${index}`);
    this.getStrageID(value, "outendID")
  },
  onConfirm(event) {
    const { picker, value, index } = event.detail;
    this.setData({
      showPopupFlag:false,
      startPlaceTips: value
    })
    
    this.getStrageID(value, "outstartID");
    this.updateEndPickData();
    
  },

  // 获取仓库id值
  getStrageID(value, setStorageNAme, warehouseTrue=false){
    let allStorgae = this.data.CityAndStorage;
    if (!warehouseTrue){
     
      allStorgae.forEach(item => {
        if (item.SiteName === value[1] && item.City === value[0]) {
          wx.setStorageSync(setStorageNAme, item.SiteId)
        }
      })
    }else{
      allStorgae.forEach(item => {
        if (item.SiteName === value) {
          wx.setStorageSync(setStorageNAme, item.SiteId)
        }
      })
    }
    
  },

  onCancel(event) {
    this.setData({
      showPopupFlag: false,
      endPopupFlag: false
    })
    
  },

  
  
  onClose(){
    this.setData({
      showPopupFlag: false,
      endPopupFlag:false
    })
  },
 
  // 格式化城市数组
  classify(arr) {
    let c = [];
    let d = {};
    arr.forEach(element => {
      if (!d[element.City]) {
        c.push({
          City: element.City,
          allData: [element]
        });
        d[element.City] = element;

      } else {
        c.forEach(ele => {
          if (ele.City == element.City) {
            ele.allData.push(element);
          }
        });
      }

    });
  
    return c;
  },
  changeTotal(e) {
    console.log(e.detail),
      this.checkTotal(e.detail)
    this.data.total = e.detail
  },

  totalInputEnd() {

    wx.setStorageSync("inTotal", this.data.total)
  },
 // chn 初始化起始地选择
 initPickData(res) {
  const siteMap = filterSite(res);
  const startSite=siteMap.startSite;
  const citys=Object.keys(siteMap.startSite)
  startColumnsData=startSite
  endPickData=siteMap.endSite

  const columns = [
    {
      values: citys,
      className: "column1",
    },
    {
      values:citys[0]?startSite[citys[0]]:[],
      className: "column2",
      defaultIndex: 0,
    },
  ];
  this.setData({
    columns
  })
},
// 更新目的地 依据起始地选择进行联动更新
updateEndPickData(){
  let startPlaceTips=this.data.startPlaceTips;
  // const endSite=endPickData[]
  if(startPlaceTips==='点击选择仓库'){
    return
  }
  startPlaceTips=startPlaceTips[1];

  endColumnsData= endPickData[startPlaceTips]||{}
  const citys=Object.keys(endColumnsData)

  const endColumns=[
    {
      values: citys,
      className: "column1",
    },
    {
      values:citys[0]?endColumnsData[citys[0]]:[],
      className: "column2",
      defaultIndex: 0,
    },
  ];
  this.setData({
    endColumns
  })
},
onendChange(event){
  const { picker, value, index } = event.detail;
  debugger
  console.log('******',value)
  if(!value[0]||!endColumnsData){
    return
  }
  picker.setColumnValues(1, endColumnsData&&endColumnsData[value[0]]);
}
});



