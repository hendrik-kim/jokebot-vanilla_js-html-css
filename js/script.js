const init = () => {
  const msgInputElem = document.getElementById('tbx-input');
  const sendBtnElem = document.getElementById('btn-send');
  const likeBtnElem = document.getElementById('btn-like');

  window.chatboard = initChatboard();
  window.jokeBot = initjokeBot(chatboard);

  likeBtnElem.addEventListener('click', (evt) => {
    console.log('like');
  });

  sendChat = () => {
    const message = msgInputElem.value;
    if (message) {
      chatboard.publish(message, 'user');
      jokeBot.getMessage(message);
      msgInputElem.value = null;
    }
  };

  sendBtnElem.addEventListener('click', () => {
    sendChat();
  });

  msgInputElem.addEventListener('keypress', function (evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      sendChat();
    }
  });
};

ready(init);
