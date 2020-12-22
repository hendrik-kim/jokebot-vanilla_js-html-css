const initChatboard = () => {
  const chatboardElem = document.getElementById('chat-board');
  chatboard = {};

  chatboardElem.addEventListener('publish', (evt) => {
    const chatMsgInput = document.getElementById('tbx-input');
    const date = new Date();

    if (evt.detail.by === 'user') {
      const span = document.createElement('span');
      const br = document.createElement('br');
      span.innerHTML = `<label class="lbl-user-datetime">${date.toLocaleTimeString(
        'en-US'
      )}</label> User: ${evt.detail.message}`;
      chatboardElem.appendChild(span);
      chatboardElem.appendChild(br);
    } else {
      setTimeout(() => {
        // console.log('Bot in');
        const span = document.createElement('span');
        const br = document.createElement('br');
        span.innerHTML = `Bot: ${
          evt.detail.message
        } <label class="lbl-bot-datetime">${date.toLocaleTimeString(
          'en-US'
        )}</label>`;
        chatboardElem.appendChild(span);
        chatboardElem.appendChild(br);
        // FIXME: need to be synchronized
      }, 1000);
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
