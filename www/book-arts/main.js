/* global THREE, TWEEN, CyberSpace, BGGradient, BookText, Book, Music */
const bg = new BGGradient('#bdd9a8', '#4795a2')

const dis = window.createDisclaimer()

const translate = {
  artist: 'Name as you would like it to appear in exhibition',
  title: 'Title of piece',
  info: 'Description (short paragraph about the piece) Not required',
  size: 'Dimensions of piece in INCHES (W X H X D)',
  url: 'LINK YOUR Instagram',
  cover: 'What is the FILE NAME of the work you submitted? IT MUST be LASTNAME_FIRSTNAME_BookArts_Cover - your work will not be accepted if this is not done correctly',
  pages: 'What is the FILE NAME of the work you submitted? IT MUST be LASTNAME_FIRSTNAME_BookArts - your work will not be accepted if this is not done correctly'
}

const load = window.createLoader(() => {
  load.style.display = 'none'
  dis.style.display = 'none'
  header.style.display = 'flex'
  World.show()
  music.play()
  if (wtxt.parseHash() instanceof Array) {
    wtxt.checkURLHash()
  }
})

const wtxt = new BookText({
  title: 'Book Arts',
  info: '',
  translate: translate,
  onHashLoad: function (w) {
    setTimeout(() => {
      const mesh = World.find(w)
      World.selected = mesh
      World.moveToBook(mesh, () => World.select(mesh))
    }, 100)
  },
  onOpen: function () { this.hideTitleCard() },
  onClose: function () {
    if (World.selected) World.deselect(World.selected)
  },
  onNameClick: function (w, i) {
    if (World.selected) World.deselect(World.selected)
    const mesh = World.find(w)
    World.selected = mesh
    World.moveToBook(mesh, () => World.select(mesh))
  },
  onCloseCard: function (w) {
    World.deselect(World.find(w))
  },
  onURLClick: function (url) {
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.click()
  },
  onInspectClick: function (w) {
    const filename = w[translate.pages]
    let url = filename.includes('https')
      ? filename : `../data/book-arts/pages/${filename}`
    if (!filename.includes('https') && !url.includes('.pdf')) url += '.pdf'
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.click()
  }
})

const header = window.createHeader(wtxt)

const music = new Music({
  name: 'bookarts',
  ele: header.querySelector('#sound-icon')
})

class Gallery extends CyberSpace {
  constructor (opts) {
    super(opts)
    this.renderer.domElement.classList.add('fadeIn')
    this.renderer.domElement.style.opacity = '0'
    this.renderer.domElement.style.display = 'none'

    this.settings.tween = true
    this.meshes = []
    this.selectable = this.meshes

    this.createFloor()
    this.lightScene()
    this.setCamera()

    window.fetch('../data/json/book-arts.json')
      .then(res => res.json())
      .then(json => {
        this.data = this.shuffle(json)
        wtxt.createList(json, translate)
        this.loadBook(0)
      })

    window.addEventListener('mousemove', (e) => {
      bg.draw(e.clientX, e.clientY)
      // cmaera motion
      const mid = window.innerHeight / 2
      const sec = window.innerHeight / 8
      if (this.chkOut) {
        this.cameraDelta = 0
      } else if (e.clientY < mid - sec) {
        const y = THREE.Math.mapLinear(e.clientY, 0, mid - sec, 1, 0)
        this.cameraDelta = y * 0.025
      } else if (e.clientY > mid + sec) {
        const y = THREE.Math.mapLinear(e.clientY, 0, mid + sec, 1, 0)
        this.cameraDelta = y * 0.025
      } else {
        this.cameraDelta = 0
      }
      // for raycaster
      this.hoverRaycaster(e)
    })
  }

  show () {
    this.renderer.domElement.style.display = 'block'
    setTimeout(() => {
      this.renderer.domElement.style.opacity = '1'
    }, 100)
  }

  // -----------------------------------------------------------------------

  shuffle (a) {
    // via: https://stackoverflow.com/a/6274381/1104148
    let j, x, i
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = a[i]
      a[i] = a[j]
      a[j] = x
    }
    return a
  }

  lightScene () {
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 20, 0)
    this.scene.add(hemiLight)

    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
    this.dirLight.position.set(-3, 3, 4)
    this.dirLight.castShadow = true
    this.scene.add(this.dirLight)

    // const helper = new THREE.DirectionalLightHelper(this.dirLight, 5)
    // this.scene.add(helper)
  }

  createFloor () {
    const geometry = new THREE.PlaneBufferGeometry(500, 20)
    const material = new THREE.MeshStandardMaterial({
      color: 0xffeeee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    })
    this.floor = new THREE.Mesh(geometry, material)
    this.floor.receiveShadow = true
    // this.floor.position.y = -30
    this.floor.rotation.x = -Math.PI / 2
    this.scene.add(this.floor)
  }

  setCamera () {
    this.cameraMaxY = 5.9
    this.cameraMinY = 0.781
    this.camera.position.set(0, this.cameraMaxY, 1.5)
    this.camera.rotation.x = -0.5
    this.cameraDelta = 0
  }

  loadBook (i) {
    const work = this.data[i]
    const filename = work[translate.cover].split('.')[0]
    const path = `../data/book-arts/covers/${filename}.png`
    const book = new Book()
    book.load(path, (b, t) => {
      b.name = 'w_' + i
      b.rotation.x = -Math.PI / 2
      b.rotation.z = -Math.PI / 2 + (Math.random() * 0.5 - 0.25)
      work.book = book
      b.userData = work
      this.meshes.push(b)
      this.scene.add(b)
      this.loaded = this.meshes.length / this.data.length
      // load.update(1)
      load.update(this.loaded)
      i++
      if (i < this.data.length) this.loadBook(i)
      else this.stackBooks()
    })
  }

  stackBooks () {
    // adjust floor beneath first book
    this.floor.position.y = -this.data[0].book.thickness / 2
    // stack all the other books
    let height = 0
    this.data.forEach((work, idx) => {
      const y = (idx === 0) ? 0 : this.data[idx - 1].book.thickness
      work.book.mesh.position.y = y + height
      height += y
    })
  }

  moveToBook (mesh, callback) {
    const idx = this.meshes.indexOf(mesh)
    const y = THREE.Math
      .mapLinear(idx, 0, this.meshes.length, this.cameraMinY, this.cameraMaxY)
    new TWEEN.Tween(this.camera.position)
      .to({ y: y }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => callback())
      .start()
  }

  bookReturn (mesh) {
    if (!mesh) return
    const book = mesh.userData.book
    if (this.chkOut) {
      // this.scene.remove(this.chkOut)
      // this.worksGroup.add(this.chkOut)
      const camR = this.camera.rotation
      const camP = this.camera.position
      this.chkOut.position.set(0, camP.y - 0.2, camP.z - 0.15)
      this.chkOut.rotation.set(camR.x, 0, 0)
      book.closeCover(500)
      new TWEEN.Tween(this.chkOut.position)
        .to({ x: this.chkOutP.x, y: this.chkOutP.y, z: this.chkOutP.z }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
      new TWEEN.Tween(this.chkOut.rotation)
        .to({ x: this.chkOutR.x, y: this.chkOutR.y, z: this.chkOutR.z }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
      this.chkOut = null
    }
  }

  bookClick (mesh, callback) {
    // let pos, rot
    let pos = mesh.position
    let rot = mesh.rotation
    this.chkOut = mesh
    this.chkOutP = new THREE.Vector3()
    this.chkOutP.set(pos.x, pos.y, pos.z)
    this.chkOutR = new THREE.Vector3()
    this.chkOutR.set(rot.x, rot.y, rot.z)
    pos = mesh.getWorldPosition()
    rot = mesh.getWorldQuaternion()
    // this.worksGroup.remove(mesh)
    // this.scene.add(mesh)
    // mesh.position.set(pos.x, pos.y, pos.z)
    // mesh.rotation.set(rot.x, rot.y, rot.z)

    new TWEEN.Tween(mesh.position)
      .to({ x: pos.x + 1, y: pos.y, z: pos.z }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        const camR = this.camera.rotation
        const camP = this.camera.position
        new TWEEN.Tween(mesh.position)
          .to({ x: 0, y: camP.y - 0.5, z: camP.z / 2 }, 1000)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
        new TWEEN.Tween(mesh.rotation)
          .to({ x: camR.x, y: 0, z: 0 }, 1000)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onComplete(() => {
            mesh.userData.book.openCover(2000)
            setTimeout(() => callback(), 1500)
            new TWEEN.Tween(mesh.position)
              .to({ x: 0, y: camP.y - 0.2, z: camP.z - 0.15 }, 2000)
              .easing(TWEEN.Easing.Quadratic.InOut)
              // .onComplete(callback)
              .start()
          }).start()
      }).start()
  }

  // -------------------------------------------------------------------

  find (w) {
    const i = this.data.indexOf(w)
    const meshes = this.meshes.filter(m => m.name === `w_${i}`)
    return meshes[0]
  }

  select (mesh) {
    this.selected = mesh
    wtxt.hideLabel()
    this.bookClick(mesh, () => {
      wtxt.displayTitleCard(mesh.userData)
    })
  }

  deselect (mesh) {
    this.selected = null
    this.bookReturn(mesh)
  }

  hover (mesh, e) {
    const w = mesh.userData
    if (!this.selected) {
      w.book.highlightCover(true)
      wtxt.showLabel(w[translate.title], w[translate.artist], e)
    }
  }

  hoverRaycaster (e) {
    const entered = load.style.display === 'none'
    if (!entered || wtxt.visible || wtxt.didactic) return
    this.data.forEach(w => w.book.highlightCover(false))
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const objs = this.selectable || this.scene.children
    const intersects = this.raycaster.intersectObjects(objs)
    if (intersects[0]) this.hover(intersects[0].object, e)
    else wtxt.hideLabel()
  }

  raycast (arr) { // click
    const entered = load.style.display === 'none'
    if (!entered || wtxt.visible || wtxt.didactic) return
    const w = arr[0].object
    this.select(w)
  }

  update () {
    if (!this.meshes) return
    // update camera
    if (this.selected) return
    const overMin = this.camera.position.y > this.cameraMinY
    const underMax = this.camera.position.y < this.cameraMaxY
    if (this.cameraDelta < 0 && overMin) {
      this.camera.position.y += this.cameraDelta
    } else if (this.cameraDelta > 0 && underMax) {
      this.camera.position.y += this.cameraDelta
    }
  }
}

const World = new Gallery()
