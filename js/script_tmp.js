const init = () => {
  // console.log('Enter chatroom');

  const chatMsgInput = document.getElementById('tbx-input');
  const sendButton = document.getElementById('btn-send');

  window.chatboard = initChatboard();
  window.jokeBot = initJokeBot();

  sendButton.addEventListener('click', () => {
    const message = chatMsgInput.value;
    chatboard.publish(message, 'user');
    jokeBot.getMessage(chatMsgInput.value);
    chatMsgInput.value = null;
  });
};

init();
