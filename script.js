const firebaseConfig = {
  apiKey: "AIzaSyD5R32C9jlXB-MuzKW1hmHH1mHr4Nun7Iw",
  authDomain: "wheel-spinner-ffb00.firebaseapp.com",
  projectId: "wheel-spinner-ffb00",
  storageBucket: "wheel-spinner-ffb00.firebasestorage.app",
  messagingSenderId: "86872222259",
  appId: "1:86872222259:web:e94287c8a1439d9feb5146",
  measurementId: "G-3WSDN5BKN7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const resultText = document.getElementById("result");
const classListInput = document.getElementById("classList");
const saveClassButton = document.getElementById("saveClass");
const loadClassButton = document.getElementById("loadClass");
const homeworkSelect = document.getElementById("homeworkOptions");
const assignHomeworkButton = document.getElementById("assignHomework");
const homeworkResult = document.getElementById("homeworkResult");

// Wheel Data
const roles = ["King", "Noble", "Knight", "Peasant", "Peasant", "Peasant", "Peasant"];
let angle = 0;
let spinning = false;

function drawWheel() {
    const sliceAngle = (2 * Math.PI) / roles.length;
    for (let i = 0; i < roles.length; i++) {
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, sliceAngle * i, sliceAngle * (i + 1));
        ctx.fillStyle = i % 2 === 0 ? "#ff79c6" : "#bd93f9";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#282a36";
        ctx.font = "16px Arial";
        ctx.fillText(roles[i], 180 + 100 * Math.cos(sliceAngle * (i + 0.5)), 200 + 100 * Math.sin(sliceAngle * (i + 0.5)));
    }
}

drawWheel();

// Spin the Wheel
spinButton.addEventListener("click", () => {
    if (spinning) return;
    spinning = true;
    let spins = Math.random() * 360 + 1080;
    let spinTime = 2000;
    let start = Date.now();

    function animate() {
        let now = Date.now();
        let progress = (now - start) / spinTime;
        if (progress < 1) {
            angle = (spins * progress) % 360;
            ctx.clearRect(0, 0, 400, 400);
            ctx.save();
            ctx.translate(200, 200);
            ctx.rotate((angle * Math.PI) / 180);
            ctx.translate(-200, -200);
            drawWheel();
            ctx.restore();
            requestAnimationFrame(animate);
        } else {
            let selected = roles[Math.floor(((360 - angle) / (360 / roles.length)) % roles.length)];
            resultText.textContent = `Role: ${selected}`;
            spinning = false;
        }
    }
    animate();
});

// Save Class List to Firebase
saveClassButton.addEventListener("click", () => {
    let students = classListInput.value.split("\n").filter(s => s.trim() !== "");
    
    db.collection("classes").doc("class1").set({ students })
    .then(() => {
        alert("Class list saved!");
    }).catch(error => {
        console.error("Error saving class list: ", error);
    });
});

// Load Class List from Firebase
loadClassButton.addEventListener("click", () => {
    db.collection("classes").doc("class1").get()
    .then(doc => {
        if (doc.exists) {
            classListInput.value = doc.data().students.join("\n");
        } else {
            alert("No class list found!");
        }
    }).catch(error => {
        console.error("Error loading class list: ", error);
    });
});

// Assign Homework to Firebase
assignHomeworkButton.addEventListener("click", () => {
    let selectedHomework = homeworkSelect.value;
    
    db.collection("classes").doc("class1").update({
        homework: selectedHomework
    }).then(() => {
        homeworkResult.textContent = `Assigned: ${selectedHomework}`;
    }).catch(error => {
        console.error("Error assigning homework: ", error);
    });
});
