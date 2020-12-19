const init = () => {
  // console.log('Enter chatroom');

  const inputText = document.getElementById('tbx-input');
  const sendButton = document.getElementById('btn-send');

  sendButton.addEventListener('click', () => {
    const message = inputText.value;
    sendMessage(message);
    inputText.value = '';
  });
};

function sendMessage(message) {
  if (message == '') {
    alert('input box can not be empty');
  } else {
    console.log(message);
  }
}

init();
