Component({
    data: {
        active: 0, 
        show: true,
    },
    methods: {
        showPopup() {
            this.setData({ show: true });
          },
        
          onClose() {
            this.setData({ show: false });
          },
        onChange(event) {
            const detail = event.detail;
            if (detail === 1) {
                console.log("scan");
                this.setData({ show: true });
                return
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
    }

})