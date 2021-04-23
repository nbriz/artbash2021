/* global THREE, CyberSpace, BGGradient, WallText,
TWEEN, NewMediaLaptop, GradShaderMaterial, dat */
const bg = new BGGradient('#e07f88', '#3e6286')

const dis = window.createDisclaimer()

const translate = {
  artist: 'Name as you would like it to appear in exhibition',
  title: 'Title of piece',
  info: 'Description (short paragraph about the piece) Not required',
  url: 'LINK YOUR Instagram',
  web: 'web',
  file: 'If you submitted a file - What is the FILE NAME of the work you submitted? IT MUST be LASTNAME_FIRSTNAME_INTERNETART - your work will not be accepted if this is not done correctly',
  thumb: 'What is the title of the screenshot you submitted? It should read as LASTNAME_FIRSTNAME_NMscreenshot'
}

const load = window.createLoader(() => {
  load.style.display = 'none'
  dis.style.display = 'none'
  header.style.display = 'flex'
  World.show()
  if (wtxt.parseHash() instanceof Array) {
    wtxt.checkURLHash()
  }
})

const wtxt = new WallText({
  title: 'Black Box',
  info: '',
  onHashLoad: function (w) {
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
    let url = ''
    if (w[translate.web] && w[translate.web] !== '') {
      url = w[translate.web]
    } else {
      url = `../data/new-media/works/${w[translate.file]}`
    }
    // console.log(w[translate.web], w[translate.file]);
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.click()
  }
})

const header = window.createHeader(wtxt)

class Gallery extends CyberSpace {
  constructor (opts) {
    super(opts)
    this.laptops = []
    this.shader = new GradShaderMaterial({ zAdd: 0.45, alpha: 0.45 })
    this.mouseDX = 0
    this.spots = {
      'cgoldb3@artic.edu': 0.1630124999999999,
      'cchilc@artic.edu': 0.5289375000000008,
      'sokoye@artic.edu': 0.8992812500000029,
      'rescam@artic.edu': 1.2642437500000026,
      'vkapka@artic.edu': 1.6409312500000024,
      'kdoan@artic.edu': 2.0169041666666656,
      'mcharl@artic.edu': 2.372110416666664,
      'mgonza19@artic.edu': 2.745720833333336,
      'azunig3@artic.edu': 3.124056250000006,
      'fcarva@artic.edu': 3.48554791666667,
      'gchen8@artic.edu': 3.853849999999999,
      'ykang22@artic.edu': 4.224587499999986,
      'ojobbe@artic.edu': 4.591285416666658,
      'nozorm@artic.edu': 4.962956249999976,
      'cmurph5@artic.edu': 5.3376604166666315,
      'jma13@artic.edu': 5.702637499999952,
      'mbrand5@artic.edu': 6.0779395833333
    }
    this.group = new THREE.Group()
    this.group.rotation.y = 0.1630124999999999
    this.scene.add(this.group)

    this.meshes = []
    this.selectable = this.meshes
    this.data = []
    this.settings.tween = true

    if (opts.controls) {
      this.gui = new dat.GUI()
      for (const key in this.shader.uniforms) {
        this.gui.add(this.shader.uniforms[key], 'value')
          .name(key)
          .min(-1).max(1).step(0.05)
      }
    }

    this.renderer.domElement.classList.add('fadeIn')
    this.renderer.domElement.style.opacity = '0'
    this.renderer.domElement.style.display = 'none'
    this.camera.position.set(0, 1.29, 0)
    this.camera.rotation.x = -0.45
    this.camera.fov = 30
    this.camera.updateProjectionMatrix()
    // this.camera.rotation.y = 1.309
    // this.camera.rotation.z = 0.93

    this.lightScene()
    // this.createFloor()

    window.fetch('../data/json/new-media.json')
      .then(res => res.json())
      .then(json => {
        this.data = json
        this.createOpts()
        wtxt.createList(json, translate)
        this.loadMesh(0)
      })

    window.addEventListener('mousemove', (e) => {
      bg.draw(e.clientX, e.clientY)
      // move Carousel
      const mid = window.innerWidth / 2
      const sec = window.innerWidth / 6
      if (e.clientX > mid + sec) {
        const x = THREE.Math.mapLinear(e.clientX, mid + sec, window.innerWidth, 0, 1)
        this.mouseDX = x * 0.007
      } else if (e.clientX < mid - sec) {
        const x = THREE.Math.mapLinear(e.clientX, 0, mid - sec, -1, 0)
        this.mouseDX = x * 0.007
      } else {
        this.mouseDX = 0
      }
    })
  }

  show () {
    this.renderer.domElement.style.display = 'block'
    setTimeout(() => {
      this.renderer.domElement.style.opacity = '1'
    }, 100)
  }

  // -------------------------------

  lightScene () {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 20, 0)
    this.scene.add(hemiLight)

    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
    this.dirLight.position.set(-3, 3, 4)
    this.dirLight.castShadow = true
    this.scene.add(this.dirLight)
  }

  createFloor () {
    const geometry = new THREE.CircleBufferGeometry(50, 50)
    const material = new THREE.MeshStandardMaterial({
      color: 0x172451,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    })
    this.floor = new THREE.Mesh(geometry, material)
    this.floor.receiveShadow = true
    this.floor.rotation.x = -Math.PI / 2
    this.floor.position.y = -0.3
    this.scene.add(this.floor)
  }

  createOpts () {
    this.opts = []
    this.data.forEach((w, i) => {
      const l = 0.37
      const x = Math.sin(i * l) * 2.75
      const z = Math.cos(i * l) * 2.75
      this.opts.push({
        pos: { x, y: 0, z },
        rot: Math.atan2(x, z) + Math.PI
      })
    })
  }

  loadMesh (i) {
    const work = this.data[i]
    const path = `../data/new-media/thumbnails/${work[translate.thumb]}`
    const ready = (mesh) => {
      mesh.userData = this.data[i]
      const o = this.opts[i]
      mesh.position.set(o.pos.x, o.pos.y, o.pos.z)
      mesh.rotation.y = o.rot
      this.meshes.push(mesh)
      // this.scene.add(mesh)
      this.group.add(mesh)
      this.loaded = this.meshes.length / this.data.length
      load.update(this.loaded)
      i++; if (i < this.data.length) this.loadMesh(i)
    }
    const shader = this.shader
    const laptop = new NewMediaLaptop({ path, shader }, ready)
    this.laptops.push(laptop)
  }

  spinTo (w) {
    const y = this.spots[w['Email Address']]
    this.group.rotation.y = y
    // const i = this.data.indexOf(w)
    // const time = i * 500
    // this.group.rotation.y = 0.1630124999999999
    // new TWEEN.Tween(this.group.rotation)
    //   .to({ y: y }, time)
    //   .easing(TWEEN.Easing.Quadratic.InOut)
    //   .start()
  }

  // -------------------------------

  find (w) {
    const e = 'Email Address'
    const meshes = this.meshes.filter(m => m.userData[e] === w[e])
    return meshes[0]
  }

  select (mesh) {
    this.selected = mesh
    wtxt.displayTitleCard(mesh.userData)
  }

  deselect (mesh) {
    this.selected = null
  }

  raycast (arr) {
    const entered = load.style.display === 'none'
    if (!entered || wtxt.visible || wtxt.didactic) return
    const w = arr[0].object
    wtxt.displayTitleCard(w.userData)
    this.select(w)
  }

  update () {
    if (!this.group || wtxt.visible || wtxt.didactic) return
    this.group.rotation.y += this.mouseDX
  }
}

// const World = new Gallery({ controls: true })
const World = new Gallery({ controls: false })
