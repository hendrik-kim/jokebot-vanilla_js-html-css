const init = () => {
  const msgInputElem = document.getElementById('tbx-input');
  const sendChatBtnElem = document.getElementById('btn-send');
  const sendLikeBtnElem = document.getElementById('btn-like');

  window.chatboard = initChatboard();
  window.jokeBot = initjokeBot(chatboard);

  sendLikeBtnElem.addEventListener('click', (evt) => {
    sendLike();
  });

  sendLike = () => {
    const joke = jokeBot.joke;
    joke.userLike += 1;
    console.log(joke);
  };

  sendChat = () => {
    const message = msgInputElem.value;
    if (message) {
      chatboard.publish(message, 'user');
      jokeBot.getMessage(message);
      msgInputElem.value = null;
    }
  };

  sendChatBtnElem.addEventListener('click', () => {
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
