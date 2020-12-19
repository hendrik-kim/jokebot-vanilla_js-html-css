var chatList = document.getElementById('chat-board');
var inputBox = document.getElementById('tbx-input');
var sendButton = document.getElementById('btn-send');

// Listen click & enter event

function enterMessage() {
  inputBox.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      sendButton.click();
    }
  });
}

// button for message send
function sendMessage() {
  var message = inputBox.value;
  var date = new Date();

  if (message == '') {
    alert('input box can not be empty');
  } else {
    outputMessages(message);
    inputBox.value = '';
  }
}

// output messages to DOM
function outputMessages(message) {
  var date = new Date();
  var ampm = date.getHours >= 12 ? 'pm' : 'am';
  var newMessage = document.createElement('div');

  // showing time will be changed like Instagram, show time in top of messag group
  var userMeta = document.createElement('span');
  userMeta.setAttribute('class', 'meta');
  userMeta.innerHTML = `Me ${date.getHours()}:${date.getMinutes()} ${ampm}`;

  var userMessage = document.createElement('span');
  userMessage.innerHTML = `${message} `;

  newMessage.appendChild(userMessage);
  newMessage.appendChild(userMeta);

  document.querySelector('.chat-messages').appendChild(newMessage);
}
