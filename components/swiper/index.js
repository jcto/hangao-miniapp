Component({  
    data: {
      background: ['lun1', 'lun2', 'lun3'],
      indicatorDots: true,
      circular:true,
      vertical: false,
      autoplay: true,
      interval: 2000,
      duration: 800
    },
  
    changeIndicatorDots() {
      this.setData({
        indicatorDots: !this.data.indicatorDots
      })
    },
  
    changeAutoplay() {
      this.setData({
        autoplay: !this.data.autoplay
      })
    },
  
    intervalChange(e) {
      this.setData({
        interval: e.detail.value
      })
    },
  
    durationChange(e) {
      this.setData({
        duration: e.detail.value
      })
    }
  })
