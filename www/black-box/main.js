/* global THREE, CyberSpace, BGGradient, WallText,
BlackBoxMonitor */
const bg = new BGGradient('#2157b7', '#0f2860')

const dis = window.createDisclaimer()

const translate = {
  artist: 'Name as you would like it to appear in exhibition',
  title: 'Title of piece',
  info: 'Description (short paragraph about the piece) Not required',
  type: 'Type of work you\'re submitting:',
  url: 'LINK YOUR Instagram',
  link: 'Insert Vimeo',
  filename: 'What is the FILE NAME of the work you submitted? IT MUST be LASTNAME_FIRSTNAME_Blackbox_image - your work will not be accepted if this is not done correctly'
}

const load = window.createLoader(() => {
  load.style.display = 'none'
  dis.style.display = 'none'
  header.style.display = 'flex'
  World.show()
  music.play()
  document.querySelectorAll('.arrow').forEach(ele => {
    ele.style.display = 'block'
  })
  if (wtxt.parseHash() instanceof Array) {
    wtxt.checkURLHash()
  }
})

const wtxt = new WallText({
  title: 'Black Box',
  info: 'The works in Black Box explore the potential of the screen, light, projection, and sound. Spectators are invited to take part in an immersive experience of linear time-based Video work.',
  onHashLoad: function (w) {
    setTimeout(() => {
      World.select(World.find(w))
    }, 100)
  },
  onOpen: function () { this.hideTitleCard() },
  onClose: function () {
    if (World.selected) World.deselect(World.selected)
  },
  onNameClick: function (w, i) {
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
    const a = document.createElement('a')
    a.setAttribute('href', w[translate.link])
    a.setAttribute('target', '_blank')
    a.click()
  }
})

const header = window.createHeader(wtxt)

const music = new Music({
  name: 'blackbox',
  ele: header.querySelector('#sound-icon')
})

class Gallery extends CyberSpace {
  constructor (opts) {
    super(opts)
    this.monitors = []
    this.speakers = []
    this.meshes = []
    this.selectable = this.meshes
    this.data = []
    this.settings.tween = true

    this.opts = [{
      pos: { x: 0, y: 0, z: 1 },
      rot: 0,
      idx: 0
    }, {
      pos: { x: -0.722, y: 1.099, z: -0.245 },
      rot: -2,
      idx: 1
    }, {
      pos: { x: 0.761, y: 1.1, z: -0.416 },
      rot: -4.2,
      idx: 2
    }, {
      pos: { x: -0.181, y: 1.65, z: -0.678 },
      rot: -2.6,
      idx: 3
    }, {
      pos: { x: -0.693, y: 0, z: -0.483 },
      rot: -2.088,
      idx: 4
    }, {
      pos: { x: -0.795, y: 0.55, z: 0.536 },
      rot: -1,
      idx: 5
    }, {
      pos: { x: -0.115, y: 1.1, z: 0.789 },
      rot: 0,
      idx: 6
    }, {
      pos: { x: 0.593, y: 1.65, z: 0.234 },
      rot: 1,
      idx: 7
    }, {
      pos: { x: 0.989, y: 0, z: -0.386 },
      rot: 1.95,
      idx: 8
    }, {
      pos: { x: 0.272, y: 0.55, z: -0.911 },
      rot: 2.8,
      idx: 9
    }, {
      pos: { x: -0.544, y: 1.1, z: -0.646 },
      rot: -2.4,
      idx: 10
    }, {
      pos: { x: -0.7, y: 1.65, z: -0.224 },
      rot: -1.4,
      idx: 11
    }, {
      pos: { x: -0.5365729180004349, y: 0, z: 0.8438539587324921 },
      rot: -0.894,
      idx: 12
    }, {
      pos: { x: 0.42, y: 0.55, z: 0.858 },
      rot: 0.6,
      idx: 13
    }, {
      pos: { x: 0.884, y: 1.1, z: 0.137 },
      rot: -4.8,
      idx: 14
    }, {
      pos: { x: 0.546, y: 1.65, z: -0.406 },
      rot: -3.8,
      idx: 15
    }, {
      pos: { x: -0.288, y: 0, z: -0.958 },
      rot: 3.574,
      idx: 16
    }, {
      pos: { x: -0.832, y: 0.55, z: -0.116 },
      rot: -1.8,
      idx: 17
    }, {
      pos: { x: -0.619, y: 1.1, z: 0.66 },
      rot: -1,
      idx: 18
    }, {
      pos: { x: 0.15, y: 2.214, z: 0.214 },
      rot: 0,
      idx: 19
    }, {
      pos: { x: 1.037, y: 0, z: 0.408 },
      rot: 1.065,
      idx: 20
    }, {
      pos: { x: 0.8366556385360561, y: 0.55, z: -0.5477292602242684 },
      rot: 2.22,
      idx: 21
    }, {
      pos: { x: -0.009, y: 1.1, z: -0.801 },
      rot: -3.2,
      idx: 22
    }, {
      pos: { x: -0.236, y: 2.188, z: -0.417 },
      rot: -1.9,
      idx: 23
    }, {
      pos: { x: -0.888, y: 0, z: 0.282 },
      rot: -1.459,
      idx: 24
    }, {
      pos: { x: -0.13235175009777303, y: 0.55, z: 0.9912028118634736 },
      rot: 0,
      idx: 25
    }, {
      pos: { x: 0.386, y: 1.1, z: 0.647 },
      rot: 1,
      idx: 26
    }, {
      pos: { x: 1.039, y: 0.556, z: 0.269 },
      rot: 1.4,
      idx: 27
    }, {
      pos: { x: 0.434, y: 0, z: -0.963 },
      rot: 2.62,
      idx: 28
    }, {
      pos: { x: -0.615, y: 0.55, z: -0.622 },
      rot: 3.8,
      idx: 29
    }, {
      pos: { x: -0.792, y: 1.1, z: 0.217 },
      rot: -1.699,
      idx: 30
    }, {
      pos: { x: -0.404, y: 1.65, z: 0.458 },
      rot: 0,
      idx: 31
    }, {
      pos: { x: 0.5514266812416906, y: 0, z: 0.8342233605065102 },
      rot: 0.6,
      idx: 32
    }]
    this.test = ''

    this.renderer.domElement.classList.add('fadeIn')
    this.renderer.domElement.style.opacity = '0'
    this.renderer.domElement.style.display = 'none'

    this.camera.position.set(3.458, 1.8, 0.539)
    this.camera.rotation.x = -0.948
    this.camera.rotation.y = 1.309
    this.camera.rotation.z = 0.93
    this.camSpinIdx = 1.4160094637223972
    this.mouseDX = 0

    this.lightScene()
    this.createFloor()

    window.fetch('../data/json/black-box.json')
      .then(res => res.json())
      .then(json => {
        this.data = json
        wtxt.createList(json, translate)
        this.loadMesh(0)
      })

    window.addEventListener('mousemove', (e) => {
      bg.draw(e.clientX, e.clientY)
      // move camera
      const mid = window.innerWidth / 2
      const sec = window.innerWidth / 4
      if (e.clientX > mid + sec) {
        const x = THREE.Math.mapLinear(e.clientX, mid + sec, window.innerWidth, 0, 1)
        this.mouseDX = x * 0.025
      } else if (e.clientX < mid - sec) {
        const x = THREE.Math.mapLinear(e.clientX, 0, mid - sec, -1, 0)
        this.mouseDX = x * 0.025
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

    // const helper = new THREE.DirectionalLightHelper(this.dirLight, 5)
    // this.scene.add(helper)
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
    // this.floor.position.y = -30
    this.floor.rotation.x = -Math.PI / 2
    this.floor.position.y = -0.3
    this.scene.add(this.floor)
  }

  createSpeaker (data, callback) {
    const geo = new THREE.BoxGeometry(0.44, 0.63, 0.44)
    const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    const loader = new THREE.GLTFLoader().setPath('../models/')
    loader.load('hifiStereo.gltf', (gltf) => {
      const speaker = gltf.scene
      speaker.scale.set(0.08, 0.08, 0.08)
      speaker.rotation.z = Math.PI
      const m1 = new THREE.MeshStandardMaterial({ color: 0x152d73 })
      const m2 = new THREE.MeshStandardMaterial({ color: 0xdbfffa })
      speaker.traverse((child) => {
        if (child.name === 'buffer-0-mesh-0.001_0') {
          child.material = m2
        } else if (child.isMesh) {
          child.material = m1
        }
      })
      const clone = speaker.clone()
      const mesh = new THREE.Mesh(geo, mat)
      mesh.userData = data
      mesh.add(clone)
      mesh.name = 'speaker'
      clone.position.set(0, 0.31399, 0)
      if (callback) callback(mesh)
    })
  }

  loadMesh (i) {
    const work = this.data[i]
    const path = `../data/black-box/${work[translate.filename]}`
    const ready = (mesh) => {
      const o = this.opts[i]
      mesh.name = i
      mesh.userData = this.data[i]
      mesh.position.set(o.pos.x, o.pos.y, o.pos.z)
      mesh.rotation.y = o.rot
      // mesh.rotateY(o.rot)
      this.meshes.push(mesh)
      this.scene.add(mesh)
      if (mesh.name === 'speaker') this.speakers.push(mesh)
      this.loaded = this.meshes.length / this.data.length
      load.update(this.loaded)
      i++; if (i < this.data.length) this.loadMesh(i)
    }

    if (work[translate.type].includes('video')) {
      const monitor = new BlackBoxMonitor(path, ready)
      this.monitors.push(monitor)
    } else this.createSpeaker(work, ready)
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
    if (!entered || wtxt.visible) return
    const w = arr[0].object
    wtxt.displayTitleCard(w.userData)
    this.select(w)
  }

  update () {
    // if (!this.groups) return
    if (!this.muteSpin) this.camSpinIdx += 1 * this.mouseDX
    this.camera.position.x = Math.sin(this.camSpinIdx) * 3.5
    this.camera.position.z = Math.cos(this.camSpinIdx) * 3.5
    this.camera.lookAt(new THREE.Vector3(0, 0.75, 0))
  }
}

const World = new Gallery()
