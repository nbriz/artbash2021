/* global BGGradient, WallText, Music */
const bg = new BGGradient('#ef717d', '#6f6d9d')

const dis = window.createDisclaimer()

const load = window.createLoader(() => {
  load.style.display = 'none'
  dis.style.display = 'none'
  header.style.display = 'flex'
  slide.fadeIn()
  music.play()
  document.querySelector('[alt="menu"]').click()
  document.querySelectorAll('.arrow').forEach(ele => {
    ele.style.display = 'block'
  })
  if (wtxt.parseHash() instanceof Array) wtxt.checkURLHash()
})

const wtxt = new WallText({
  title: 'Site/Sight',
  info: 'Site/Sight features documentation of physical works installed in the Neiman Center lobby and SITE Gallery at the School of the Art Institute of Chicago.',
  onHashLoad: function (w) { slide.select(w) },
  onNameClick: function (w) { slide.select(w) },
  onURLClick: function (url) {
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.click()
  },
  onInspectClick: function (w) {
    const url = `../data/site-sight/${w.filename}`
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.click()
  }
})

const header = window.createHeader(wtxt)

const music = new Music({
  name: 'opencall',
  ele: header.querySelector('#sound-icon')
})

const translate = {
  artist: 'Name as you\'d like it to appear',
  title: 'Title',
  info: 'Writing',
  type: 'Materials',
  url: 'Social Media Link'
}

class Slide {
  constructor () {
    this.data = []
    this.selected = null
    this.idx = null
    this.ele = document.querySelector('#slide')

    window.fetch('../data/json/site-sight.json')
      .then(res => res.json())
      .then(json => {
        this.data = json
        wtxt.createList(json, translate)
        this.createSlide(this.data[0])
        load.update(1)
      })

    window.addEventListener('mousemove', (e) => {
      bg.draw(e.clientX, e.clientY)
    })
  }

  createSlide (w) {
    this.ele.innerHTML = `
      <img src="../data/site-sight/${w.filename}" id="pic">
    `

    const img = this.ele.querySelector('#pic')
    img.onload = () => {
      const w = window.innerWidth - (window.innerWidth * 0.14)
      const h = window.innerHeight - (window.innerHeight * 0.28)
      const iw = img.width
      const ih = img.height
      const s = w / iw
      img.width = s * iw
      img.height = s * ih
      if (img.height > h) {
        const s2 = h / ih
        img.width = s2 * iw
        img.height = s2 * ih
      }
    }
    img.addEventListener('click', () => {
      wtxt.displayTitleCard(w)
    })
  }

  select (w) {
    this.selected = w
    this.idx = this.data.indexOf(w)
    const name = w[translate.artist].replace(/ /g, '_')
    const piece = w[translate.title].replace(/ /g, '_')
    window.location.hash = name + '/' + piece
    this.createSlide(w)
    wtxt.hideShowInfo()
    wtxt.displayTitleCard(w)
  }

  prev () {
    this.idx--; if (this.idx < 0) this.idx = this.data.length - 1
    this.fadeOut(() => {
      this.select(this.data[this.idx])
      this.fadeIn()
    })
  }

  next () {
    this.idx++; if (this.idx >= this.data.length) this.idx = 0
    this.fadeOut(() => {
      this.select(this.data[this.idx])
      this.fadeIn()
    })
  }

  fadeIn () {
    slide.ele.style.display = 'flex'
    setTimeout(() => {
      slide.ele.style.opacity = 1
    }, 10)
  }

  fadeOut (cb) {
    slide.ele.style.opacity = 0
    setTimeout(() => {
      slide.ele.style.display = 'none'
      cb()
    }, 1000)
  }
}

const slide = new Slide()

document.querySelector('.left').addEventListener('click', () => slide.prev())
document.querySelector('.right').addEventListener('click', () => slide.next())
