/* global THREE */
class GradShaderMaterial {
  constructor (unis) {
    unis = unis || {}
    this.uniforms = {
      time: { type: 'f', value: unis.time || 0 },
      xMult: { type: 'f', value: unis.xMult || 1 },
      xAdd: { type: 'f', value: unis.xAdd || 0.4 },
      yMult: { type: 'f', value: unis.yMult || -0.45 },
      yAdd: { type: 'f', value: unis.yAdd || 0.2 },
      zMult: { type: 'f', value: unis.zMult || -0.2 },
      zAdd: { type: 'f', value: unis.zAdd || 1 },
      alpha: { type: 'f', value: unis.alpha || 1 }
    }

    this.material = new THREE.ShaderMaterial({
      // uniforms: this.uniCube,
      // uniforms: this.unis['open-call'],
      uniforms: this.uniforms,
      // linewidth: 2,
      vertexShader: this.vertexShader(),
      fragmentShader: this.fragmentShader(),
      side: THREE.DoubleSide
      // transparent: true,
      // opacity: 0.7
    })
  }

  vertexShader () {
    return `
    varying vec3 vp;
    void main() {
        vec3 trans = vec3(position);
        vec4 mvPos = modelViewMatrix * vec4(trans,1.0);
        gl_Position = projectionMatrix * mvPos;
        vp = -mvPos.xyz;
    }`
  }

  fragmentShader () {
    return `#include <common>

      uniform float time;
      uniform float xMult;
      uniform float xAdd;
      uniform float yMult;
      uniform float yAdd;
      uniform float zMult;
      uniform float zAdd;
      uniform float alpha;

      varying vec3 vp;

      void main() {
        vec3 fdx = vec3(dFdx(vp.x), dFdx(vp.y), dFdx(vp.z));
        vec3 fdy = vec3(dFdy(vp.x), dFdy(vp.y), dFdy(vp.z));
        vec3 fdz = vec3(dFdx(vp.x), dFdx(vp.y), dFdx(vp.z));
        vec3 fdxy = refract( fdy, fdz, 1.0 );
        vec3 norm = normalize( fdxy );
        vec3 norm1 = normalize( cross( fdx, fdy ) );
        float x = norm.x * xMult + xAdd;
        // float x = sin(vp.x * xMult * 0.5);
        float y = norm.y * yMult + yAdd;
        float z = norm.z * zMult + zAdd;
        gl_FragColor = vec4( x, y, z, alpha );
      }`
  }
}

window.GradShaderMaterial = GradShaderMaterial
