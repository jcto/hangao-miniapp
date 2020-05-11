//app.js
import { loginModules } from "./modules/login.js";
let LoginModules = new loginModules();

App({
  // globalData:{
  //   originalPlace:"",
  //   userSiteId:"",
   
  //   outTankList:[],
  //   inTotal:0,
  //   inTankList:[],
   
  // } ,
   addZero(day) {
    if (parseInt(day) < 10) {
      return `0${day}`
    }
    return day
  },
  initTime() {
    let date = new Date();
    let year = date.getFullYear();
    let month = this.addZero(date.getMonth() + 1);


    let days = this.addZero(date.getDate());
    let h = this.addZero(date.getHours());
    let m = this.addZero(date.getMinutes());

    let NowTime = `${year}-${month}-${days}  ${h}：${m}`;
    return NowTime
    // console.log(NowTime)
    // this.setData({
    //   time: NowTime
    // })
  },
  
})


