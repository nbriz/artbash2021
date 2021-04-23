/* global THREE, CyberSpace, GradShaderMaterial, TWEEN,
BGGradient, Ocean, RetroText, AniSprite, Maths, WallText */
const bg = new BGGradient('#37808f', '#374872')
// const perlin = new THREE.ImprovedNoise()
const dis = window.createDisclaimer()

document.querySelector('#main-menu').style.display = 'none'

const load = window.createLoader(() => {
  load.style.display = 'none'
  dis.style.display = 'none'
  header.style.display = 'flex'
  document.querySelector('#main-menu').style.display = 'flex'
  World.show()
  if (wtxt.parseHash() instanceof Array) wtxt.checkURLHash()
})

const wtxt = new WallText({
  title: 'Art Bash 2021',
  info: 'artbash info goes here'
})

const header = window.createHeader(wtxt, true)

class Gallery extends CyberSpace {
  constructor (opts) {
    super(opts)
    this.renderer.domElement.classList.add('fadeIn')
    this.renderer.domElement.style.opacity = '0'
    this.renderer.domElement.style.display = 'none'

    this.cubes = []
    this.lights = []
    this.meshes = []
    this.shader = new GradShaderMaterial({
      // xMult: 0.75, xAdd: 0.35, yMult: 0.25, yAdd: 0.3, zMult: -0.65, zAdd: 0.5, alpha: -0.2
      xMult: -0.05,
      xAdd: 0.05,
      yMult: 0.5,
      yAdd: 0.45,
      zMult: -0.6,
      zAdd: -0.2,
      alpha: 0.01
    })
    // const s = this.shader
    // this.gui = new dat.GUI()
    // for (const key in s.uniforms) {
    //   this.gui.add(s.uniforms[key], 'value')
    //     .name(key).min(-1).max(1).step(0.05)
    // }
    this.loader = new THREE.TTFLoader()
    // load.update(1)

    this.loadScreen()
    this.loadTexts()
    this.loadModels()
    this.loadSprites()

    document.querySelectorAll('#main-menu > span').forEach(ele => {
      const name = ele.dataset.name
      const url = ele.dataset.url
      ele.addEventListener('mouseover', () => this.insertDisk(name))
      ele.addEventListener('mouseout', () => this.ejectDisk())
      ele.addEventListener('click', () => this.menuClick(url))
    })

    window.addEventListener('mousemove', (e) => {
      bg.draw(e.clientX, e.clientY)
    })
  }

  loadGLTF (filename, callback) {
    const loader = new THREE.GLTFLoader().setPath('models/')
    loader.load(filename, (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.isMesh) this.meshes.push(child)
        else if (child.type.includes('Light')) this.lights.push(child)
      })
      if (callback) callback()
    })
  }

  loadModels () {
    this.loadGLTF('keyboard.gltf', () => {
      const obj = this.meshes[0]
      obj.material = this.shader.material
      obj.position.z = 2.806
      obj.scale.set(0.14, 0.275, 0.14)
      this.scene.add(obj)
      load.update(0.25)
      this.loadGLTF('computer-no-screen.gltf', () => {
        const obj = this.meshes[1]
        obj.position.set(-0.005, 5.443, -1.223)
        obj.scale.set(37.13, 26.369, 30.598)
        obj.material = this.shader.material
        this.scene.add(obj)
        load.update(0.5)
        this.loadGLTF('disk.gltf', () => {
          const obj = this.meshes[2]
          obj.position.set(1.732, 3.777, 6.018)
          obj.material = this.shader.material
          this.scene.add(obj)
          load.update(0.75)
          this.loadGLTF('cat.gltf', () => {
            const obj = this.meshes[3]
            obj.rotation.x = -1.555
            obj.rotation.y = 0.007
            obj.rotation.z = -3.08
            obj.position.set(0, 0, 11.298)
            obj.scale.set(0.018, 0.018, 0.018)
            obj.material = this.shader.material
            this.scene.add(obj)
            load.update(1)
          })
        })
      })
    })
  }

  loadSprites () {
    const num = 100
    this.sprites = []
    for (let i = 0; i < num; i++) {
      const ran = Math.random()
      const as = new AniSprite({
        root: '../images/sprites',
        name: ran > 0.5 ? 'star' : 'bubble',
        type: 'png',
        length: ran > 0.5 ? 6 : 5,
        fps: ran > 0.5 ? 250 : 500,
        delay: Math.random() * 4000 + 1000
      })
      this.sprites.push(as)
      const y = Math.random() * 40
      let x = Math.random() - 0.5
      if (y < 15) {
        x = (x < 0)
          ? Maths.map(x, -0.5, 0.5, -5, -15)
          : Maths.map(x, -0.5, 0.5, 5, 15)
      } else {
        x = Maths.map(x, -0.5, 0.5, -15, 15)
      }
      let z = Math.random() - 0.5
      if (y < 15) {
        z = (z < 0)
          ? Maths.map(z, -0.5, 0.5, -5, -15)
          : Maths.map(z, -0.5, 0.5, 5, 15)
      } else {
        z = Maths.map(z, -0.5, 0.5, -15, 15)
      }
      as.mesh.position.set(x, y, z)
      this.scene.add(as.mesh)
    }
  }

  loadScreen () {
    this.ocean = new Ocean({
      width: 6,
      depth: 6,
      amplitude: 1,
      opacity: 1,
      speed: 1000
    })
    this.ocean.mesh.position.set(0, 7.835, 1.676)
    this.ocean.mesh.scale.set(1.169, 0.775, 1.135)
    this.ocean.mesh.rotation.x = Math.PI
    this.scene.add(this.ocean.mesh)
  }

  loadTexts () {
    this.texts = {}
    const shaders = [
      { xMult: 0.25, xAdd: 0.1, yMult: -0.6, yAdd: 0.25, zMult: 0.2, zAdd: 0.6, alpha: 0.35 },
      { xMult: -1, xAdd: 0.1, yMult: 0.25, yAdd: 0.35, zMult: 0, zAdd: 0.45, alpha: 1 }
    ]
    const words = {
      artbash: [
        { text: 'A', pos: { x: -1.058, y: 0, z: 0 } },
        { text: 'R', pos: { x: -0.287, y: -0.243, z: 0 } },
        { text: 'T', pos: { x: 0.356, y: 0, z: 0 } },
        { text: 'B', pos: { x: -1.058 - 0.5, y: -1.07, z: 0 } },
        { text: 'A', pos: { x: -0.287 - 0.5, y: -1.393, z: 0 } },
        { text: 'S', pos: { x: 0.356 - 0.5, y: -1.196, z: 0 } },
        { text: 'H', pos: { x: 1.035 - 0.5, y: -1.374, z: 0 } }
      ],
      opencall: [
        { text: 'O', pos: { x: -1.155, y: 0.063, z: 0 } },
        { text: 'P', pos: { x: -0.314, y: -0.187, z: 0 } },
        { text: 'E', pos: { x: 0.447, y: 0, z: 0 } },
        { text: 'N', pos: { x: 1.288, y: -0.294, z: 0 } },
        { text: 'C', pos: { x: -0.958, y: -1.393, z: 0 } },
        { text: 'A', pos: { x: -0.144, y: -1.196, z: 0 } },
        { text: 'L', pos: { x: 0.756, y: -1.374, z: 0 } },
        { text: 'L', pos: { x: 1.516, y: -1.374, z: 0 } }
      ],
      interaction: [
        { text: 'I', pos: { x: -1.155, y: 0.059, z: 0 } },
        { text: 'N', pos: { x: -0.578, y: -0.179, z: 0 } },
        { text: 'T', pos: { x: 0.114, y: 0.069, z: 0 } },
        { text: 'E', pos: { x: 0.713, y: -0.294, z: 0 } },
        { text: 'R', pos: { x: 1.481, y: 0.006, z: 0 } },
        { text: 'A', pos: { x: -1.761, y: -0.933, z: 0 } },
        { text: 'C', pos: { x: -0.998, y: -1.174, z: 0 } },
        { text: 'T', pos: { x: -0.255, y: -1.374, z: 0 } },
        { text: 'I', pos: { x: 0.486, y: -1.214, z: 0 } },
        { text: 'O', pos: { x: 0.998, y: -1.374, z: 0 } },
        { text: 'N', pos: { x: 1.744, y: -1.069, z: 0 } }
      ],
      newmedia: [
        { text: 'N', pos: { x: -1.007, y: 0.009, z: 0 } },
        { text: 'E', pos: { x: -0.145, y: -0.133, z: 0 } },
        { text: 'W', pos: { x: 0.741, y: 0.064, z: 0 } },
        { text: 'M', pos: { x: -1.914, y: -1.255, z: 0 } },
        { text: 'E', pos: { x: -0.91, y: -1.451, z: 0 } },
        { text: 'D', pos: { x: -0.144, y: -1.102, z: 0 } },
        { text: 'I', pos: { x: 0.593, y: -1.374, z: 0 } },
        { text: 'A', pos: { x: 1.153, y: -1.281, z: 0 } }
      ],
      sitesight: [
        { text: 'S', pos: { x: -1.155, y: 0.059, z: 0 } },
        { text: 'I', pos: { x: -0.368, y: -0.179, z: 0 } },
        { text: 'T', pos: { x: 0.086, y: 0.109, z: 0 } },
        { text: 'E', pos: { x: 0.713, y: -0.294, z: 0 } },
        { text: 'S', pos: { x: -1.761, y: -0.933, z: 0 } },
        { text: 'I', pos: { x: -0.998, y: -1.174, z: 0 } },
        { text: 'G', pos: { x: -0.429, y: -1.374, z: 0 } },
        { text: 'H', pos: { x: 0.276, y: -1.214, z: 0 } },
        { text: 'T', pos: { x: 0.998, y: -1.374, z: 0 } }
      ],
      bookarts: [
        { text: 'B', pos: { x: -1.155, y: 0.059, z: 0 } },
        { text: 'O', pos: { x: -0.368, y: -0.179, z: 0 } },
        { text: 'O', pos: { x: 0.37, y: -0.184, z: 0 } },
        { text: 'K', pos: { x: 1.074, y: 0.002, z: 0 } },
        { text: 'A', pos: { x: -1.281, y: -1.119, z: 0 } },
        { text: 'R', pos: { x: -0.429, y: -1.374, z: 0 } },
        { text: 'T', pos: { x: 0.276, y: -1.214, z: 0 } },
        { text: 'S', pos: { x: 0.998, y: -1.374, z: 0 } }
      ],
      blackbox: [
        { text: 'B', pos: { x: -1.029, y: 0.059, z: 0 } },
        { text: 'L', pos: { x: -0.288, y: -0.179, z: 0 } },
        { text: 'A', pos: { x: 0.058, y: 0.134, z: 0 } },
        { text: 'C', pos: { x: 0.802, y: -0.186, z: 0 } },
        { text: 'K', pos: { x: 1.53, y: 0.051, z: 0 } },
        { text: 'B', pos: { x: -0.69, y: -1.318, z: 0 } },
        { text: 'O', pos: { x: 0.106, y: -1.111, z: 0 } },
        { text: 'X', pos: { x: 0.92, y: -1.366, z: 0 } }
      ]
    }

    for (const key in words) {
      this.texts[key] = new RetroText({
        shaders, chars: words[key]
      }, () => {
        // this.text.chars.forEach(char => this.scene.add(char))
        this.texts[key].group.position.set(-0.59, 7.99, -1) // 1.7
        this.texts[key].group.scale.z = 2
        this.scene.add(this.texts[key].group)
      })
    }

    this.diskText = new RetroText({
      shaders,
      chars: [
        { text: 'A', pos: { x: -1.058, y: 0, z: 0 } },
        { text: 'R', pos: { x: -0.287, y: -0.243, z: 0 } },
        { text: 'T', pos: { x: 0.356, y: 0, z: 0 } },
        { text: 'B', pos: { x: -1.058 - 0.5, y: -1.07, z: 0 } },
        { text: 'A', pos: { x: -0.287 - 0.5, y: -1.393, z: 0 } },
        { text: 'S', pos: { x: 0.356 - 0.5, y: -1.196, z: 0 } },
        { text: 'H', pos: { x: 1.035 - 0.5, y: -1.374, z: 0 } }
      ]
    }, () => {
      this.scene.add(this.diskText.group)
    })
  }

  insertDisk (room) {
    TWEEN.removeAll()
    for (const t in this.texts) {
      this.texts[t].group.position.z = -1
    }
    this.inserted = room
    const time = 1000
    this.meshes[2].rotation.x = Math.PI
    this.meshes[2].rotation.y = -1.5265397955483684
    new TWEEN.Tween(this.meshes[2].position)
      .to({ z: 0.93 }, time)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
    setTimeout(() => {
      this.ocean.still = true
      const txt = this.texts[this.inserted].group
      new TWEEN.Tween(txt.position)
        .to({ z: 1.7 }, time)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
          setTimeout(() => {
            this.tweenComplete = true
            this.goToGallery()
          }, 2000)
        })
        .start()
    }, time * 0.75)
  }

  ejectDisk () {
    if (this.clicked) return
    TWEEN.removeAll()
    const time = 1000
    this.ocean.still = false
    this.tweenComplete = false
    const txt = this.texts[this.inserted].group
    new TWEEN.Tween(this.meshes[2].position)
      .to({ z: 6.018 }, time)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => { this.inserted = false })
      .start()
    new TWEEN.Tween(txt.position)
      .to({ z: -1 }, time)
      .easing(TWEEN.Easing.Quadratic.In)
      .start()
  }

  menuClick (url) {
    this.clicked = url
    document.querySelector('#main-menu').style.opacity = 0
    header.style.opacity = 0
    this.goToGallery()
  }

  goToGallery () {
    if (this.tweenComplete && this.clicked) {
      this.renderer.domElement.style.opacity = 0
      setTimeout(() => {
        window.location = '/' + this.clicked
      }, 1500)
    }
  }

  show () {
    this.renderer.domElement.style.display = 'block'
    setTimeout(() => {
      this.renderer.domElement.style.opacity = '1'
    }, 100)
  }

  update () {
    if (!this.ocean) return
    const d = this.clock.getDelta()
    if (this.ocean) this.ocean.update(d)

    if (this.meshes[2] && !this.inserted) {
      const t = this.clock.getElapsedTime()
      this.meshes[2].rotation.x = Math.PI - Math.sin(t * 1.25) * 0.125
      this.meshes[2].rotation.y = -Math.PI * 0.5 - Math.cos(t * 1.25) * 0.125
    }
  }
}

// const World = new Gallery({
//   // controls: true,
//   // camera: { type: 'orthographic' },
//   bleed: false,
//   tween: true
// })
//
// World.camera.position.x = 8.501
// World.camera.position.y = 9.815
// World.camera.position.z = 13.301
// World.camera.rotation.x = -0.623
// World.camera.rotation.y = 0.587
// World.camera.rotation.z = 0.379

const World = new Gallery({
  // controls: true,
  camera: { type: 'orthographic' },
  bleed: false,
  tween: true
})

World.camera.position.x = 6.212
World.camera.position.y = 8.821
World.camera.position.z = 9.357
World.camera.rotation.x = -0.453
World.camera.rotation.y = 0.682
World.camera.rotation.z = 0.298
World.camera.zoom = 49.318061523273826
World.camera.updateProjectionMatrix()

// World.camera.position.x = 7.648
// World.camera.position.y = 3.375
// World.camera.position.z = 9.979
// World.camera.rotation.x = -0.477
// World.camera.rotation.y = 0.629
// World.camera.rotation.z = 0.295
// World.camera.zoom = 218.28376937339243
// World.camera.updateProjectionMatrix()
