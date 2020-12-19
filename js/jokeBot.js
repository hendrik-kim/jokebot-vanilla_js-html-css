const BOT_STATE = Object.freeze({
  INIT: 1,
  STAY: 2,
});

const initJokeBot = () => {
  const jokeBotElem = document.createElement('jokeBot');
  jokeBot = {};
  jokeBot.state = BOT_STATE.INIT;

  jokeBotElem.addEventListener('message', (event) => {
    console.log(event);
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
