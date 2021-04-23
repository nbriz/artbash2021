/* global THREE, GradShaderMaterial */
// this is a remix of Don McCurdy's ocean component for A-Frame
// https://github.com/n5ro/aframe-extras/blob/master/src/primitives/a-ocean.js

class Ocean {
  constructor (opts) {
    opts = opts || {}
    this.width = opts.width || 10
    this.depth = opts.depth || 10
    this.density = opts.density || 10
    this.amplitude = opts.amplitude || 0.1
    this.amplitudeVariance = opts.amplitudeVariance || 0.3
    this.speed = opts.speed || 1
    this.speedVariance = opts.speedVariance || 0.3
    this.color = opts.color || '#7AD2F7'
    this.opacity = opts.opacity || 0.8
    this._setup()
  }

  _setup () {
    this.geometry = new THREE.PlaneGeometry(this.width, this.depth, this.density, this.density)
    this.geometry.mergeVertices()
    this.waves = []
    for (let v, i = 0, l = this.geometry.vertices.length; i < l; i++) {
      v = this.geometry.vertices[i]
      this.waves.push({
        z: v.z,
        ang: Math.random() * Math.PI * 2,
        amp: this.amplitude + Math.random() * this.amplitudeVariance,
        speed: (this.speed + Math.random() * this.speedVariance) / 1000 // radians / frame
      })
    }

    const unis = {
      xMult: -0.4,
      xAdd: -0.2,
      yMult: -0.75,
      yAdd: 0.3,
      zMult: 0.1,
      zAdd: 0.95,
      alpha: 1
    }
    const s = new GradShaderMaterial(unis)

    this.mesh = new THREE.Mesh(this.geometry, s.material)
    this.mesh.rotation.x = -Math.PI / 2
  }

  edit (prop, val) {
    this[prop] = val
    this.waves = []
    for (let v, i = 0, l = this.geometry.vertices.length; i < l; i++) {
      v = this.geometry.vertices[i]
      this.waves.push({
        z: v.z,
        ang: Math.random() * Math.PI * 2,
        amp: this.amplitude + Math.random() * this.amplitudeVariance,
        speed: (this.speed + Math.random() * this.speedVariance) / 1000 // radians / frame
      })
    }
  }

  update (dt) {
    const verts = this.mesh.geometry.vertices
    for (let v, vprops, i = 0; (v = verts[i]); i++) {
      vprops = this.waves[i]
      if (this.still) {
        if (v.z < -0.1) v.z += 0.05
        else if (v.z > 0.1) v.z -= 0.05
        else v.z = 0
      } else {
        v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp
        vprops.ang += vprops.speed * dt
      }
    }
    this.mesh.geometry.verticesNeedUpdate = true
  }
}

// export default Ocean
window.Ocean = Ocean
