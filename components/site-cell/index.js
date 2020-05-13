Component({
  properties: {
    startLabel: String,
    endLabel: String,
    startValue: String,
    endValue: String,
    imgUrl: String,
    type: String, // 简化的定义方式
  },
  methods: {
    showStorage() {
      this.triggerEvent("tapshowStart");
    },
    showendStorage() {
        this.triggerEvent("tapshowEnd");
      },
  },
});
