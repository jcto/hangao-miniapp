import { loginModules } from "../../modules/login.js";
let LoginModules = new loginModules();
Component({
  data: {
    active: 0,
    show: false,
  },
  methods: {
    showPopup() {
      this.setData({ show: true });
    },

    onClose() {
      this.setData({ show: false });
    },
    scan() {
      let _this = this;
      this.setData({ show: true });
return
      wx.scanCode({
        success: (res) => {
          let result = res.result;
          LoginModules.getOutCity().then((res) => {
            this.setData({ show: true });
          });
        },
        fail: (res) => {
          console.log(res);
        },
      });
    },
    onChange(event) {
      const detail = event.detail;
      if (detail === 1) {
        console.log("scan");
        // 这里调用涉像头
        this.scan();
        return;
      }
      if (detail === 0) {
        console.log("home");
      }
      if (detail === 2) {
        console.log("person");
      }
      // event.detail 的值为当前选中项的索引
      this.setData({ active: event.detail });
    },
  },
});
