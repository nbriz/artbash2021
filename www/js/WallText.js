class WallText {
  constructor (config) {
    if (config.onHashLoad) this.onHashLoad = config.onHashLoad
    if (config.onOpen) this.onOpen = config.onOpen
    if (config.onClose) this.onClose = config.onClose

    this.onNameClick = config.onNameClick
    this.onCloseCard = config.onCloseCard
    this.onURLClick = config.onURLClick
    this.onInspectClick = config.onInspectClick

    this.visible = false // showing full list text
    this.didactic = false // showing individual work text

    this.css = `
      .close-about {
        font-size: 2vw;
        cursor: url(../images/pointer--white.svg) 5 0, auto;
        position: fixed;
        top: 7vw;
        right: 8vw;
      }

      .show-info {
        font-family: 'Anonymous Pro';
        display: none;
        overflow-y: scroll;
        scrollbar-color: #fff rgba(0,0,0,0);
        scrollbar-width: thin;
        width: 94vw;
        height: 92vh;
        position: fixed;
        top: 2vw;
        left: 3vw;
        z-index: 8001;
        background: #000;
        color: #fff;
        padding: 5vw;
        cursor: url(../images/pointerX3-white.svg) 35 5, auto;
      }

      .show-info::-webkit-scrollbar {
        background: rgba(0,0,0,0);
      }
      .show-info::-webkit-scrollbar-track {
        background: rgba(0,0,0,0);
      }
      .show-info::-webkit-scrollbar-thumb {
        background: #fff;
      }

      .show-info h1 {
        color: #fff;
        letter-spacing: 0.1vw;
        font-size: 5vw;
        font-family: 'uni0553';
        font-weight: 100;
        margin-top: -1vw;
      }

      .show-info p {
        max-width: 70vw;
        font-size: 2vw;
      }

      .line-up {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        font-size: 2vw;
        padding-bottom: 100px;
      }

      .line-up > div > div {
        cursor: url(../images/pointer--white.svg) 5 0, auto;
      }

      /* Work Info (wall text) */

      .work-info {
        display: none;
        position: fixed;
        z-index: 100;
        bottom: 2vw;
        left: 2vw;
        width: 25vw;
        max-height: 80vh;
        font-size: 1.2vw;
        background: #000;
        color: #fff;
        padding: 1.4vw;
      }

      .work-info > #info {
        scrollbar-color: #fff rgba(0,0,0,0);
        scrollbar-width: thin;
      }
      .work-info > #info::-webkit-scrollbar {
        background: rgba(0,0,0,0);
      }
      .work-info > #info::-webkit-scrollbar-track {
        background: rgba(0,0,0,0);
      }
      .work-info > #info::-webkit-scrollbar-thumb {
        background: #fff;
      }

      #title { font-size: 3vw; }

      #artist { margin: 1vw 0 2vw 0; }

      #info { overflow-y: auto; max-height: 25vh; }

      #closeWork {
        cursor: url(../images/pointer--white.svg) 5 0, auto;
        float: right;
      }

      .work-info img {
        cursor: url(../images/pointer--white.svg) 5 0, auto;
        width: 2vw;
        margin-right: 1vw;
      }

      #size { float: right; }
    `
    this.html = `
      <div class="close-about">✕</div>
      <h1>${config.title}</h1>
      <p>
        ${config.info}
      </p>
      <div class="line-up">
        <div></div>
        <div></div>
        <div></div>
      </div>
    `

    if (config.extra) this.html += config.extra

    this.createStyles()
    this.createElement()
    if (config.data) this.createList(config.data, config.translate)
  }

  createStyles () {
    this.styles = document.createElement('style')
    this.styles.innerHTML = this.css
    document.head.appendChild(this.styles)
  }

  createElement () {
    this.ele = document.createElement('div')
    this.ele.className = 'show-info'
    this.ele.innerHTML = this.html
    document.body.appendChild(this.ele)
    document.querySelector('.close-about').addEventListener('click', () => {
      this.hideShowInfo()
      if (this.onClose) this.onClose()
    })
  }

  createList (data, opts) {
    this.translate = opts
    this.data = data
    const third = Math.ceil(data.length / 3)
    data.forEach((w, i) => {
      if (!w.artist && opts) { w.artist = w[opts.artist] }
      let col
      if (i < third) col = document.querySelector('.line-up > div:nth-child(1)')
      else if (i < third * 2) col = document.querySelector('.line-up > div:nth-child(2)')
      else col = document.querySelector('.line-up > div:nth-child(3)')
      const name = document.createElement('div')
      name.textContent = w.artist
      name.addEventListener('click', () => {
        this.onNameClick(w, i)
        setTimeout(() => this.hideShowInfo(), 10)
      })
      col.appendChild(name)
    })
  }

  hideShowInfo () {
    this.ele.style.display = 'none'
    this.visible = false
  }

  displayShowInfo () {
    if (this.onOpen) this.onOpen()
    this.ele.style.display = 'block'
    this.visible = true
  }

  hideTitleCard () {
    if (!this.card) return
    window.location.hash = ''
    this.card.style.display = 'none'
    this.didactic = false
  }

  displayTitleCard (art, opts) {
    this.hideShowInfo()

    if (!opts) opts = this.translate
    if (!art.artist && opts) { art.artist = art[opts.artist] }
    if (!art.title && opts) { art.title = art[opts.title] }
    if (!art.info && opts) { art.info = art[opts.info] }
    if (!art.size && opts) { art.size = art[opts.size] }
    if (!art.url && opts) { art.url = art[opts.url] }

    if (!this.card) {
      this.card = document.createElement('div')
      this.card.className = 'work-info'
      document.body.appendChild(this.card)
    }

    const name = art.artist.replace(/ /g, '-')
    const piece = art.title.replace(/ /g, '-')
    window.location.hash = name + '/' + piece

    this.card.innerHTML = `
    <div id="closeWork">✕</div>
    <div id="title">${art.title}</div>
    <div id="artist">by ${art.artist}</div>
    <div id="info">${art.info}</div>
    <br>
    <img src="../images/eye.svg" id="inspectWork">
    <img src="../images/profile.svg" id="openProfile">
    <div id="size">${art.size}</div>`

    const css = document.querySelector(':root')
    this.card.addEventListener('mouseover', (e) => {
      css.style.setProperty('--pointerX3', 'url(../images/pointerX3-white.svg) 35 5, auto')
    })
    this.card.addEventListener('mouseout', (e) => {
      css.style.setProperty('--pointerX3', 'url(../images/pointerX3.svg) 35 5, auto')
    })

    document.querySelector('#closeWork').addEventListener('click', () => {
      this.hideTitleCard()
      if (this.onCloseCard) this.onCloseCard(art)
    })

    this.card.style.display = 'block'
    this.didactic = true

    const has = (i) => art[i] && art[i] !== ''
    if (has('info')) document.querySelector('#info').style.display = 'block'
    else document.querySelector('#info').style.display = 'none'
    if (has('size')) document.querySelector('#size').style.display = 'block'
    else document.querySelector('#size').style.display = 'none'
    if (has('url')) {
      document.querySelector('#openProfile').style.display = 'inline-block'
      document.querySelector('#openProfile').addEventListener('click', () => {
        if (this.onURLClick) this.onURLClick(art.url)
      })
    } else document.querySelector('#openProfile').style.display = 'none'
    document.querySelector('#inspectWork').addEventListener('click', () => {
      if (this.onInspectClick) this.onInspectClick(art)
    })
  }

  parseHash () {
    if (window.location.hash) {
      const url = window.location.hash.split('/')
      url[0] = url[0].substr(1).split('-').join(' ')
      url[1] = url[1].split('-').join(' ')
      return url
    }
  }

  checkURLHash (opts) {
    if (!opts) opts = this.translate || { title: 'title', artist: 'artist' }
    if (window.location.hash) {
      const url = this.parseHash()
      const art = this.data
        .filter(w => w[opts.title] === url[1])
        .filter(w => w[opts.artist] === url[0])[0]
      if (this.onHashLoad) this.onHashLoad(art)
    }
  }
}

if (typeof module !== 'undefined') module.exports = WallText
