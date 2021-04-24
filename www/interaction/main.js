/* global THREE, TWEEN, CyberSpace, BGGradient, WallText , RetroText, AniSprite,
FloppyDisk, GradShaderMaterial */
const bg = new BGGradient('#e59bef', '#6494eb')

const dis = window.createDisclaimer()

const translate = {
  artist: 'Name as you would like it to appear in exhibition',
  title: 'Title of piece',
  info: 'Description (short paragraph about the piece) Not required',
  url: 'LINK YOUR Instagram',
  link: 'Insert Vimeo',
  filename: 'filename'
}

const load = window.createLoader(() => {
  load.style.display = 'none'
  dis.style.display = 'none'
  header.style.display = 'flex'
  World.show()
  music.play()
  if (wtxt.parseHash() instanceof Array) wtxt.checkURLHash()
})

const wtxt = new WallText({
  title: 'Interaction',
  info: '',
  onHashLoad: function (w) {
    this.displayTitleCard(w)
    setTimeout(() => {
      World.select(World.find(w))
      World.spinTo(w)
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
    World.spinTo(w)
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
    const a = document.createElement('a')
    a.setAttribute('href', w[translate.link])
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
    this.renderer.domElement.classList.add('fadeIn')
    this.renderer.domElement.style.opacity = '0'
    this.renderer.domElement.style.display = 'none'

    this.maps = []
    this.vids = new THREE.Group()
    this.vids.position.set(-2.09, 1.6, -0.2)
    this.selectable = this.vids.children
    this.scene.add(this.vids)
    this.stage = []
    this.spinDelta = 0
    this.spots = {
      'schand8@artic.edu': -0.15948148148148153,
      'fcarva@saic.edu': -0.7424098765432097,
      'ojobbe@artic.edu': -1.3040049382716061,
      'kjoshu@saic.edu': -1.8331407407407425,
      'jsmith47@artic.edu': -2.393466666666683,
      'hji2@saic.edu': -2.947333333333345,
      'imuell1@artic.edu': -3.5289481481481646,
      'goaldo@artic.edu': -4.051970370370379,
      'jhawki4@saic.edu': -4.641466666666673,
      'ebacku@artic.edu': -5.205022222222239,
      'varmij@saic.edu': -5.7584444444444545
    }

    this.shader = new GradShaderMaterial({
      xMult: 0.75, xAdd: 0.35, yMult: 0.25, yAdd: 0.3, zMult: -0.65, zAdd: 0.5, alpha: 0.2
    })

    this.loadStage(() => {
      window.fetch('../data/json/interaction.json')
        .then(res => res.json())
        .then(json => {
          this.data = json
          wtxt.createList(json, translate)
          this.loadMaps()
        })
    })

    window.addEventListener('mousemove', (e) => {
      bg.draw(e.clientX, e.clientY)
      // cmaera motion
      const mid = window.innerHeight / 2
      const sec = window.innerHeight / 8
      if (this.chkOut) {
        this.spinDelta = 0
      } else if (e.clientY < mid - sec) {
        const y = THREE.Math.mapLinear(e.clientY, 0, mid - sec, 1, 0)
        this.spinDelta = y * 0.01
      } else if (e.clientY > mid + sec) {
        const y = THREE.Math.mapLinear(e.clientY, 0, mid + sec, 1, 0)
        this.spinDelta = y * 0.01
      } else {
        this.spinDelta = 0
      }
    })
  }

  loadStage (callback) {
    const ignore = [
      // 'node_MeshObject1279389696-PolyPaper8'
      'node_MeshObject707310592-PolyPaper8'
    ]
    const loader = new THREE.GLTFLoader().setPath('../models/stage/')
    loader.load('model.gltf', (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          if (!ignore.includes(child.name)) {
            child.material = this.shader.material
            if (child.name === 'node_MeshObject1279389696-PolyPaper8') {
              child.position.y = 0.262
            }
            this.stage.push(child)
          }
        }
      })
      this.stage.forEach(mesh => this.scene.add(mesh))
      if (callback) callback()
    })
  }

  loadMaps () {
    const names = this.data.map(o => o.filename)
    for (let i = 0; i < names.length; i++) {
      const path = `../data/interaction/${names[i]}`
      const map = new THREE.TextureLoader().load(path, (tex) => {
        const ar = tex.image.width / tex.image.height
        this.loadWork(i, ar)
      })
      this.maps.push(map)
    }
  }

  loadWork (i, ar) {
    const work = this.data[i]
    const material = new THREE.SpriteMaterial({ map: this.maps[i] })
    this.mesh = new THREE.Sprite(material)
    this.mesh.userData = work
    this.mesh.name = 'w_' + i
    this.mesh.scale.x *= ar
    const x = Math.cos(i * 0.56) * 2
    const y = Math.sin(i * 0.56) * 2
    const z = 0
    this.mesh.position.set(x, y, z)
    this.vids.add(this.mesh)
    this.loaded = this.vids.children.length / this.data.length
    load.update(this.loaded)
  }

  show () {
    this.renderer.domElement.style.display = 'block'
    setTimeout(() => {
      this.renderer.domElement.style.opacity = '1'
    }, 100)
    new TWEEN.Tween(this.camera.position)
      .to({ x: 1.589, y: 0.684, z: -0.11 }, 8000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
    new TWEEN.Tween(this.camera.rotation)
      .to({ x: 1.598, y: 1.303, z: -1.599 }, 8000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }

  find (w) {
    const i = this.data.indexOf(w)
    const meshes = this.vids.children.filter(m => m.name === `w_${i}`)
    return meshes[0]
  }

  spinTo (w) {
    const z = this.spots[w['Email Address']]
    this.vids.rotation.z = z
  }

  select (mesh) {
    this.selected = mesh
    // const s = `'${mesh.userData['Email Address']}': ${this.vids.rotation.z},`
    // console.log(s)
  }

  deselect (mesh) {
    this.selected = null
  }

  raycast (arr) {
    if (this.controls) return
    const entered = load.style.display === 'none'
    if (!entered || wtxt.visible || wtxt.didactic) return
    const w = arr[0].object
    wtxt.displayTitleCard(w.userData)
    this.select(w)
  }

  update () {
    if (!this.vids || this.selected) return
    // const t = this.clock.getElapsedTime()
    // World.vids.rotation.z += 0.01
    if (this.spinDelta < 0) {
      this.vids.rotation.z += this.spinDelta
    } else if (this.spinDelta > 0) {
      this.vids.rotation.z += this.spinDelta
    }
  }
}

const World = new Gallery({
  // controls: true,
  tween: true,
  antialias: true
})

World.camera.position.x = 2.749
World.camera.position.y = 1.123
World.camera.position.z = -0.134
World.camera.rotation.x = 1.642
World.camera.rotation.y = 1.499
World.camera.rotation.z = -1.642

// World.camera.position.x = 1.589
// World.camera.position.y = 0.684
// World.camera.position.z = -0.11
// World.camera.rotation.x = 1.598
// World.camera.rotation.y = 1.303
// World.camera.rotation.z = -1.599

// World.camera.position.x = 3.751
// World.camera.position.y = 1.81
// World.camera.position.z = -0.069
// World.camera.rotation.x = -1.55
// World.camera.rotation.y = 1.122
// World.camera.rotation.z = 1.548

// World.camera.position.x = 2.413
// World.camera.position.y = 0.59
// World.camera.position.z = -0.215
// World.camera.rotation.x = 1.629
// World.camera.rotation.y = 1.472
// World.camera.rotation.z = -1.63


// World.camera.position.x = 1.069
// World.camera.position.y = 0.724
// World.camera.position.z = -0.208
// World.camera.rotation.x = 1.629
// World.camera.rotation.y = 1.472
// World.camera.rotation.z = -1.63

// World.camera.position.x = 2.872
// World.camera.position.y = 1.132
// World.camera.position.z = -0.233
// World.camera.rotation.x = -1.571
// World.camera.rotation.y = 1.315
// World.camera.rotation.z = 1.571
