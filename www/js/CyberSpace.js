/* global THREE, TWEEN */
// import * as THREE from '../three.js-master/build/three.module.js'
// import { OrbitControls } from '../three.js-master/examples/jsm/controls/OrbitControls.js'
// import { TransformControls } from '../three.js-master/examples/jsm/controls/TransformControls.js'
// import { TWEEN } from '../three.js-master/examples/jsm/libs/tween.module.min.js'

class CyberSpace {
  constructor (opts) {
    opts = opts || {}

    this.settings = {
      tween: typeof opts.tween !== 'undefined' ? opts.tween : false,
      // camera
      controls: typeof opts.controls !== 'undefined' ? opts.controls : false,
      camera: typeof opts.camera !== 'undefined' ? opts.camera : {
        type: 'perspective',
        near: 0.1,
        far: 1000
      },
      // renderer
      bleed: typeof opts.bleed !== 'undefined' ? opts.bleed : false,
      alpha: typeof opts.alpha !== 'undefined' ? opts.alpha : true,
      antialias: typeof opts.antialias !== 'undefined' ? opts.antialias : true
    }

    this.camera = null
    this.scene = null
    this.renderer = null
    this.controls = null

    this.clock = new THREE.Clock()
    this.clock.start()

    if (typeof this.raycast === 'function' && !opts.controls) {
      this.raycaster = new THREE.Raycaster()
      this.mouse = new THREE.Vector2()
      this.intersected = null
      this.selectable = opts.selectable
      window.addEventListener('mousemove', (e) => this._updateMouse(e))
      window.addEventListener('mousedown', (e) => this._runRaycaster(e))
    }

    this._setup()
    this._draw()
  }

  _setup () {
    this.scene = new THREE.Scene()

    const w = window.innerWidth
    const h = window.innerHeight
    const near = this.settings.camera.near || 0.1
    const far = this.settings.camera.far || 1000
    if (this.settings.camera.type === 'orthographic') {
      this.camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, near, far)
    } else {
      this.camera = new THREE.PerspectiveCamera(75, w / h, near, far)
    }

    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: this.settings.bleed,
      antialias: this.settings.antialias,
      alpha: this.settings.alpha
    })
    this.renderer.autoClearColor = !this.settings.bleed
    this.renderer.setClearColor(0xfffff, 0)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.domElement.style.position = 'absolute'
    this.renderer.domElement.style.left = '0px'
    this.renderer.domElement.style.top = '0px'
    this.renderer.domElement.style.zIndex = '0'
    this.renderer.domElement.setAttribute('id', 'threejs')
    document.body.appendChild(this.renderer.domElement)

    if (this.settings.controls) this._debugControls()

    window.addEventListener('resize', () => this.resize(), false)
  }

  resize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    if (this.settings.camera.type === 'orthographic') {
      this.camera.left = window.innerWidth / -2
      this.camera.right = window.innerWidth / 2
      this.camera.top = window.innerHeight / 2
      this.camera.bottom = window.innerHeight / -2
    }
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  _runRaycaster () {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const objs = this.selectable || this.scene.children
    const intersects = this.raycaster.intersectObjects(objs)
    if (intersects.length > 0) this.raycast(intersects)
  }

  _draw () {
    window.requestAnimationFrame(() => this._draw())
    if (this.update) this.update()
    // if (typeof TWEEN !== 'undefined') TWEEN.update()
    if (this.settings.tween) TWEEN.update()
    this.renderer.render(this.scene, this.camera)
  }

  // .......................................................[ debug ]...........

  _debugControls () {
    // wireframe ground
    this.floorHelper = new THREE.GridHelper(2000, 100)
    this.floorHelper.material.opacity = 0.25
    this.floorHelper.material.transparent = true
    this.scene.add(this.floorHelper)
    // controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
    // HACK: fix controls bug
    if (this.camera.position.x === 0 &&
      this.camera.position.y === 0 &&
      this.camera.position.z === 0) { this.camera.position.z = 1 }
    // setup raycaster
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.intersected = null
    window.addEventListener('mousemove', (e) => this._updateMouse(e))
    window.addEventListener('mousedown', (e) => this._selectMesh(e))
    window.addEventListener('mouseup', (e) => this._printStats(e))
    // setup transform controls
    this.transform = new THREE.TransformControls(this.camera, this.renderer.domElement)
    this.transform.addEventListener('dragging-changed', (e) => {
      this.controls.enabled = !e.value
    })
    this.scene.add(this.transform)
    // add keyboard controls
    window.addEventListener('keydown', (e) => {
      // console.log(e.keyCode);
      switch (e.keyCode) {
        case 84: this.transform.setMode('translate'); break // t
        case 82: this.transform.setMode('rotate'); break // r
        case 83: this.transform.setMode('scale'); break // s
        case 187:
        case 107: // +, =, num+
          this.transform.setSize(this.transform.size + 0.1); break
        case 189:
        case 109: // -, _, num-
          this.transform.setSize(Math.max(this.transform.size - 0.1, 0.1)); break
      }
    })
  }

  _lightHelpers (lights) {
    const addHelper = (light) => {
      const type = light.type + 'Helper'
      const help = new THREE[type](light, 1)
      this.scene.add(help)
    }
    if (lights instanceof Array) lights.forEach(l => addHelper(l))
    else addHelper(lights)
  }

  _updateMouse (e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  _selectMesh () {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const objs = this.scene.children
    const intersects = this.raycaster.intersectObjects(objs)
      .filter(o => o.object !== this.floorHelper)
    if (intersects.length > 0) {
      if (this.intersected !== intersects[0].object) {
        this.intersected = intersects[0].object
        this.transform.attach(this.intersected)
      }
    }
  }

  _printStats () {
    console.clear()
    if (this.intersected) this.logSelectedPos()
    else this.logCamPos()
  }

  logCamPos () {
    console.log(`
      camera.position.x = ${Math.round(this.camera.position.x * 1000) / 1000}
      camera.position.y = ${Math.round(this.camera.position.y * 1000) / 1000}
      camera.position.z = ${Math.round(this.camera.position.z * 1000) / 1000}
      camera.rotation.x = ${Math.round(this.camera.rotation.x * 1000) / 1000}
      camera.rotation.y = ${Math.round(this.camera.rotation.y * 1000) / 1000}
      camera.rotation.z = ${Math.round(this.camera.rotation.z * 1000) / 1000}
    `)
  }

  logSelectedPos () {
    // console.log(`
    //   intersected.position.x = ${Math.round(this.intersected.position.x * 1000) / 1000}
    //   intersected.position.y = ${Math.round(this.intersected.position.y * 1000) / 1000}
    //   intersected.position.z = ${Math.round(this.intersected.position.z * 1000) / 1000}
    //   intersected.rotation.x = ${Math.round(this.intersected.rotation.x * 1000) / 1000}
    //   intersected.rotation.y = ${Math.round(this.intersected.rotation.y * 1000) / 1000}
    //   intersected.rotation.z = ${Math.round(this.intersected.rotation.z * 1000) / 1000}
    //   intersected.scale.x = ${Math.round(this.intersected.scale.x * 1000) / 1000}
    //   intersected.scale.y = ${Math.round(this.intersected.scale.y * 1000) / 1000}
    //   intersected.scale.z = ${Math.round(this.intersected.scale.z * 1000) / 1000}
    // `)
    console.log(`{
  pos: { x: ${Math.round(this.intersected.position.x * 1000) / 1000}, y: ${Math.round(this.intersected.position.y * 1000) / 1000}, z: ${Math.round(this.intersected.position.z * 1000) / 1000} },
  rot: ${Math.round(this.intersected.rotation.y * 1000) / 1000},
  idx: ${this.intersected.name}
}`)
  }
}

// export default CyberSpace
window.CyberSpace = CyberSpace
