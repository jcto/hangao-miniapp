Component({
  properties: {
    label: {
      // 属性名
      type: String,
      value: "账号:",
    },
    required: {
      type: Boolean,
      value: true,
    },
    clearable: {
      type: Boolean,
      value: true,
    },
    placeholder:{
      type:String,
      value:''
    },
    value: {
      type: String,
      value: "",
    },
    type: String, // 简化的定义方式
  },
  methods: {
    changeValue(e) {
      this.triggerEvent("inputChange", e.detail);
    },
  },
});
