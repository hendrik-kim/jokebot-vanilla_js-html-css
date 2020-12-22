const init = () => {
  // console.log('Enter chatroom');

  const msgInputElem = document.getElementById('tbx-input');
  const sendBtnElem = document.getElementById('btn-send');

  window.chatboard = initChatboard();
  window.jokeBot = initjokeBot(chatboard);

  sendChat = () => {
    const message = msgInputElem.value;
    chatboard.publish(message, 'user');
    jokeBot.getMessage(message);
    msgInputElem.value = null;
  };

  sendBtnElem.addEventListener('click', () => {
    sendChat();
  });

  msgInputElem.addEventListener('keyup', function (evt) {
    if (evt.keyCode === 13) {
      evt.preventDefault();
      sendChat();
    }
  });
};

ready(init);
