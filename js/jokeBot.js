const BOT_STATE = Object.freeze({
  INIT: 1,
  STAY_BOT_WAIT_USER_WHO: 2,
  STAY_BOT_WAIT_USER_WHO_AGAIN: 3,
  STAY_BOT_TELL_ANOTHER_JOKE: 4,
  STAY_BOT_ASK_USER_JOKE: 5,
  STAY_USER_JOKE_FIRST: 6,
  STAY_USER_JOKE_SECOND: 7,
  STAY_USER_ALLOWS_MOMERIZE: 8,
});

const extractKeyword = (message) => {
  return message.replace(/[,.?]/gi, '').toLowerCase().split(' ');
};

const helpMessage = (chatboard) => {
  chatboard.publish("Sorry, I can't understand you.", 'bot');
};

const appendJoke = (newJoke, callback) => {
  getJokes((jokes) => {
    newHashedKey = btoa(new Joke(newJoke.userAnswer, newJoke.userKick, null));
    const updatedJokes = jokes || {};

    //TODO: if one of jokes contains same hashed id with new joke, replace it.

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
  constructor(userAnswer, userKick, userLike = 0) {
    this.userAnswer = userAnswer;
    this.userKick = userKick;
    this.userLike = userLike;
  }
}

const initJokeBot = (chatboard) => {
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
    const hasMy = keywords.includes('my');
    const hasWant = keywords.includes('want');
    const hasWho = keywords.includes('who');
    const hasThere = keywords.includes('there');
    const hasOk = keywords.includes('ok');
    const hasYes = keywords.includes('yes');
    const hasSure = keywords.includes('sure');
    const hasNo = keywords.includes('no');
    const hasLove = keywords.includes('love');
    const hasLike = keywords.includes('like');

    switch (jokeBot.state) {
      case BOT_STATE.INIT:
        if (hasWant && hasMy && hasJoke) {
          chatboard.publish('Ok, tell me your joke', 'bot');
          jokeBot.state = BOT_STATE.STAY_BOT_ASK_USER_JOKE;
        } else if (hasJoke || hasKnow || (hasTell && hasMe)) {
          getJokes((jokes) => {
            if (jokes) {
              // if jokes is exist, tell random joke to user
              console.log(jokes);
              jokeBot.joke = jokes[Math.floor(Math.random() * jokes.length)];
              console.log(jokeBot.joke);
              chatboard.publish('Ok. I have a funny joke for you :)', 'bot');
              setTimeout(() => {
                chatboard.publish('Let me start.', 'bot');
              }, 1500);
              setTimeout(() => {
                chatboard.publish('Knock, knock!', 'bot');
              }, 3000);
              jokeBot.state = BOT_STATE.STAY_BOT_WAIT_USER_WHO;
            } else {
              chatboard.publish('I don’t know any jokes yet', 'bot');
              setTimeout(() => {
                chatboard.publish(
                  'But I would love to learn one from you :)',
                  'bot'
                );
              }, 1500);
              setTimeout(() => {
                chatboard.publish('Can you tell me a knock knock joke?', 'bot');
              }, 3000);
              jokeBot.state = BOT_STATE.STAY_BOT_ASK_USER_JOKE;
            }
          });
        } else {
          //TODO: send guidance message
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_BOT_WAIT_USER_WHO:
        if (hasWho || hasThere) {
          chatboard.publish(jokeBot.joke.userAnswer, 'bot');
          jokeBot.state = BOT_STATE.STAY_BOT_WAIT_USER_WHO_AGAIN;
        } else {
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_BOT_WAIT_USER_WHO_AGAIN:
        if (hasWho) {
          chatboard.publish(jokeBot.joke.userKick, 'bot');
          setTimeout(() => {
            chatboard.publish("Lol Isn't it funny?", 'bot');
          }, 2000);
          setTimeout(() => {
            chatboard.publish('Do you like it?', 'bot');
          }, 4000);
          jokeBot.state = BOT_STATE.STAY_BOT_TELL_ANOTHER_JOKE;
        } else {
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_BOT_TELL_ANOTHER_JOKE:
        if (hasYes) {
          getJokes((jokes) => {
            jokeBot.joke = jokes[Math.floor(Math.random() * jokes.length)];
            console.log(jokeBot.joke);
            chatboard.publish('Ok, Let me tell you another one.', 'bot');
            setTimeout(() => {
              chatboard.publish('Knock, knock', 'bot');
            }, 1500);
            jokeBot.state = BOT_STATE.STAY_BOT_WAIT_USER_WHO;
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
      case BOT_STATE.STAY_BOT_ASK_USER_JOKE:
        console.log('bot: knock knock');
        if (hasKnock) {
          chatboard.publish("Who's there?", 'bot');
          jokeBot.state = BOT_STATE.STAY_USER_JOKE_FIRST;
        } else {
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_USER_JOKE_FIRST:
        jokeBot.joke.userAnswer = message;
        console.log(jokeBot.joke.userAnswer);
        chatboard.publish(`${message} who?`, 'bot');
        jokeBot.state = BOT_STATE.STAY_USER_JOKE_SECOND;
        break;
      case BOT_STATE.STAY_USER_JOKE_SECOND:
        jokeBot.joke.userKick = message;
        console.log(jokeBot.joke.userKick);
        chatboard.publish('Ha Ha, that’s a good one.', 'bot');
        setTimeout(() => {
          chatboard.publish('Can I use that joke?', 'bot');
        }, 1500);
        setTimeout(() => {
          chatboard.publish('I want to use it later.', 'bot');
        }, 3000);

        jokeBot.state = BOT_STATE.STAY_USER_ALLOWS_MOMERIZE;
        break;
      case BOT_STATE.STAY_USER_ALLOWS_MOMERIZE:
        if (hasOk || hasYes || hasSure) {
          appendJoke(jokeBot.joke, () => {
            console.log(jokeBot.joke);

            chatboard.publish('Thank you ;)', 'bot');
            setTimeout(() => {
              chatboard.publish("Let's talk about more jokes", 'bot');
            }, 1500);

            jokeBot.state = BOT_STATE.INIT;
          });
        } else if (hasNo) {
          chatboard.publish('No problem. But it was so funny ;)', 'bot');
          jokeBot.state = BOT_STATE.INIT;
        } else {
          helpMessage(chatboard);
        }
        break;
      default:
        helpMessage(chatboard);
    }
  };

  jokeBotElem.addEventListener('message', (evt) => {
    jokeBot.stateTransit(evt.detail.message);
  });

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
