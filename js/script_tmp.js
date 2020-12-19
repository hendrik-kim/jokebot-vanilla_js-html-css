const init = () => {
  // console.log('Enter chatroom');

  const inputText = document.getElementById('tbx-input');
  const sendButton = document.getElementById('btn-send');

  window.chatboard = initChatboard();

  sendButton.addEventListener('click', () => {
    const message = inputText.value;
    chatboard.publish(message, 'User');
  });
};

init();
