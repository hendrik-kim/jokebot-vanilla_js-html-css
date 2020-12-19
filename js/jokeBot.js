const BOT_STATE = Object.freeze({
  INIT: 1,
  STAY: 2,
});

//TODO: get jokes from snapshot

const initJokeBot = (chatboard) => {
  const jokeBotElem = document.createElement('jokeBot');
  jokeBot = {};
  jokeBot.state = BOT_STATE.INIT;

  jokeBot.stateTransit = (keywwords = []) => {
    switch (jokeBot.state) {
      case BOT_STATE.INIT:
        const hasJoke = keywwords.includes('joke');
        const hasTell = keywwords.includes('tell');
        const hasMe = keywwords.includes('me');

        if (hasJoke || (hasTell && hasMe)) {
          console.log(keywwords);
          console.log('Ok, give me a shot!');
        } else {
          //TODO: send guidance message
          helpMessage(chatboard);
        }
      case BOT_STATE.STAY:
        break;
      default:
        //TODO: send guidance message
        helpMessage(chatboard);
    }
  };

  jokeBotElem.addEventListener('message', (event) => {
    const keywwords = extractKeyword(event.detail.message);
    jokeBot.stateTransit(keywwords);
  });

  const extractKeyword = (message) => {
    return message.split(' ');
  };

  const helpMessage = (chatboard) => {
    chatboard.publish("Sorry, I can't understand you.", 'bot');
  };

  jokeBot.getMessage = (message) => {
    jokeBotElem.dispatchEvent(
      new CustomEvent('message', {
        detail: {
          message: message,
        },
      })
    );
    jokeBotElem.value = null;
  };

  return jokeBot;
};
