const init = () => {
  const msgInputElem = document.getElementById('tbx-input');
  const sendChatBtnElem = document.getElementById('btn-send');
  const sendLikeBtnElem = document.getElementById('btn-like');
  // const chatboardElem = document.getElementById('chat-board');

  window.chatboard = initChatboard();
  window.jokeBot = initJokeBot(chatboard);

  sendLike = () => {
    if (jokeBot.joke.jokeId != undefined) {
      jokeBot.joke.userLike += 1;
      appendJoke(jokeBot.joke, () => {});

      // const last = chatboardElem.children[chatboardElem.children.length - 2];
      // console.log(last.textContent);
      // if (last.tagName === 'LABEL' && last.textContent.startsWith('Bot')) {
      chatboard.publish('❤️', 'user');
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
