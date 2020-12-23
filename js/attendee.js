const initAttendeeSection = () => {
  // const attendeeSectionElem = document.getElementById('atd-container');
  // const botMessageElem = document.getElementById('bot-message');
  // const userMessageElem = document.getElementById('user-message');
  // attendeeSection = {};
  // attendeeSectionElem.addEventListener('publish', (evt) => {
  //   const date = new Date();
  //   if (evt.detail.by === 'user') {
  //     const span = document.createElement('span');
  //     const br = document.createElement('br');
  //     span.innerHTML = `<label class="lbl-user-datetime">${date.toLocaleTimeString(
  //       'en-US'
  //     )}</label> User: ${evt.detail.message}`;
  //     userMessageElem.appendChild(span);
  //     userMessageElem.appendChild(br);
  //   } else {
  //     const span = document.createElement('span');
  //     const br = document.createElement('br');
  //     span.innerHTML = `Bot: ${
  //       evt.detail.message
  //     } <label class="lbl-bot-datetime">${date.toLocaleTimeString(
  //       'en-US'
  //     )}</label>`;
  //     botMessageElem.appendChild(span);
  //     botMessageElem.appendChild(br);
  //   }
  // });
  // attendeeSection.publish = (message, by) => {
  //   attendeeSectionElem.dispatchEvent(
  //     new CustomEvent('publish', {
  //       detail: {
  //         by: by,
  //         message: message,
  //       },
  //     })
  //   );
  // };
  // return attendeeSection;
};
