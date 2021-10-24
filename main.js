import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { GUI } from '/resources/dat.gui.module.js';
import Stats from '/resources/examples/jsm/libs/stats.module.js';
 import * as dat from 'dat.gui'
// import * as GUI from 'babylonjs-gui';
// import * as BABYLON from 'babylonjs';
// import { Scene, Engine } from 'babylonjs';
const gui = new dat.GUI()
let scene, renderer, camera, stats;
let model, skeleton, mixer, clock;

const crossFadeControls = [];

let idleAction, walkAction, runAction;
let idleWeight, walkWeight, runWeight;
let actions, settings;

let singleStepMode = false;
let sizeOfNextStep = 0;

class BasicCharacterControls {
  constructor(params) {
    this._Init(params);
  }

  _Init(params) {
    this._params = params;
    this._move = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };
    this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this._velocity = new THREE.Vector3(0, 0, 0);

    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
    switch (event.keyCode) {
      case 87:  w
        this._move.forward = true;
        break;
      case 65:  a
        this._move.left = true;
        break;
      case 83:  s
        this._move.backward = true;
        break;
      case 68:  d
        this._move.right = true;
        break;
      case 38:  up
      case 37:  left
      case 40:  down
      case 39:  right
        break;
    }
  }

  _onKeyUp(event) {
    switch(event.keyCode) {
      case 87: w
        this._move.forward = false;
        break;
      case 65:  a
        this._move.left = false;
        break;
      case 83:  s
        this._move.backward = false;
        break;
      case 68:  d
        this._move.right = false;
        break;
      case 38:  up
      case 37:  left
      case 40:  down
      case 39:  right
        break;
    }
  }

  Update(timeInSeconds) {
    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
        velocity.x * this._decceleration.x,
        velocity.y * this._decceleration.y,
        velocity.z * this._decceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
        Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = this._params.target;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    if (this._move.forward) {
      velocity.z += this._acceleration.z * timeInSeconds;
    }
    if (this._move.backward) {
      velocity.z -= this._acceleration.z * timeInSeconds;
    }
    if (this._move.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }
    if (this._move.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * timeInSeconds);
    forward.multiplyScalar(velocity.z * timeInSeconds);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    oldPosition.copy(controlObject.position);
  }
}


class LoadModelDemo {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 20, 0);

    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    light = new THREE.AmbientLight(0xFFFFFF, 4.0);
    this._scene.add(light);

    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      
    ]);
    this._scene.background = texture;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshStandardMaterial({
            color: 0x202020,
          }));
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    this._mixers = [];
    this._previousRAF = null;

    this._LoadAnimatedModel();
    // this._LoadAnimatedModelAndPlay(
    //     './resources/dancer/', 'girl.fbx', 'dance.fbx', new THREE.Vector3(0, -1.5, 5));
    // this._LoadAnimatedModelAndPlay(
    //     './resources/dancer/', 'dancer.fbx', 'Silly Dancing.fbx', new THREE.Vector3(12, 0, -10));
    // this._LoadAnimatedModelAndPlay(
    //     './resources/dancer/', 'dancer.fbx', 'Silly Dancing.fbx', new THREE.Vector3(2, 0, 10));
    this._RAF();
  }

  _LoadAnimatedModel() {
    const loader = new FBXLoader();
    loader.setPath('./resources/zombie/');
    loader.load('Ch44_nonPBR-3.fbx', (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });

      const params = {
        target: fbx,
        camera: this._camera,
      }
      this._controls = new BasicCharacterControls(params);

      const anim = new FBXLoader();
      anim.setPath('./resources/zombie/');
      anim.load('Walking.fbx', (anim) => {
        const m = new THREE.AnimationMixer(fbx);
        this._mixers.push(m);
        const idle = m.clipAction(anim.animations[0]);
        idle.play();
      });
      
      this._scene.add(fbx);
    });
  }


  _LoadAnimatedModelAndPlay(path, modelFile, animFile, offset) {
    const loader = new FBXLoader();
    loader.setPath(path);
    loader.load(modelFile, (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });
      fbx.position.copy(offset);

      const anim = new FBXLoader();
      anim.setPath(path);
      anim.load(animFile, (anim) => {
        const m = new THREE.AnimationMixer(fbx);
        this._mixers.push(m);
        const idle = m.clipAction(anim.animations[0]);
        idle.play();
      });
      this._scene.add(fbx);
    });
  }


  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this._mixers) {
      this._mixers.map(m => m.update(timeElapsedS));
    }

    if (this._controls) {
      this._controls.Update(timeElapsedS);
    }
  }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new LoadModelDemo();
});

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xff0000, 0.2)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
pointLight2.position.set(1.26,1,1)
pointLight2.intensity = 10
scene.add(pointLight2)

const Light1 = gui.addFolder('Light 1')
Light1.add(pointLight2.position,'y').min(-3).max(3).step(0.01)
Light1.add(pointLight2.position,'x').min(-3).max(3).step(0.01)
Light1.add(pointLight2.position,'z').min(-3).max(3).step(0.01)
Light1.add(pointLight2,'intensity').min(-3).max(3).step(0.01)

const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1)
scene.add(pointLightHelper)



const pointLight3 = new THREE.PointLight(0xffe1, 1)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
pointLight3.position.set(1,3,1)
pointLight3.intensity = 10
scene.add(pointLight3)
const Light2 = gui.addFolder('Light 2')
Light2.add(pointLight3.position,'y').min(-3).max(3).step(0.01)
Light2.add(pointLight3.position,'x').min(-3).max(3).step(0.01)
Light2.add(pointLight3.position,'z').min(-3).max(3).step(0.01)
Light2.add(pointLight3,'intensity').min(-3).max(3).step(0.01)

const Light2Color = {
    color:0xff00000
}