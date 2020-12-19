const initChatboard = () => {
  const chatboardElem = document.getElementById('chat-board');
  chatboard = {};

  chatboardElem.addEventListener('publish', (event) => {
    const chatMsgInput = document.getElementById('tbx-input');

    if (event.detail.by === 'user') {
      const span = document.createElement('span');
      const br = document.createElement('br');
      span.innerHTML = `User: ${event.detail.message} -> Bot (${new Date()})`;
      chatboardElem.appendChild(span);
      chatboardElem.appendChild(br);
    } else {
      console.log('Bot in');
      chatMsgInput.disabled = false;
    }
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
};
