const initChatboard = () => {
  const chatboardElem = document.getElementById('chat-board');
  const botMessageElem = document.getElementById('bot-message');
  const userMessageElem = document.getElementById('user-message');

  chatboard = {};
  attendeeSection = {};

  chatboardElem.addEventListener('publish', (evt) => {
    const date = new Date();

    if (evt.detail.by === 'user') {
      const div = document.createElement('div');
      const br = document.createElement('br');
      div.className = 'message-wrapper';

      div.innerHTML = `
      <div class="user-message">
        <div class="date-message-wrapper">
          <label class="chat-datetime">${date.toLocaleTimeString(
            'en-US'
          )}</label>
        </div>
        <div class="message">
          ${evt.detail.message}
        </div>
      </div>
      `;
      chatboardElem.appendChild(div);
      chatboardElem.appendChild(br);

      userMessageElem.innerHTML =
        evt.detail.message.length > 5
          ? date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            }) +
            '·' +
            evt.detail.message.substr(0, 3) +
            '...'
          : date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            }) +
            '·' +
            evt.detail.message;
      // userMessageElem.appendChild(br);
      chatboardElem.appendChild(br);
    } else {
      setTimeout(() => {
        const div = document.createElement('div');
        const br = document.createElement('br');
        div.innerHTML = `
          <div class="bot-message">
          <div class="date-message-wrapper">
            <lable class="chat-datetime">${date.toLocaleTimeString(
              'en-US'
            )}</lable>
          </div>
          <div class="message">
            ${evt.detail.message}
          </div>
          <img class="chat-img" src="/img/spongebobjfif.jfif">
        </div>
        `;

        chatboardElem.appendChild(div);
        chatboardElem.appendChild(br);
        botMessageElem.innerHTML =
          evt.detail.message.length > 5
            ? date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              }) +
              '·' +
              evt.detail.message.substr(0, 3) +
              '...'
            : date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              }) +
              '·' +
              evt.detail.message;
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
    chatboardElem.scrollTo(0, chatboardElem.scrollHeight + 10);
  };

  return chatboard;
};
