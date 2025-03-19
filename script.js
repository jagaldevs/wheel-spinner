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

// Firebase setup
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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

// Save Class List
saveClassButton.addEventListener("click", () => {
    let students = classListInput.value.split("\n").filter(s => s.trim() !== "");
    db.collection("classes").doc("class1").set({ students }).then(() => {
        alert("Class saved!");
    });
});

// Load Class List
loadClassButton.addEventListener("click", () => {
    db.collection("classes").doc("class1").get().then(doc => {
        if (doc.exists) {
            classListInput.value = doc.data().students.join("\n");
        }
    });
});

// Assign Homework
assignHomeworkButton.addEventListener("click", () => {
    let selectedHomework = homeworkSelect.value;
    db.collection("classes").doc("class1").update({
        homework: selectedHomework
    }).then(() => {
        homeworkResult.textContent = `Assigned: ${selectedHomework}`;
    });
});
