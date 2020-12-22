const BOT_STATE = Object.freeze({
  INIT: 1,
  STAY_JOKE: 2,
});

const getJokes = (callback) => {
  firebase
    .database()
    .ref('jokes')
    .once('value')
    .then((snapshot) => {
      callback(snapshot.val());
    });
};

const initJokeBot = (chatboard) => {
  const jokeBotElem = document.createElement('jokeBot');
  jokeBot = {};
  jokeBot.state = BOT_STATE.INIT;

  jokeBot.stateTransit = (keywwords = []) => {
    switch (jokeBot.state) {
      case BOT_STATE.INIT:
        const hasJoke = keywwords.includes('joke');
        const hasKnow = keywwords.includes('know');
        const hasTell = keywwords.includes('tell');
        const hasMe = keywwords.includes('me');

        if (hasJoke || hasKnow || (hasTell && hasMe)) {
          getJokes((jokes) => {
            if (jokes) {
              // if jokes is exist, tell random joke to user
              const joke = jokes[Math.floor(Math.random() * jokes.length)];
              chatbot.publish(joke, bot);
            } else {
              chatboard.publish(
                'I don’t know any jokes yet, but I would love to learn one from you, can you tell me a Knock knock joke?',
                'bot'
              );
              chatbot.state = BOT_STATE.STAY_JOKE;
            }
          });
        } else {
          //TODO: send guidance message
          helpMessage(chatboard);
        }
      case BOT_STATE.STAY_JOKE:
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
