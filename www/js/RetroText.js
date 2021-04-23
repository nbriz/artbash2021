/* global THREE, GradShaderMaterial, dat */
class RetroText {
  constructor (opts, callback) {
    this.callback = callback
    this.chars = []
    // parent container
    const geo = new THREE.BoxGeometry(0.55, 0.55, 0.50)
    const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    this.group = new THREE.Mesh(geo, mat)
    this.group.name = opts.chars.map(c => c.text).join('')
    // setup shaders
    this.mats = []
    opts.shaders.forEach(unis => {
      const s = new GradShaderMaterial(unis)
      this.mats.push(s.material)
      // debug shaders
      if (opts.dat) {
        this.gui = new dat.GUI()
        for (const key in s.uniforms) {
          this.gui.add(s.uniforms[key], 'value')
            .name(key).min(-1).max(1).step(0.05)
        }
      }
    })
    // create text
    this.loadFont(() => this.createText(opts))
  }

  loadFont (callback) {
    window.fetch('../fonts/kenpixel.json')
      .then(res => res.json())
      .then(json => {
        this.font = new THREE.Font(json)
        callback()
      })
  }

  createChar (char, size, height) {
    size = size || 0.7
    height = height || 0.3
    const textGeo = new THREE.TextGeometry(char, {
      font: this.font, size, height, bevelEnabled: false
    })
    // 3D Text
    const txt1 = new THREE.Mesh(textGeo, this.mats[0])
    // 2D text faces
    const txt2 = new THREE.Mesh(textGeo, this.mats[1])
    txt2.scale.set(1, 1, 0)
    txt2.position.set(0, 0, height + 0.001)

    const geo = new THREE.BoxGeometry(0.55, 0.55, 0.50)
    const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.add(txt1)
    mesh.add(txt2)
    return mesh
  }

  createText (opts) {
    opts.chars.forEach(o => {
      const mesh = this.createChar(o.text, o.size, o.height)
      mesh.position.set(o.pos.x, o.pos.y, o.pos.z)
      this.group.add(mesh)
      this.chars.push(mesh)
    })
    if (this.callback) this.callback()
  }
}

window.RetroText = RetroText
