// Your Firebase config here
var firebaseConfig = {
  apiKey: "AIzaSyBMfAD-GfTSkA68bKhaudlUBED-YHEnmUg",
  authDomain: "chithub-c38d1.firebaseapp.com",
  databaseURL: "https://chithub-c38d1-default-rtdb.firebaseio.com",
  projectId: "chithub-c38d1",
  storageBucket: "chithub-c38d1.firebasestorage.app",
  messagingSenderId: "137485686225",
  appId: "1:137485686225:web:a0a889394d00353caffcf0"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;

document.getElementById("googleSignInBtn").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
    currentUser = result.user;
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("chatScreen").style.display = "block";
    listenForMessages();
  }).catch((err) => {
    alert("Error signing in: " + err.message);
  });
});

document.getElementById("sendBtn").addEventListener("click", () => {
  const msg = document.getElementById("messageInput").value;
  if (msg && currentUser) {
    db.ref("messages").push({
      text: msg,
      uid: currentUser.uid,
      name: currentUser.displayName
    });
    document.getElementById("messageInput").value = "";
  }
});

function listenForMessages() {
  db.ref("messages").on("value", (snapshot) => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";
    snapshot.forEach((msgSnapshot) => {
      const msg = msgSnapshot.val();
      const msgDiv = document.createElement("div");
      msgDiv.classList.add("message");
      msgDiv.textContent = `${msg.name}: ${msg.text}`;
      if (msg.uid === currentUser.uid) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.style.marginLeft = "10px";
        delBtn.onclick = () => {
          db.ref("messages/" + msgSnapshot.key).remove();
        };
        msgDiv.appendChild(delBtn);
      }
      messagesDiv.appendChild(msgDiv);
    });
  });
}