import { Canvas } from './canvas.js'

const main = new Canvas();
document.getElementById("clear-canvas-btn").onclick = handleClearBtn;
document.getElementById("predict-btn").onclick = handlePredictBtn;
document.getElementById("train-btn").onclick = handleTrainBtn;
document.getElementById("enable-training-btn").onclick = handleModeBtn;
document.getElementById("start-data-upload-btn").onclick = handleStartDataBtn;
document.getElementById("stop-data-upload-btn").onclick = handleStopDataBtn;

let interval;

function handleClearBtn() {
  main.clearCanvas();
}

function handlePredictBtn() {
  predict();
}

function handleTrainBtn() {
  trainModel();
}

function handleStartDataBtn() {
  let uploads = 0;
  clearInterval(interval);
  interval = setInterval(() => {
    uploadRandomShape();
    uploads++;
    console.log(`Uploaded ${uploads} Data Points`);
  }, 2000);
}

function handleStopDataBtn() {
  clearInterval(interval);
}

function handleModeBtn() {
  document.getElementById("clear-canvas-btn").hidden = true;
  document.getElementById("predict-btn").hidden = true;
  document.getElementById("train-btn").hidden = false;
  document.getElementById("start-data-upload-btn").hidden = false;
  document.getElementById("stop-data-upload-btn").hidden = false;
}

function uploadRandomShape() {
  main.clearCanvas();
  if (Math.random() > 0.5) {
    let radius = Math.floor(Math.random() * (250 - 25 + 1) + 25);
    let x = Math.floor(Math.floor(Math.random() * ((500 - radius) - (radius) + 1) + radius) / 25) * 25;
    let y = Math.floor(Math.floor(Math.random() * ((500 - radius) - (radius) + 1) + radius) / 25) * 25;

    main.ctx.lineWidth = 25;
    main.ctx.strokeStyle = "black";
    main.ctx.beginPath();
    main.ctx.arc(x, y, radius, 0 ,2*Math.PI);
    main.ctx.stroke();

    console.log("circle");
    setTimeout(() => {
      main.uploadCanvasToDatabase("circle");
    }, 1000);
  } else {
    let width = Math.floor((Math.floor(Math.random() * (500 - 25 + 1) + 25)) / 25) * 25;
    let x = Math.floor((Math.floor(Math.random() * ((500 - width) + 1))) / 25) * 25;
    let y = Math.floor((Math.floor(Math.random() * ((500 - width) + 1))) / 25) * 25;

    main.ctx.fillStyle = "black";
    main.ctx.fillRect(x, y, width, width);

    main.ctx.fillStyle = "white";
    main.ctx.fillRect(x+25, y+25, width-50, width-50)

    console.log("square");
    setTimeout(() => {
      main.uploadCanvasToDatabase("square");
    }, 1000);
  }
}

const network = new brain.NeuralNetworkGPU();
network.fromJSON(loadJSON('trained-network.json'));

// getTrainingData() returns a promise object, so this and probably everything else will also need to be async whenever using the training data
async function trainModel() {
  const newNetwork = new brain.NeuralNetworkGPU({
    activation: 'sigmoid',
    hiddenLayers: [800],
    learningRate: 0.01
  });

  const trainingData = [];
  await main.getTrainingData().then(function(data) { trainingData.push(...data) });
  console.log(trainingData);
  console.log("training started");
  
  newNetwork.train(trainingData, {
    iterations: 1e4,
    log: true,
    logPeriod: 100,
    errorThresh: 0.0001
  })

  console.log("training completed")
  const json = newNetwork.toJSON();
  console.log(json);
}

function predict() {
  const output = network.run(main.getCanvasData());
  if (output >= 0.5) {
    alert(`${(output*100).toFixed(2)}% Sure Drawing is a Square`);
  } else {
    alert(`${((1-output)*100).toFixed(2)}% Sure Drawing is a Circle`);
  }
}

function loadTextFileAjaxSync(filePath, mimeType) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  if (mimeType != null) {
    if (xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
  }
  xmlhttp.send();
  if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
    return xmlhttp.responseText;
  }
  else {
    // TODO Throw exception
    return null;
  }
}

function loadJSON(filePath) {
  // Load json file;
  var json = loadTextFileAjaxSync(filePath, "application/json");
  // Parse json
  return JSON.parse(json);
}


async function b() {
  const a = [];
  await main.getTrainingData().then(function(data) { a.push(...data) });
  console.log(a.length + " total data points")

  let k = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i].output[0] === 0) {
      k++;
    }
  }
  console.log(k + " circles");
}
b();
