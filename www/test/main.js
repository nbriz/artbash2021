/* global THREE, TWEEN, CyberSpace, BGGradient, WallText , RetroText, AniSprite,
FloppyDisk, GradShaderMaterial */
const bg = new BGGradient('#37808f', '#374872')

const dis = window.createDisclaimer()

const load = window.createLoader(() => {
  load.style.display = 'none'
  dis.style.display = 'none'
  header.style.display = 'flex'
  World.show()
  if (wtxt.parseHash() instanceof Array) wtxt.checkURLHash()
})

const wtxt = new WallText({
  title: 'Test Room',
  info: 'this is an example room',
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
    console.log(w)
  }
})

const header = window.createHeader(wtxt)

class Gallery extends CyberSpace {
  constructor (opts) {
    super(opts)
    this.renderer.domElement.classList.add('fadeIn')
    this.renderer.domElement.style.opacity = '0'
    this.renderer.domElement.style.display = 'none'

    this.settings.tween = true
    this.meshes = []
    this.data = [
      // {
      //   artist: 'Nick Briz',
      //   title: 'My Cool Work',
      //   info: 'this is a thing that i made',
      //   size: '1337 x 1337',
      //   url: 'http://nickbriz.com'
      // },
      // {
      //   artist: 'Andy Briz',
      //   title: 'My Arts',
      //   info: 'this is a thing that i made',
      //   size: '1337 x 1337',
      //   url: 'http://nickbriz.com'
      // }
    ]

    load.update(1)

    wtxt.createList(this.data)
    // this.loadMesh(0)

    this.text = new RetroText({
      dat: true,
      shaders: [
        { xMult: 0.25, xAdd: 0.1, yMult: -0.6, yAdd: 0.25, zMult: 0.2, zAdd: 0.6, alpha: 0.35 },
        { xMult: -1, xAdd: 0.1, yMult: 0.25, yAdd: 0.35, zMult: 0, zAdd: 0.45, alpha: 1 }
      ],
      chars: [
        { text: 'B', pos: { x: -1.029, y: 0.059, z: 0 } },
        { text: 'L', pos: { x: -0.288, y: -0.179, z: 0 } },
        { text: 'A', pos: { x: 0.058, y: 0.134, z: 0 } },
        { text: 'C', pos: { x: 0.802, y: -0.186, z: 0 } },
        { text: 'K', pos: { x: 1.53, y: 0.051, z: 0 } },
        { text: 'B', pos: { x: -0.69, y: -1.318, z: 0 } },
        { text: 'O', pos: { x: 0.106, y: -1.111, z: 0 } },
        { text: 'X', pos: { x: 0.92, y: -1.366, z: 0 } }
      ]
    }, () => {
      this.text.chars.forEach(char => this.scene.add(char))
      // this.scene.add(this.text.group)
    })

    // this.sprite = new AniSprite({
    //   root: '../images/sprites',
    //   name: 'star',
    //   type: 'png',
    //   length: 6,
    //   fps: 100,
    //   delay: 1500
    // })
    // this.sprite = new AniSprite({
    //   root: '../images/sprites',
    //   name: 'bubble',
    //   type: 'png',
    //   length: 5,
    //   fps: 200,
    //   delay: 1500
    // })
    // this.scene.add(this.sprite.mesh)

    window.addEventListener('mousemove', (e) => {
      bg.draw(e.clientX, e.clientY)
    })
  }

  show () {
    this.renderer.domElement.style.display = 'block'
    setTimeout(() => {
      this.renderer.domElement.style.opacity = '1'
    }, 100)
  }

  loadMesh (i) {
    const work = this.data[i]
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshNormalMaterial()
    const cube = new THREE.Mesh(geometry, material)
    const x = Math.random() * 5 - 2.5
    const y = Math.random() * 5 - 2.5
    const z = -Math.random() * 5 - 2.5
    cube.name = 'w_' + i
    cube.userData = work
    cube._OG_position = { x, y, z }
    cube.position.set(x, y, z)
    this.scene.add(cube)
    this.meshes.push(cube)
    i++; if (i < this.data.length) this.loadMesh(i)
  }

  find (w) {
    const i = this.data.indexOf(w)
    const meshes = this.meshes.filter(m => m.name === `w_${i}`)
    return meshes[0]
  }

  select (mesh) {
    this.selected = mesh
    new TWEEN.Tween(mesh.position)
      .to({ x: 0, y: 0, z: -1 }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
  }

  deselect (mesh) {
    this.selected = null
    const x = mesh._OG_position.x
    const y = mesh._OG_position.y
    const z = mesh._OG_position.z
    new TWEEN.Tween(mesh.position)
      .to({ x, y, z }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
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
    if (!this.meshes) return
    // const t = this.clock.getElapsedTime()
    this.meshes.forEach(m => {
      m.rotation.y = Date.now() * 0.001
      m.rotation.z = Date.now() * 0.002
    })
  }
}

const World = new Gallery({
  controls: true,
  antialias: true
})
