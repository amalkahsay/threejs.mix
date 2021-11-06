import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { GUI } from '/resources/examples/jsm/libs/dat.gui.module.js';
import Stats from '/resources/examples/jsm/libs/stats.module.js';

let scene, renderer, camera, stats;
let model, skeleton, mixer, clock;

const crossFadeControls = [];

let idleAction, walkAction, runAction;
let idleWeight, walkWeight, runWeight;
let actions, settings;

let singleStepMode = false;
let sizeOfNextStep = 0;


var slider = document.getElementById("slider");
var selector = document.getElementById("selector");
var SelectValue = document.getElementById("SelectValue");
var ProgressBar = document.getElementById("ProgressBar");
SelectValue.innerHTML=slider.value;

slider.oninput = function(){
  SelectValue.innerHTML=this.value;
  selector.style.left = this.value + "%";
  ProgressBar.style.width = this.value + "%";
}
var slider1 = document.getElementById("slider1");
var selector1 = document.getElementById("selector1");
var SelectValue1 = document.getElementById("SelectValue1");
var ProgressBar1 = document.getElementById("ProgressBar1");
SelectValue1.innerHTML=slider1.value;

slider1.oninput = function(){
  SelectValue1.innerHTML=this.value;
  selector1.style.left = this.value + "%";
  ProgressBar1.style.width = this.value + "%";
}

var slider2 = document.getElementById("slider2");
var selector2 = document.getElementById("selector2");
var SelectValue2 = document.getElementById("SelectValue2");
var ProgressBar2 = document.getElementById("ProgressBar2");
SelectValue2.innerHTML=slider2.value;

slider2.oninput = function(){
  SelectValue2.innerHTML=this.value;
  selector2.style.left = this.value + "%";
  ProgressBar2.style.width = this.value + "%";
}





// import * as GUI from 'babylonjs-gui';
// import * as BABYLON from 'babylonjs';
// import { Scene, Engine } from 'babylonjs';

// let scene, renderer, camera, stats;
// let model, skeleton, mixer, clock;

// const crossFadeControls = [];

// let idleAction, walkAction, runAction;
// let idleWeight, walkWeight, runWeight;
// let actions, settings;

// let singleStepMode = false;
// let sizeOfNextStep = 0;


//buttons
// let index = 0
// const btns = document.getElementById('btns');
// btns.childNodes.forEach(btn =>{
//   if(btn.innerHTML !== undefined){
//     btn.addEventListener('click',playAction.bind(this,index));
//     index++;
//   }
// })


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

  // _onKeyDown(event) {
  //   switch (event.keyCode) {
  //     case 87:  w
  //       this._move.forward = true;
  //       break;
  //     case 65:  a
  //       this._move.left = true;
  //       break;
  //     case 83:  s
  //       this._move.backward = true;
  //       break;
  //     case 68:  d
  //       this._move.right = true;
  //       break;
  //     case 38:  up
  //     case 37:  left
  //     case 40:  down
  //     case 39:  right
  //       break;
  //   }
  // }

  // _onKeyUp(event) {
  //   switch(event.keyCode) {
  //     case 87: w
  //       this._move.forward = false;
  //       break;
  //     case 65:  a
  //       this._move.left = false;
  //       break;
  //     case 83:  s
  //       this._move.backward = false;
  //       break;
  //     case 68:  d
  //       this._move.right = false;
  //       break;
  //     case 38:  up
  //     case 37:  left
  //     case 40:  down
  //     case 39:  right
  //       break;
  //   }
  // }

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
    const stats = Stats()
    document.body.appendChild(stats.dom)
    
   
  //  gui._LoadAnimatedModel(_LoadAnimatedModel.rotation,"x",0,Math.PI*2)


    
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

    let light = new THREE.DirectionalLight(0xFFFFFF, 20.0);
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

    // const loader = new THREE.CubeTextureLoader();
    // const texture = loader.load([
      
    // ]);
    // this._scene.background = texture;
    // this._scene.background = new THREE.Color( 0xFFFFFF );
   this._scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20, 20, 20),
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
      anim.load('Dying-2.fbx', (anim) => {
        const m = new THREE.AnimationMixer(fbx);
        this._mixers.push(m);
        const idle = m.clipAction(anim.animations[0]);
        idle.play();
        // idle.pause();
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


// function playAction(self){
 
//   self._LoadAnimatedModel(false)
// }

// function loadAnimation(loader){
//   const anim = anims.shift();
  
//   loader.load(`Dying-2${anim}.fbx`, object => {
//     const action = mixer.clipAction(object.animations[0]);
//     if (anim=='die'){
//       action.loop = THREE.LoopOnce;
//       action.clampWhenFinished = true;
//     }
//     actions.push(action);
//     if (anims.length>0){
//       loadAnimation(loader);
//     }else{
//       update();
//     }
//   })
// }

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new LoadModelDemo();
});
