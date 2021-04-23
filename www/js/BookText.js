class BookText {
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

    /* -----------------------------*/

    #label {
      text-align: right;
      max-width: 30vw;
      display: inline-block;
      position: absolute;
      z-index: 1;
    }
    #label > span { font-weight: bold; }
    #label > .title { font-size: 3vw; }
    #label > .artist { font-size: 1.5vw; }

    /* book page */

    #page {
      display: none;
      opacity: 0;
      position: fixed;
      z-index: 2;
      bottom: 2vw;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      font-size: 1.2vw;
      background: #fff;
      color: #000;
      padding: 9vw 29vw;
      transition: opacity 1s;
      overflow: scroll;
    }

    #page > .title { font-size: 3vw; text-align: center; }

    #page > .artist { margin: 1vw 0 6vw 0; text-align: center; }

    #page > .closeWork {
      cursor: url(../images/pointer.svg) 5 0, auto;
      float: right;
    }

    #page > .icon {
      cursor: url(../images/pointer.svg) 5 0, auto;
      width: 2vw;
      margin-right: 1vw;
      margin-bottom: 4vw;
    }

    #page > .size { float: right; }

    #page > .cover {
      max-width: 100%;
      display: inline-block;
      margin: 2vw 0;
      cursor: url(../images/pointer.svg) 5 0, auto;
      border: 0.4vw solid #000;
      outline: 0.2vw solid #000;
      outline-offset: 0.2vw;
    }

    #closeWork {
      cursor: url(../images/pointer.svg) 5 0, auto;
      position: fixed;
      top: 2vw;
      right: 6vw;
      font-size: 3vw;
    }
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

    this.label = document.createElement('span')
    this.label.id = 'label'
    this.label.innerHTML = `
      <span class="title"></span>
      <br>
      <span class="artist"></span>
    `
    document.body.appendChild(this.label)

    this.page = document.createElement('span')
    this.page.id = 'page'
    this.page.innerHTML = `
      <div id="closeWork">✕</div>
      <div class="title"></div>
      <div class="artist"></div>
      <div class="info"></div>
      <img src="" class="cover">
      <br>
      <img src="../images/eye-black.svg" id="inspectWork" class="icon">
      <img src="../images/profile-black.svg" id="openProfile" class="icon">
      <div class="size"></div>`
    document.body.appendChild(this.page)
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
    window.location.hash = ''
    this.didactic = false
    this.page.querySelector('.title').textContent = ''
    this.page.querySelector('.artist').textContent = ''
    this.page.querySelector('.info').textContent = ''
    this.page.querySelector('.cover').src = ''
    this.page.querySelector('.size').textContent = ''
    this.page.querySelector('.cover').style.display = 'none'
    this.page.querySelector('#inspectWork').style.display = 'none'
    this.page.querySelector('#openProfile').style.display = 'none'
    this.page.style.opacity = '0'
    setTimeout(() => {
      this.page.style.display = 'none'
      // gallery.bookReturn(art.book)
    }, 1000)
  }

  displayTitleCard (art, opts) {
    this.hideShowInfo()

    if (!opts) opts = this.translate
    if (!art.artist && opts) { art.artist = art[opts.artist] }
    if (!art.title && opts) { art.title = art[opts.title] }
    if (!art.info && opts) { art.info = art[opts.info] }
    if (!art.size && opts) { art.size = art[opts.size] }
    if (!art.url && opts) { art.url = art[opts.url] }
    if (!art.cover && opts) { art.cover = art[opts.cover] }

    const name = art.artist.replace(/ /g, '-')
    const piece = art.title.replace(/ /g, '-')
    window.location.hash = name + '/' + piece
    const filename = art.cover.split('.')[0]
    this.page.querySelector('.title').textContent = art.title
    this.page.querySelector('.artist').textContent = 'by ' + art.artist
    this.page.querySelector('.info').textContent = art.info
    this.page.querySelector('.cover').src = `../data/book-arts/covers/${filename}.png`
    this.page.querySelector('.cover').style.display = 'inline-block'
    this.page.querySelector('.size').textContent = art.size
    this.page.querySelector('#inspectWork').style.display = 'inline-block'
    if (art.url) this.page.querySelector('#openProfile').style.display = 'inline-block'
    else this.page.querySelector('#openProfile').style.display = 'none'
    this.page.style.display = 'block'
    setTimeout(() => {
      this.page.style.opacity = '1'
    }, 100)

    this.didactic = true

    this.page.querySelector('#closeWork').onclick = () => {
      this.hideTitleCard()
      if (this.onCloseCard) this.onCloseCard(art)
    }

    if (art.url && art.url !== '') {
      this.page.querySelector('#openProfile').style.display = 'inline-block'
      this.page.querySelector('#openProfile').onclick = () => {
        if (this.onURLClick) this.onURLClick(art.url)
      }
    } else this.page.querySelector('#openProfile').style.display = 'none'

    this.page.querySelector('.cover').onclick = () => {
      if (this.onInspectClick) this.onInspectClick(art)
    }
    this.page.querySelector('#inspectWork').onclick = () => {
      if (this.onInspectClick) this.onInspectClick(art)
    }
  }

  hideLabel () {
    this.label.style.display = 'none'
  }

  showLabel (title, artist, e) {
    if (!title) { this.hideLabel(); return }
    this.label.querySelector('.title').textContent = title
    this.label.querySelector('.artist').textContent = 'by ' + artist
    const w = this.label.offsetWidth
    const h = this.label.offsetHeight
    this.label.style.top = e.clientY - (h / 2) + 'px'
    this.label.style.left = (window.innerWidth / 2) - w - (window.innerHeight / 6) + 'px'
    this.label.style.display = 'inline-block'
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
        // .filter(w => w[opts.title] === url[1])
        .filter(w => w[opts.artist] === url[0])[0]
      if (this.onHashLoad) this.onHashLoad(art)
    }
  }
}

window.BookText = BookText
