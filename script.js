const chatBox = document.getElementById("chatBox");

function sendMessage() {
  const username = document.getElementById("username").value.trim();
  const message = document.getElementById("messageInput").value.trim();

  if (!username || !message) return;

  firebase.database().ref("messages").push({
    name: username,
    message: message
  });

  document.getElementById("messageInput").value = "";
}

// Real-time listener for new messages
firebase.database().ref("messages").on("child_added", function(snapshot) {
  const msg = snapshot.val();
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message");
  msgDiv.innerHTML = `<strong>${msg.name}:</strong> ${msg.message}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});
