const BOT_STATE = Object.freeze({
  INIT: 1,
  STAY_KNOCK_KNOCK: 2,
  STAY_USER_ANSWER: 3,
  STAY_USER_KICK: 4,
  STAY_BOT_TURN: 5,
  STAY_USER_WHO: 6,
  STAY_BOT_WAIT_USER_WHO: 7,
  STAY_USER_ASK_ANOTHER_JOKE: 8,
});

const appendJoke = (joke, callback) => {
  getJokes((jokes) => {
    const updatedJokes = jokes || [];
    updatedJokes.push(joke);

    firebase
      .database()
      .ref('jokes')
      .set(updatedJokes, (error) => {
        if (error) {
          console.error(error);
        } else {
          callback(updatedJokes);
        }
      });
  });
};

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
  constructor(userAnswer, userKick) {
    this.userAnswer = userAnswer;
    this.userKick = userKick;
    // this.userLike = userLike;
  }
}

const initjokeBot = (chatboard) => {
  const jokeBotElem = document.createElement('jokeBot');
  jokeBot = {};
  jokeBot.state = BOT_STATE.INIT;
  jokeBot.joke = new Joke();

  /* keyword -> message change
   Bot need to get whole message from user not keyword.
   prevent to lose user's message
   decoupling from extractKeyword*/
  jokeBot.stateTransit = (message) => {
    const keywords = extractKeyword(message);
    const hasJoke = keywords.includes('joke');
    const hasKnow = keywords.includes('know');
    const hasTell = keywords.includes('tell');
    const hasMe = keywords.includes('me');
    const hasKnock = keywords.includes('knock');
    const hasYour = keywords.includes('your');
    const hasTurn = keywords.includes('turn');
    const hasWant = keywords.includes('want');
    const hasHear = keywords.includes('hear');
    const hasWho = keywords.includes('who');
    const hasThere = keywords.includes('there');
    const hasOk = keywords.includes('ok');
    const hasYes = keywords.includes('yes');
    const hasNo = keywords.includes('no');

    switch (jokeBot.state) {
      case BOT_STATE.INIT:
        if (hasJoke || hasKnow || (hasTell && hasMe)) {
          getJokes((jokes) => {
            if (jokes) {
              // if jokes is exist, tell random joke to user
              jokeBot.joke = jokes[Math.floor(Math.random() * jokes.length)];
              chatboard.publish('Ok. I have a funny joke for you.', 'bot');
              chatboard.publish('Knock, knock!', 'bot');
              jokeBot.state = BOT_STATE.STAY_USER_WHO;
            } else {
              chatboard.publish(
                'I don’t know any jokes yet, but I would love to learn one from you, can you tell me a Knock knock joke?',
                'bot'
              );
              jokeBot.state = BOT_STATE.STAY_KNOCK_KNOCK;
            }
          });
        } else {
          //TODO: send guidance message
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_KNOCK_KNOCK:
        if (hasKnock) {
          chatboard.publish("Who's there?", 'bot');
          jokeBot.state = BOT_STATE.STAY_USER_ANSWER;
        } else {
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_USER_ANSWER:
        jokeBot.joke.userAnswer = message;
        chatboard.publish(`${message} who?`, 'bot');
        jokeBot.state = BOT_STATE.STAY_USER_KICK;
        break;
      case BOT_STATE.STAY_USER_KICK:
        jokeBot.joke.userKick = message;
        appendJoke(jokeBot.joke, (jokes) => {
          console.log(jokeBot.joke);
          const joke = jokes[Math.floor(Math.random() * jokes.length)];
          jokeBot.joke = joke;
          chatboard.publish(`Ha Ha, that's good one.`, 'bot');
          chatboard.publish(`Now I know new joke`, 'bot');
          chatboard.publish(`Let's talk about more jokes ;)`, 'bot');
          jokeBot.state = BOT_STATE.INIT;
        });
        break;
      case BOT_STATE.STAY_BOT_TURN:
        if (hasYour || hasTurn || hasWant || hasHear || hasJoke || hasOk) {
          appendJoke(jokeBot.joke, (jokes) => {
            console.log(jokeBot.joke);
            const joke = jokes[Math.floor(Math.random() * jokes.length)];
            jokeBot.joke = joke;

            chatboard.publish('Knock, knock', 'bot');

            jokeBot.state = BOT_STATE.STAY_USER_WHO;
          });
        } else if (hasNo) {
          chatboard.publish(
            'No problem. Ask me anytime to tell you my jokes ;)',
            'bot'
          );
          jokeBot.state = BOT_STATE.INIT;
        } else {
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_USER_WHO:
        if (hasWho || hasThere) {
          chatboard.publish(jokeBot.joke.userAnswer, 'bot');
          jokeBot.state = BOT_STATE.STAY_BOT_WAIT_USER_WHO;
        } else {
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_BOT_WAIT_USER_WHO:
        if (hasWho) {
          chatboard.publish(jokeBot.joke.userKick, 'bot');
          chatboard.publish('How was it? Do you like it?', 'bot');
          jokeBot.state = BOT_STATE.STAY_USER_ASK_ANOTHER_JOKE;
        } else {
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_USER_ASK_ANOTHER_JOKE:
        if (hasYes) {
          // TODO: add function to add like bot's joke
          chatboard.publish('Ok, Let me tell you again. Knock, knock!', 'bot');
          jokeBot.state = BOT_STATE.STAY_USER_WHO;
        } else if (hasNo) {
          chatboard.publish(
            'No problem. Ask me anytime to tell you my jokes ;)',
            'bot'
          );
          jokeBot.state = BOT_STATE.INIT;
        } else {
          helpMessage(chatboard);
        }
        break;
      default:
        //TODO: send guidance message
        helpMessage(chatboard);
    }
  };

  jokeBotElem.addEventListener('message', (evt) => {
    jokeBot.stateTransit(evt.detail.message);
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
