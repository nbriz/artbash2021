/* global THREE */
class BlackBoxMonitor {
  constructor (path, callback) {
    this.monitor = null
    this.screen = null
    const geo = new THREE.BoxGeometry(0.55, 0.55, 0.50)
    const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    this.group = new THREE.Mesh(geo, mat)
    this.group.name = 'monitor-' + this.name
    this.img = new window.Image()
    this.img.onload = () => this.loadMonitor(callback)
    this.img.src = path
  }

  loop () {
    window.requestAnimationFrame(() => this.loop())
    // this.ctx.fillStyle = '#201E4F'
    // this.ctx.textBaseline = 'middle'
    // this.ctx.font = "250px 'URW DIN'"
    // this.ctx.fillText('TEST', 170, this.canvas.height / 2)
    const w = this.canvas.width
    const h = this.canvas.height
    this.ctx.drawImage(this.img, 0, 0, w, h)
    const l = Math.random() * 10 - (10 / 2)
    this.ctx.fillStyle = `hsla(172, 14%, ${84.3 + l}%, 0.66)`
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    if (this.canvmat) this.canvmat.map.needsUpdate = true
  }

  createScreen () {
    this.canvas = document.createElement('canvas')
    // this.canvas.style.position = 'absolute'
    // this.canvas.style.zIndex = 100000
    // document.body.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = 512
    this.canvas.height = 512
    this.loop()
    const texture = new THREE.CanvasTexture(this.canvas)
    const geo = new THREE.PlaneBufferGeometry(1, 1)
    this.canvmat = new THREE.MeshBasicMaterial({ map: texture })
    this.screen = new THREE.Mesh(geo, this.canvmat)
    this.screen.position.set(0, 0, 0.209)
    this.screen.scale.set(0.5, 0.5, 0.5)
    this.group.add(this.screen)
  }

  loadMonitor (callback) {
    const loader = new THREE.GLTFLoader().setPath('../models/')
    loader.load('monitor.gltf', (gltf) => {
      this.monitor = gltf.scene
      this.monitor.scale.set(0.0025, 0.0025, 0.0025)
      this.monitor.position.z = 0.629
      const m = new THREE.MeshStandardMaterial({ color: 0x152d73 })
      this.monitor.traverse((child) => {
        if (child.isMesh) child.material = m
      })
      this.createScreen()
      this.group.add(this.monitor)
      if (callback) callback(this.group, this.monitor)
    })
  }
}

window.BlackBoxMonitor = BlackBoxMonitor
