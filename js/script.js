const init = () => {
  const msgInputElem = document.getElementById('tbx-input');
  const sendChatBtnElem = document.getElementById('btn-send');
  const sendLikeBtnElem = document.getElementById('btn-like');

  window.chatboard = initChatboard();
  window.jokeBot = initJokeBot(chatboard);

  sendLike = () => {
    // validate jokeBot but still return error
    if (jokeBot) {
      jokeBot.joke.userLike += 1;
      appendJoke(jokeBot.joke, () => {
        console.log(jokeBot.joke);
      });
    }
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

  sendLikeBtnElem.addEventListener('click', function (evt) {
    evt.preventDefault();
    sendLike();
  });
};

ready(init);
