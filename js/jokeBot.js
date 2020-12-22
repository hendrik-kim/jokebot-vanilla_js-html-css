const BOT_STATE = Object.freeze({
  INIT: 1,
  STAY_BOT_USER_KNOCK: 2,
  STAY_USER_ANSWER: 3,
  STAY_USER_KICK: 4,
  STAY_USER_ALLOWS_MOMERIZE: 5,
  STAY_USER_WHO: 6,
  STAY_BOT_WAIT_USER_WHO: 7,
  STAY_BOT_WAIT_USER_INPUT: 8,
  STAY_USER_ASK_ANOTHER_JOKE: 9,
  STAY_USER_KICK1: 10,
  STAY_USER_KICK2: 11,
  STAY_USER_TELL_JOKE: 12,
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
    const hasMy = keywords.includes('my');
    const hasWant = keywords.includes('want');
    const hasWho = keywords.includes('who');
    const hasThere = keywords.includes('there');
    const hasOk = keywords.includes('ok');
    const hasYes = keywords.includes('yes');
    const hasNo = keywords.includes('no');
    const hasLove = keywords.includes('love');
    const hasLike = keywords.includes('like');

    switch (jokeBot.state) {
      case BOT_STATE.INIT:
        if (hasWant && hasMy && hasJoke) {
          chatboard.publish('Ok, tell me your joke', 'bot');
          jokeBot.state = BOT_STATE.STAY_USER_TELL_JOKE;
        } else if (hasJoke || hasKnow || (hasTell && hasMe)) {
          getJokes((jokes) => {
            if (jokes) {
              // if jokes is exist, tell random joke to user
              console.log(jokes);
              jokeBot.joke = jokes[Math.floor(Math.random() * jokes.length)];
              console.log(jokeBot.joke);
              chatboard.publish('Ok. I have a funny joke for you.', 'bot');
              chatboard.publish('Knock, knock!', 'bot');
              jokeBot.state = BOT_STATE.STAY_USER_WHO;
            } else {
              chatboard.publish(
                'I don’t know any jokes yet, but I would love to learn one from you, can you tell me a Knock knock joke?',
                'bot'
              );
              jokeBot.state = BOT_STATE.STAY_USER_TELL_JOKE;
            }
          });
        } else {
          //TODO: send guidance message
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
          chatboard.publish("Lol Isn't it funny?", 'bot');
          chatboard.publish('Do you like it?', 'bot');
          jokeBot.state = BOT_STATE.STAY_USER_ASK_ANOTHER_JOKE;
        } else {
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_BOT_WAIT_USER_INPUT:
        if (hasLike || hasLove) {
          // TODO: add function to add like bot's joke
          chatboard.publish('Thank you.', 'bot');
          chatboard.publish('Do you want another joke? Then ask me.', 'bot');
          jokeBot.state = BOT_STATE.STAY_USER_ASK_ANOTHER_JOKE;
        } else if (hasNo) {
          chatboard.publish(
            'Ah... Ok :( Then please me tell you a joke another time.',
            'bot'
          );
          jokeBot.state = BOT_STATE.INIT;
        } else {
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_USER_ASK_ANOTHER_JOKE:
        if (hasYes) {
          getJokes((jokes) => {
            jokeBot.joke = jokes[Math.floor(Math.random() * jokes.length)];
            console.log(jokeBot.joke);
            chatboard.publish(
              'Ok, Let me tell you another one. Knock, knock!',
              'bot'
            );
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
      case BOT_STATE.STAY_USER_TELL_JOKE:
        console.log('bot: knock knock');
        if (hasKnock) {
          chatboard.publish("Who's there?", 'bot');
          jokeBot.state = BOT_STATE.STAY_USER_KICK1;
        } else {
          helpMessage(chatboard);
        }
        break;
      case BOT_STATE.STAY_USER_KICK1:
        jokeBot.joke.userAnswer = message;
        console.log(jokeBot.joke.userAnswer);
        chatboard.publish(`${message} who?`, 'bot');
        jokeBot.state = BOT_STATE.STAY_USER_KICK2;
        break;
      case BOT_STATE.STAY_USER_KICK2:
        jokeBot.joke.userKick = message;
        console.log(jokeBot.joke.userKick);
        chatboard.publish('Ha Ha, that’s a good one.', 'bot');
        chatboard.publish('Can I memorize that joke?', 'bot');
        chatboard.publish('I want to use it later.', 'bot');

        jokeBot.state = BOT_STATE.STAY_USER_ALLOWS_MOMERIZE;
        break;
      case BOT_STATE.STAY_USER_ALLOWS_MOMERIZE:
        if (hasOk || hasYes) {
          appendJoke(jokeBot.joke, () => {
            console.log(jokeBot.joke);

            chatboard.publish('Thank you ;)', 'bot');
            chatboard.publish("Let's talk about more jokes", 'bot');

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
        //TODO: send guidance message
        helpMessage(chatboard);
    }
  };

  jokeBotElem.addEventListener('message', (evt) => {
    jokeBot.stateTransit(evt.detail.message);
  });

  const extractKeyword = (message) => {
    return message.replace(/[,.?]/gi, '').split(' ');
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
