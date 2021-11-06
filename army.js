import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
// import { GUI } from '/resources/dat.gui.module.js';
// import * as GUI from 'babylonjs-gui';
// import * as BABYLON from 'babylonjs';
// import { Scene, Engine } from 'babylonjs';

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

  }


  Update(timeInSeconds) {
    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
        velocity.x * this._decceleration.x,
        velocity.y * this._decceleration.y,
        velocity.z * this._decceleration.z
    );
  
    
    

    controlObject.quaternion.copy(_R);
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

    const fov = 400;
    const aspect = 1940 / 1080;
    const near = 1.0;
    const far = 1000;
    this._camera = new THREE.PerspectiveCamera(fov, aspect);
    this._camera.position.set(50, 20,120);

    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight( 0x202020, 400.40);
    light.position.set(20, 10, 10);
    light.target.position.set(550, 500, 550);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2080;
    light.shadow.mapSize.height = 2080;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 700.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -10;
    light.shadow.camera.top = 10;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    light = new THREE.AmbientLight( 0x202020);
    this._scene.add(light);

    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
    controls.update();

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      
    ]);
    this._scene.background = texture;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 100, 100),
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
    this._RAF();
    this._LoadAnimatedModel1();
    this._RAF1();
    this._LoadAnimatedModel2();
    this._RAF2();
    this._LoadAnimatedModel3();
    this._RAF3();

  }

  _LoadAnimatedModel() {
    const loader = new FBXLoader();
    loader.setPath('./resources/zombie/');
    loader.load('untitled6.fbx', (fbx) => {
      fbx.scale.setScalar(0.1);

      fbx.traverse(c => {
        c.castShadow = true;
      });

      const params = {
        target: fbx,
        camera: this._camera,
      }
      this._controls = new BasicCharacterControls(params);
     fbx.position.set(.3,0,30)
      this._scene.add(fbx);
    });
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

  _LoadAnimatedModel1() {
    const loader = new FBXLoader();
    loader.setPath('./resources/zombie/');
    loader.load('untitled2.fbx', (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.position.set(.3,0,30)
      fbx.traverse(c => {
        c.castShadow = true;
      });

      const params = {
        target: fbx,
        camera: this._camera,
      }
      this._controls = new BasicCharacterControls(params);
     fbx.position.set(.3,0,15)
      this._scene.add(fbx);
    });
  }
  _RAF1() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF1();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _LoadAnimatedModel2() {
    const loader = new FBXLoader();
    loader.setPath('./resources/zombie/');
    loader.load('untitled6.fbx', (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.position.set(.4,0,0,5)
      fbx.traverse(c => {
        c.castShadow = true;
      });

      const params = {
        target: fbx,
        camera: this._camera,
      }
      this._controls = new BasicCharacterControls(params);
      this._scene.add(fbx);
    });
  }

  _RAF2() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF2();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _LoadAnimatedModel3() {
    const loader = new FBXLoader();
    loader.setPath('./resources/zombie/');
    loader.load('untitled6.fbx', (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.position.set(.3,0,-20)
      fbx.traverse(c => {
        c.castShadow = true;
      });

      const params = {
        target: fbx,
        camera: this._camera,
      }
      this._controls = new BasicCharacterControls(params);
     
      this._scene.add(fbx);
    });
  }
  _RAF3() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF3();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }


}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new LoadModelDemo();
});
