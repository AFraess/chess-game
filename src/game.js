class Game {

  constructor(state) {
    this.state = state;
    this.spawnedObjects = [];
    this.collidableObjects = [];
    this.timeAccumulator = 0;

  }


  // example - we can add our own custom method to our game and call it using 'this.customMethod()'
  customMethod() {
    console.log("Custom method!");
  }

    // example - create a collider on our object with various fields we might need (you will likely need to add/remove/edit how this works)

    createSphereCollider(object, radius, onCollide = null) {
        /*
    object.collider = {
      type: "SPHERE",
      radius: radius,
      onCollide: onCollide ? onCollide : (otherObject) => {
        console.log(`Collided with ${otherObject.name}`);
      }
    };
    this.collidableObjects.push(object);
    */
  }
  

  // example - function to check if an object is colliding with collidable objects
  checkCollision(object) {
    // loop over all the other collidable objects 
    this.collidableObjects.forEach(otherObject => {
      // probably don't need to collide with ourselves
      if (object.name === otherObject.name) {
        return;
      }
      // do a check to see if we have collided, if we have we can call object.onCollide(otherObject) which will
      // call the onCollide we define for that specific object. This way we can handle collisions identically for all
      // objects that can collide but they can do different things (ie. player colliding vs projectile colliding)
      // use the modeling transformation for object and otherObject to transform position into current location
      // ie: 
      // if (collide){ object.collider.onCollide(otherObject) } // fires what we defined our object should do when it collides
    });
  }

  getSignatureM(lookDirection) {
// north
var signature = '';
            if (lookDirection[0] >= 0 && lookDirection[2] >= 0) {
            if (lookDirection[0] < 0.5){
                signature = 'NE';
              } else {
                signature = 'NW';
              }
            // east
            } else if (lookDirection[0] < 0 && lookDirection[2] >= 0){
              if (lookDirection[0] >= -0.5){
                signature = 'NE';
              } else {
                signature = 'SE';
              }
            // west
            } else if (lookDirection[0] >= 0 && lookDirection[2] < 0) {
            if (lookDirection[2] >= -0.5){
                signature = 'NW';
              } else {
                signature = 'SW';
              }
            // south
            } else {
            if (lookDirection[2] >= -0.5){
                signature = 'SE';
              } else {
                signature = 'SW';
              }
            }
            return signature;
  }
  moveSignature(signature, speed){
    if (signature == 'NW'){
              this.cube.translate(vec3.fromValues(speed, 0, 0));
              this.state.camera.position[0] += speed;
            } else if (signature == 'NE'){
              this.cube.translate(vec3.fromValues(0, 0, speed));
              this.state.camera.position[2] += speed;
            } else if (signature == 'SE'){
              this.cube.translate(vec3.fromValues(-speed, 0, 0));
              this.state.camera.position[0] -= speed;
            } else {
              this.cube.translate(vec3.fromValues(0, 0, -speed));
              this.state.camera.position[2] -= speed;
            }
  }
  twistSignature(signature){
    if (signature == 'NW'){
      signature = 'NE';
    } else if (signature == 'NE'){
      signature = 'SE';
    } else if (signature == 'SE'){
      signature = 'SS';
    } else {
      signature = 'NW';
    }
    return signature;
  }
  // runs once on startup after the scene loads the objects
  async onStart() {
    console.log("On start");

    /*
    // this just prevents the context menu from popping up when you right click
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    }, false);
    */

      // example - set an object in onStart before starting our render loop!
      
    this.cube = getObject(this.state, "platform");
    this.player = getObject(this.state, "fire");
    const otherCube = getObject(this.state, "cube2"); // we wont save this as instance var since we dont plan on using it in update

    // example - create sphere colliders on our two objects as an example, we give 2 objects colliders otherwise
    // no collision can happen
    this.createSphereCollider(this.cube, 0.5, (otherObject) => {
      console.log(`This is a custom collision of ${otherObject.name}`)
    });
    // this.createSphereCollider(otherCube, 0.5);

    // example - setting up a key press event to move an object in the scene
    document.addEventListener("keypress", (e) => {
      e.preventDefault();
      var speed = 1.0;
      var cam = this.state.camera;
      switch (e.key) {
        case "a":
          if (this.state.firstPerson){
            var lookDirection = vec3.fromValues(cam.front[0], 0.0, cam.front[2]);
            var signature = this.getSignatureM(lookDirection);
            signature = this.twistSignature(signature);
            //console.log(signature);
            this.moveSignature(signature, -speed);
            //vec3.scaleAndAdd(cam.position, cam.position, vec3.normalize(vec3.cross(cam.front, cam.up)), fpsSpeed);
            //this.cube.translate(vec3.fromValues(0,0,fpsSpeed));
          } else{
            this.cube.translate(vec3.fromValues(speed, 0, 0));
            this.player.translate(vec3.fromValues(speed, 0, 0));
          }
          break;

        case "d":
          if (this.state.firstPerson){
            var lookDirection = vec3.fromValues(cam.front[0], 0.0, cam.front[2]);
            var signature = this.getSignatureM(lookDirection);
            signature = this.twistSignature(signature);
            //console.log(signature);
            this.moveSignature(signature, speed);
            //this.state.camera.position[2] -= fpsSpeed;
            //this.cube.translate(vec3.fromValues(0,0,-fpsSpeed));
          } else{
            this.cube.translate(vec3.fromValues(-speed, 0, 0));
            this.player.translate(vec3.fromValues(-speed, 0, 0));
          }
          break;

        case "w":
          //console.log(this);
          if (this.state.firstPerson){
            var lookDirection = vec3.fromValues(cam.front[0], 0.0, cam.front[2]);
            var signature = this.getSignatureM(lookDirection);
            //console.log(signature);
            this.moveSignature(signature, speed);
             //vec3.scaleAndAdd(cam.position, cam.position, vec3.fromValues(cam.front[0], 0.0, cam.front[2]), fpsSpeed);
             //vec3.scaleAndAdd(this.cube.model.position, this.cube.model.position, vec3.fromValues(cam.front[0], 0.0, cam.front[2]), fpsSpeed);
          } else{
            this.cube.translate(vec3.fromValues(0, 0, speed));
            this.player.translate(vec3.fromValues(0, 0, speed));
          }
          
          break;

        case "s":
          if (this.state.firstPerson){
            var lookDirection = vec3.fromValues(cam.front[0], 0.0, cam.front[2]);
            var signature = this.getSignatureM(lookDirection);
            //console.log(signature);
            this.moveSignature(signature, -speed);
            //vec3.scaleAndAdd(cam.position, cam.position, vec3.fromValues(cam.front[0], 0.0, cam.front[2]), -fpsSpeed);
            //vec3.scaleAndAdd(this.cube.model.position, this.cube.model.position, vec3.fromValues(cam.front[0], 0.0, cam.front[2]), -fpsSpeed);
          } else{
            this.cube.translate(vec3.fromValues(0, 0, -speed));
            this.player.translate(vec3.fromValues(0, 0, -speed));
          }
          break;

        case " ":
          this.state.firstPerson = !this.state.firstPerson;
          if (this.state.firstPerson == true){
            this.player.translate(vec3.fromValues(0.0, -10.0, 0.0));
            this.state.camPos = cam.position;
            this.state.camFro = cam.front;

            cam.position = vec3.fromValues(this.cube.model.position[0],this.cube.model.position[1],this.cube.model.position[2]);
            cam.position[1] += 2.0;
            cam.front = vec3.fromValues(-100.0, 0.0, 0.0);
          } else {
            this.player.model.position = vec3.fromValues(this.cube.model.position[0], this.cube.model.position[1], this.cube.model.position[2]);
            cam.position = this.state.camPos;
            cam.front = this.state.camFro;
          }
          cam.lastX = null;
          cam.lastY = null;
          break;
        default:
          break;
      }
    });
    // mouse listener
    document.addEventListener('mousemove', (e) => {
      var cam = this.state.camera;
      // Sensitivity
      var sense = 0.5;
      // first person
      if (this.state.firstPerson){
        // first case
      if (cam.lastX == null && cam.lastY == null){
        cam.lastX = e.clientX;
        cam.lastY = e.clientY;
      }
      // Update
      cam.pitch += (cam.lastY - e.clientY)*sense;
      cam.yaw += (e.clientX - cam.lastX)*sense;
      cam.lastX = e.clientX;
      cam.lastY = e.clientY;

      cam.pitch = Math.max(-89, Math.min(89, cam.pitch));
      var myaw = cam.yaw * Math.PI / 180;
      var mpit = cam.pitch * Math.PI / 180;
      vec3.normalize(cam.front, vec3.fromValues(Math.cos(myaw)*Math.cos(mpit), Math.sin(mpit), Math.sin(myaw)*Math.cos(mpit)));
      } else {
        // first case
        var cPoint = [0, 0, 0];
        var cRad = 10;
        if (cam.lastX == null && cam.lastY == null){
        cam.lastX = e.clientX;
        cam.lastY = e.clientY;
        }
        // Update
      cam.pitch += (cam.lastY - e.clientY)*sense;
      cam.yaw += (e.clientX - cam.lastX)*sense;
      cam.lastX = e.clientX;
      cam.lastY = e.clientY;

      cam.pitch = Math.max(-89, Math.min(0, cam.pitch));
      console.log(cam.pitch);// = Math.max()

      var myaw = cam.yaw * Math.PI / 180;
      var mpit = cam.pitch * Math.PI / 180;
      var rot = vec3.fromValues(Math.cos(myaw)*Math.cos(mpit), Math.sin(mpit), Math.sin(myaw)*Math.cos(mpit));
      vec3.normalize(rot, rot);

      cam.position[0] = cPoint[0] - rot[0] *cRad;
      cam.position[1] = cPoint[1] - rot[1] *cRad;
      cam.position[2] = cPoint[2] - rot[2] *cRad;

      vec3.subtract(cam.front, cPoint, cam.position);
      vec3.normalize(cam.front, cam.front);
      }
      
    });

    this.customMethod(); // calling our custom method! (we could put spawning logic, collision logic etc in there ;) )

    // example: spawn some stuff before the scene starts
    // for (let i = 0; i < 10; i++) {
    //     for (let j = 0; j < 10; j++) {
    //         for (let k = 0; k < 10; k++) {
    //             spawnObject({
    //                 name: `new-Object${i}${j}${k}`,
    //                 type: "cube",
    //                 material: {
    //                     diffuse: randomVec3(0, 1)
    //                 },
    //                 position: vec3.fromValues(4 - i, 5 - j, 10 - k),
    //                 scale: vec3.fromValues(0.5, 0.5, 0.5)
    //             }, this.state);
    //         }
    //     }
    // }

    // example: spawn in objects, set constantRotate to true for them (used below) and give them a collider
    //   for (let i = 0; i < 2; i++) {
    //     let tempObject = await spawnObject({
    //       name: `new-Object${i}`,
    //       type: "cube",
    //       material: {
    //         diffuse: randomVec3(0, 1)
    //       },
    //       position: vec3.fromValues(4 - i, 0, 0),
    //       scale: vec3.fromValues(0.5, 0.5, 0.5)
    //     }, this.state);


    //     tempObject.constantRotate = true;         // lets add a flag so we can access it later
    //     this.spawnedObjects.push(tempObject);     // add these to a spawned objects list
    //     this.collidableObjects.push(tempObject);  // say these can be collided into
    //   }
  }


    // Runs once every frame non stop after the scene loads
  
    onUpdate(deltaTime) {

        this.timeAccumulator += deltaTime;

        //Checking for time passed. Can use this to spawn enemies, though we will need a decreasing variable.
        if (this.timeAccumulator >= 5) {
            //console.log("10 seconds have passed!");
            //this.cube.translate(vec3.fromValues(0, 0, 1.1));

            // Reset the timer
            //this.timeAccumulator = 0;
        }

    // TODO - Here we can add game logic, like moving game objects, detecting collisions, you name it. Examples of functions can be found in sceneFunctions
     

      //console.log(deltaTime);
    // example: Rotate a single object we defined in our start method
      //this.cube.rotate('x', deltaTime * 0.5);

    

    // example: Rotate all objects in the scene marked with a flag
    // this.state.objects.forEach((object) => {
    //   if (object.constantRotate) {
    //     object.rotate('y', deltaTime * 0.5);
    //   }
    // });

    // simulate a collision between the first spawned object and 'cube' 
    // if (this.spawnedObjects[0].collidable) {
    //     this.spawnedObjects[0].onCollide(this.cube);
    // }

    // example: Rotate all the 'spawned' objects in the scene
    // this.spawnedObjects.forEach((object) => {
    //     object.rotate('y', deltaTime * 0.5);
    // });


    // example - call our collision check method on our cube
    // this.checkCollision(this.cube);
  }
}
