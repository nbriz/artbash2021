/* global Averigua */
class Music {
  constructor (opts) {
    const as = Averigua.audioSupport()
    let type = 'mp3'
    if (as.mp3 === 'probably') type = 'mp3'
    else if (as.vorbis === 'probably') type = 'mp3'
    this.path = `../music/${opts.name}.${type}`
    this.ready = false
    this.playTriggered = false
    this.audio = new window.Audio(this.path)
    this.audio.loop = true
    this.audio.volume = 0
    this.audio.addEventListener('canplaythrough', e => {
      this.ready = true
    })

    opts.ele.addEventListener('click', (e) => {
      if (opts.ele.src.includes('sound-off.svg')) {
        opts.ele.src = '../images/sound-on.svg'
        this.audio.play()
        this.playTriggered = true
      } else {
        opts.ele.src = '../images/sound-off.svg'
        this.audio.pause()
        this.playTriggered = false
      }
    })
  }

  fadeIn () {
    const v = this.audio.volume + 0.1
    if (v < 1) {
      this.audio.volume = v
      setTimeout(() => this.fadeIn(), 100)
    } else this.audio.volume = 1
  }

  fadeOut (callback) {
    const v = this.audio.volume - 0.1
    if (v > 0) {
      this.audio.volume = v
      setTimeout(() => this.fadeOut(callback), 100)
    } else {
      this.audio.volume = 0
      callback()
    }
  }

  play (wait) {
    if (!wait && this.playTriggered) return
    this.playTriggered = true
    if (this.ready) {
      this.audio.play()
      this.fadeIn()
    } else setTimeout(() => { this.play(true) })
  }

  pause () {
    this.playTriggered = false
    this.fadeOut(() => {
      this.audio.pause()
    })
  }
}

window.Music = Music
