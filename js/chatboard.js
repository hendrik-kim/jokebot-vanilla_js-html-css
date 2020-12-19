const initChatboard = () => {
  const chatboardElem = document.getElementById('chat-board');
  chatboard = {};

  //TODO: get input text value
  chatboardElem.addEventListener('publish', (e) => {
    console.log(e);
  });

  chatboard.publish = (message, by) => {
    chatboardElem.dispatchEvent(
      new CustomEvent('publish', {
        detail: {
          by: by,
          message: message,
        },
      })
    );
  };

  return chatboard;

  //TODO: render in DOM
};
