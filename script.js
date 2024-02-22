const video = document.getElementById("video");

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(startWebcam);

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}

function getLabeledFaceDescriptions() {
  const labels = ["Vikas", "Messi", "Data"];
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./labels/${label}/${i}.png`);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
          if (detections) {
            descriptions.push(detections.descriptor);
          } else {
            console.log(`No face detected in ${label}/${i}.png`);
          }
        }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}

video.addEventListener("play", async () => {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  const unknownFaceThreshold = 0.3; // Adjust this threshold as needed

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    const results = resizedDetections.map((d) => {
      const match = faceMatcher.findBestMatch(d.descriptor);
      // if (match._label === "unknown" && match._distance > unknownFaceThreshold) {
      //   // Display an alert for unknown faces with confidence below the threshold
      //   alert("Unknown face detected!");
      //   window.location.href = "http://127.0.0.1:5500/error.html";
      // }
      // else {
      //   window.location.href = "http://127.0.0.1:5500/end.html";
      // }
      return match;
    });

    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result.toString(),
      });
      drawBox.draw(canvas);
    });

  }, 1000);
});

// video.addEventListener("play", async () => {
//   const labeledFaceDescriptors = await getLabeledFaceDescriptions();
//   const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

//   const canvas = faceapi.createCanvasFromMedia(video);
//   document.body.append(canvas);

//   // Position the canvas to overlay on top of the video
//   canvas.style.position = 'absolute';
//   canvas.style.top = `${video.offsetTop}px`; // Adjust for video offset
//   canvas.style.right = `${video.offsetLeft}px`; // Adjust for video offset

//   const displaySize = { width: video.width, height: video.height };
//   faceapi.matchDimensions(canvas, displaySize);

//   const unknownFaceThreshold = 0.3;

//   setInterval(async () => {
//     const detections = await faceapi
//       .detectAllFaces(video)
//       .withFaceLandmarks()
//       .withFaceDescriptors();

//     const resizedDetections = faceapi.resizeResults(detections, displaySize);

//     canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

//     const results = resizedDetections.map((d) => {
//       const match = faceMatcher.findBestMatch(d.descriptor);
//       return match;
//     });

//     results.forEach((result, i) => {
//       const box = resizedDetections[i].detection.box;

//       const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });

//       drawBox.draw(canvas);
//     });
//   }, 1000);
// });
