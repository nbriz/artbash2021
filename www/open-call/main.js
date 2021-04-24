/* global THREE, TWEEN, CyberSpace, BGGradient, WallText,
PictureFrame, Music */
const bg = new BGGradient('#efd9db', '#4d479f')

const FRAME = new PictureFrame()

const dis = window.createDisclaimer()

const translate = {
  artist: 'Name as you would like it to appear in exhibition',
  title: 'Title of piece',
  info: 'Description (short paragraph about the piece) Not required',
  size: 'Dimensions of piece in INCHES (W X H X D)',
  url: 'LINK YOUR Instagram',
  filename: 'What is the FILE NAME of the work you submitted? IT MUST be LASTNAME_FIRSTNAME_OPENCALL - your work will not be accepted if this is not done correctly'
}

const load = window.createLoader(() => {
  load.style.display = 'none'
  dis.style.display = 'none'
  header.style.display = 'flex'
  World.startSpin()
  World.show()
  music.play()
  if (wtxt.parseHash() instanceof Array) {
    wtxt.checkURLHash()
  }
})

const wtxt = new WallText({
  title: 'Open Call',
  info: '',
  onHashLoad: function (w) {
    this.displayTitleCard(w)
    setTimeout(() => {
      World.select(World.find(w))
    }, 100)
  },
  onOpen: function () { this.hideTitleCard() },
  onClose: function () {
    if (World.selected) World.deselect(World.selected)
  },
  onNameClick: function (w, i) {
    this.displayTitleCard(w)
    if (World.selected) World.deselect(World.selected)
    World.select(World.find(w))
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
    const url = `../data/open-call/${w[translate.filename]}`
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

class Gallery extends CyberSpace {
  constructor (opts) {
    super(opts)
    this.meshes = []
    this.selectable = this.meshes
    this.data = []
    this.TOTOAL_GROUPS = 6
    this.settings.tween = true

    this.renderer.domElement.classList.add('fadeIn')
    this.renderer.domElement.style.opacity = '0'
    this.renderer.domElement.style.display = 'none'

    this.groups = {}
    for (let i = 0; i < this.TOTOAL_GROUPS; i++) {
      this.groups['g' + i] = new THREE.Group()
      this.scene.add(this.groups['g' + i])
    }

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 20, 0)
    this.scene.add(hemiLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
    dirLight.position.set(-3, 3, 4)
    this.scene.add(dirLight)

    window.fetch('../data/json/open-call.json')
      .then(res => res.json())
      .then(json => {
        this.data = json
        wtxt.createList(json, translate)
        this.loadFrame(0)
      })

    window.addEventListener('mousemove', (e) => {
      bg.draw(e.clientX, e.clientY)
      // camera motion
      const w2 = window.innerWidth / 2
      const h2 = window.innerHeight / 2
      const x = e.clientX - w2
      const y = e.clientY - h2
      this.camera.position.x = THREE.Math.mapLinear(x, -w2, w2, 0.5, -0.5)
      this.camera.position.y = THREE.Math.mapLinear(y, -h2, h2, -0.5, 0.5)
      this.camera.rotation.y = THREE.Math.mapLinear(x, -w2, w2, 0.2, -0.2)
      this.camera.rotation.x = THREE.Math.mapLinear(y, -h2, h2, 0.2, -0.2)
      // for raycaster
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    })
  }

  show () {
    this.renderer.domElement.style.display = 'block'
    setTimeout(() => {
      this.renderer.domElement.style.opacity = '1'
    }, 100)
  }

  // -------------------------------

  loadFrame (i) {
    const work = this.data[i]
    const path = `../data/open-call-resized/${work[translate.filename]}`
    // const f = FRAME.load(path, (mesh) => this.setupFrame(mesh, i))
    FRAME.load(path, (frame) => {
      const n = Math.random() * 6 - 3 // little nudge
      const x = Math.sin(i * 0.1) * (8 + n)
      const z = Math.cos(i * 0.1) * (8 + n)
      const y = Math.random() * 8 - 4
      frame.rotation.y = i * 0.1 + Math.PI
      frame.position.set(x, y, z)
      frame.name = 'w_' + i
      frame.userData = work
      frame._OG_position = { x, y, z }
      this.meshes.push(frame)

      const ran = Math.floor(Math.random() * this.TOTOAL_GROUPS)
      frame.userData.group = 'g' + ran
      this.groups['g' + ran].add(frame)
      this.loaded = this.meshes.length / this.data.length
      load.update(this.loaded)
      i++; if (i < this.data.length) this.loadFrame(i)
    })
  }

  startSpin () {
    for (let i = 0; i < this.TOTOAL_GROUPS; i++) {
      const time = (1000 * 60) + (Math.random() * 10000)
      new TWEEN.Tween(this.groups['g' + i].rotation)
        .to({ y: Math.PI * 2 }, time)
        .onComplete(() => {
          this.groups['g' + i].rotation.y = 0
          this.spinOpenCall(i, time)
        }).start()
    }
  }

  spinOpenCall (i, time) {
    new TWEEN.Tween(this.groups['g' + i].rotation)
      .to({ y: Math.PI * 2 }, time)
      .onComplete(() => {
        this.groups['g' + i].rotation.y = 0
        this.spinOpenCall(i, time)
      }).start()
  }

  returnOpenCallWork () {
    if (this.fOC) {
      this.scene.remove(this.fOC)
      this.groups[this.fOC.userData.group].add(this.fOC)
      this.fOC.rotation.set(0, 0, 0)
      this.fOC.position.set(0, 0, -1)
      new TWEEN.Tween(this.fOC.position)
        .to({ x: this.fOCP.x, y: this.fOCP.y, z: this.fOCP.z }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
      new TWEEN.Tween(this.fOC.rotation)
        .to({ x: this.fOCR.x, y: this.fOCR.y, z: this.fOCR.z }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
      this.fOC = null
    }
  }

  focusOpenCallWork (frame) {
    let pos, rot
    this.returnOpenCallWork()
    pos = frame.position
    rot = frame.rotation
    this.fOC = frame
    this.fOCP = new THREE.Vector3()
    this.fOCP.set(pos.x, pos.y, pos.z)
    this.fOCR = new THREE.Vector3()
    this.fOCR.set(rot.x, rot.y, rot.z)
    pos = frame.getWorldPosition()
    rot = frame.getWorldQuaternion()
    this.groups[frame.userData.group].remove(frame)
    this.scene.add(frame)
    frame.position.set(pos.x, pos.y, pos.z)
    frame.rotation.set(rot.x, rot.y, rot.z)
    new TWEEN.Tween(frame.position)
      .to({ x: 0, y: 0, z: -1 }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
    new TWEEN.Tween(frame.rotation)
      .to({ x: 0, y: 0, z: 0 }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
  }

  // -------------------------------

  find (w) {
    const i = this.data.indexOf(w)
    const meshes = this.meshes.filter(m => m.name === `w_${i}`)
    return meshes[0]
  }

  select (mesh) {
    this.selected = mesh
    this.focusOpenCallWork(mesh)
  }

  deselect (mesh) {
    this.selected = null
    this.returnOpenCallWork()
  }

  raycast (arr) {
    const entered = load.style.display === 'none'
    if (!entered || wtxt.visible || wtxt.didactic) return
    const w = arr[0].object
    wtxt.displayTitleCard(w.userData)
    this.select(w)
  }

  update () {
    // if (!this.groups) return
  }
}

const World = new Gallery()
