import { FirebaseApp } from './firebase/firebaseApp.js'
import { set, get, ref, onValue, update, push} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js'

class Canvas {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })
    this.firebase = new FirebaseApp();
    this.trainingData;
    this.doDraw = false;
    this.mousePos;
    this.clearCanvas();

    window.addEventListener('mousedown', (event) => {
      this.doDraw = true;
    });

    window.addEventListener('mouseup', (event) => {
      this.doDraw = false;
    });

    window.addEventListener('mousemove', (event) => {
      this.mousePos = { x: event.clientX - window.innerWidth / 2 + canvas.width / 2, y: event.clientY - window.innerHeight / 2 + canvas.width / 2 }
      if (this.doDraw) {
        this.draw();
      }
    });
  }

  draw() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(Math.floor(this.mousePos.x / 25) * 25, Math.floor(this.mousePos.y / 25) * 25, 25, 25)
  }

  getCanvasData() {
    const raw = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let canvasData = []; // just use flattened 2d array, supposedly it will work

    //shittiest code of all time but it works for now its ok
    //Grid is 20x20, each box is 25x25 pixels
    let pixelCounter = 0;
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (raw.data[pixelCounter] === 0) {
          canvasData.push(1);
        } else {
          canvasData.push(0);
        }
        // console.log(raw.data[pixelCounter], raw.data[pixelCounter + 1], raw.data[pixelCounter + 2], raw.data[pixelCounter + 3])
        pixelCounter += 25 * 4;
      }

      pixelCounter += 500 * 25 * 4; // wtf is this abomination of mathematical operations
    }

    return canvasData;
  }

  uploadCanvasToDatabase(category) {
    let output;
    if (category === "square") {
      output = 1;
    } else {
      output = 0;
    }

    const canvasData = this.getCanvasData();

    let counter1 = 0;
    for(let i = 0; i < 20; i++){
      let line1 = ""
      for(let j = 0; j < 20; j++){
        line1 += canvasData[counter1];
        counter1++;
      }
      console.log(line1)
    }
    
    // prep data object to be pushed to db
    const dataObj = {
      input: canvasData,
      output: [output]
    }
    this.pushDB(dataObj);

    this.clearCanvas();
  }

  pushDB(dataObj) {
    const trainingDataRef = ref(this.firebase.db, "trainingData"); // get reference object from database (will create if DNE)

    const newDataRef = push(trainingDataRef); // create new key for data node (the keys are random bc firebase stores everything as key/val pairs)
    set(newDataRef, dataObj) // set new data node value to obj data
  }

  // need to use async for method bc javascript will just return data = undefined otherwise
  async getTrainingData() {
    try {
      const snapshot = await get(ref(this.firebase.db, "trainingData"));
      const data = Object.values(snapshot.val());

      if (data) {
        return data;
      } else {
        throw new Error("No training data found on database");
      }
    } catch (err) {
      throw new Error(`Error getting training data from database: ${err}`);
    }
  }
  
  clearCanvas() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

export { Canvas }
