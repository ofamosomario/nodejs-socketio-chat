const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// GET USER NAME FROM URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// JOIN CHATROOM
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers' , ({room, users}) =>{
  outputRoomName(room);
  outputUsers(users);
})

socket.on('message' , message => {
  outputMessage(message);

  // Scroll Down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit' , (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage' , msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

// OutPut Message to Dom
function outputMessage(message) {

  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = 
  `
    <div class="d-flex justify-content-start mb-4">
      <div class="img_cont_msg">
        <img src="https://image.flaticon.com/icons/png/128/3135/3135715.png" class="rounded-circle user_img_msg">
      </div>
      <div class="d-flex justify-content-start mb-4">
        <div class="msg_cotainer">
          ${message.username} - ${message.text}
          <span class="msg_time">${message.time}</span>
        </div>
      </div>
    </div>
  `;

  document.querySelector('.chat-messages').appendChild(div);

}

function outputRoomName(room){
  roomName.innerText = room;
}

function outputUsers(users){
  userList.innerHTML = `
    ${users.map(user => `
              <li>
                <div class="d-flex bd-highlight">
                  <div class="img_cont">
                    <img src="https://image.flaticon.com/icons/png/128/3135/3135715.png"
                      class="rounded-circle user_img">
                  </div>
                  <div class="user_info">
                    ${user.username}
                  </div>
                </div>
              </li>
    `).join('')}
  `;
}