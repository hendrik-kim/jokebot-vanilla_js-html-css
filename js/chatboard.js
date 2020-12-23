const initChatboard = () => {
  const chatboardElem = document.getElementById('chat-board');
  const attendeeSectionElem = document.getElementById('atd-container');
  const botMessageElem = document.getElementById('bot-message');
  const userMessageElem = document.getElementById('user-message');

  chatboard = {};
  attendeeSection = {};

  chatboardElem.addEventListener('publish', (evt) => {
    const date = new Date();

    if (evt.detail.by === 'user') {
      const span = document.createElement('div');
      const br = document.createElement('br');
      span.innerHTML = `<label class="lbl-user-datetime">${date.toLocaleTimeString(
        'en-US'
      )}</label> <span class="lbl-user-message">${evt.detail.message}</span>`;
      chatboardElem.appendChild(span);
      userMessageElem.innerHTML = evt.detail.message;
      // userMessageElem.appendChild(br);
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
        botMessageElem.innerHTML = evt.detail.message;
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
