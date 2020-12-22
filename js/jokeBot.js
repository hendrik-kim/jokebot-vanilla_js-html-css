const BOT_STATE = Object.freeze({
  INIT: 1,
  STAY_KNOCK_KNOCK: 2,
  STAY_USER_ANSWER: 3,
  STAY_USER_KICK: 4,
  STAY_BOT_TURN: 5,
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
class Joke {
  constructor(userAnswer, userKick, userLike) {
    this.userAnswer = userAnswer;
    this.userKick = userKick;
    this.userLike = userLike;
  }
}

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
              chatbot.state = BOT_STATE.STAY_KNOCK_KNOCK;
            }
          });
        } else {
          //TODO: send guidance message
          helpMessage(chatboard);
        }
      case BOT_STATE.STAY_KNOCK_KNOCK:
        if (hasKnock) {
          chatboard.publish("Who's there?", 'bot');
          chatbot.state = BOT_STATE.STAY_USER_ANSWER;
        } else {
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_USER_ANSWER:
        break;
      case BOT_STATE.STAY_USER_KICK:
        break;
      case BOT_STATE.STAY_BOT_TURN:
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
    return message.replace(/[,.]/gi, '').split(' ');
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
