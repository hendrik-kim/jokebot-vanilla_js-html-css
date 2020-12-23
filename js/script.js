const init = () => {
  const msgInputElem = document.getElementById('tbx-input');
  const sendChatBtnElem = document.getElementById('btn-send');
  const sendLikeBtnElem = document.getElementById('btn-like');

  window.chatboard = initChatboard();
  window.attendee = initAttendeeSection();
  window.jokeBot = initJokeBot(chatboard);

  sendLike = () => {
    // FIXME: need to check later
    if (jokeBot.joke.jokeId != undefined) {
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
