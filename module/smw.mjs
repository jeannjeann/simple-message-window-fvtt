// module/smw.mjs

// flags
let isReady = false;
let isTyping = false;
let messageQueue = [];

Hooks.once("init", () => {
  const chatOverlay = document.createElement("div");
  chatOverlay.id = "smw-chat-overlay";
  document.body.appendChild(chatOverlay);

  const portraitOverlay = document.createElement("div");
  portraitOverlay.id = "smw-portrait-overlay";
  portraitOverlay.innerHTML = `<img src="" alt="アバター画像">`;
  document.body.appendChild(portraitOverlay);
});

Hooks.once("ready", () => {
  isReady = true;
});

Hooks.on("canvasReady", () => {
  window.addEventListener("resize", adjustOverlaySize);
});

Hooks.on("renderChatMessage", async (message, html, data) => {
  if (!isReady) return;

  messageQueue.push(message);

  if (!isTyping) {
    showMessage();
  }
});

// set window size
function adjustOverlaySize() {
  const chatOverlay = document.getElementById("smw-chat-overlay");
  const portraitOverlay = document.getElementById("smw-portrait-overlay");
  if (!chatOverlay) return;

  const board = document.getElementById("board");
  const sidebar = document.getElementById("sidebar");

  if (board && sidebar && chatOverlay) {
    const boardWidth = board.offsetWidth;
    const sidebarWidth = sidebar.offsetWidth;
    const overlayWidth = boardWidth - sidebarWidth;

    const chatWidth = overlayWidth * 0.7;
    const chatHeight = overlayWidth * 0.15;
    const chatLeft = overlayWidth / 2;
    const chatBottom =
      parseFloat(window.getComputedStyle(chatOverlay).bottom) || 0;

    chatOverlay.style.width = `${chatWidth}px`;
    chatOverlay.style.height = `${chatHeight}px`;
    chatOverlay.style.left = `${chatLeft}px`;

    const overlayHeight = chatOverlay.offsetHeight;
    const headerHeight =
      chatOverlay.querySelector(".smw-header")?.offsetHeight || 0;
    const messageElement = chatOverlay.querySelector(".smw-message");
    if (messageElement) {
      const contentHeight = overlayHeight - headerHeight - 20;
      messageElement.style.maxHeight = `${contentHeight}px`;
    }

    const portraitHeigt = chatHeight;
    const portraitWidth = chatHeight;
    const portraitLeft = chatLeft - chatWidth / 2 + portraitWidth / 2 + 10;
    const portraitBottom = chatBottom + chatHeight;

    portraitOverlay.style.height = `${portraitHeigt}px`;
    portraitOverlay.style.width = `${portraitWidth}px`;
    portraitOverlay.style.left = `${portraitLeft}px`;
    portraitOverlay.style.bottom = `${portraitBottom}px`;
  }
}

// show message text
async function showMessage() {
  if (messageQueue.length == 0) return;
  isTyping = true;

  const chatOverlay = document.getElementById("smw-chat-overlay");
  const portraitOverlay = document.getElementById("smw-portrait-overlay");
  if (!chatOverlay) return;

  const message = messageQueue.shift();
  const speaker = message.alias;
  const content = message.content;
  const actor = game.actors?.get(message.speaker.actor) || null;
  const token = game.tokens?.get(message.speaker.token) || null;
  const characterImg = actor?.img;
  const playerImg = message.user.avatar;
  const textspeed = 80;

  const window = await renderTemplate(
    "modules/simple-message-window/templates/smw.hbs",
    {
      speaker: speaker,
      message: "",
    }
  );

  chatOverlay.innerHTML = window;
  if (characterImg) {
    portraitOverlay.querySelector("img").src = characterImg;
  } else {
    portraitOverlay.querySelector("img").src = playerImg;
  }

  chatOverlay.style.display = "block";
  portraitOverlay.style.display = "block";
  adjustOverlaySize();

  let skip = false;
  animateText(
    chatOverlay.querySelector(".smw-message"),
    content,
    textspeed,
    () => skip
  );

  // button hook
  chatOverlay.querySelector("#skip-message").addEventListener("click", () => {
    skip = true;
  });
  chatOverlay.querySelector("#close-overlay").addEventListener("click", () => {
    chatOverlay.style.display = "none";
    portraitOverlay.style.display = "none";
  });

  // window timeout
  let timeout = null;
  if (timeout) {
    setTimeout(() => {
      chatOverlay.style.display = "none";
      portraitOverlay.style.display = "none";
    }, timeout);
  }
}

// text animation
function animateText(element, htmlContent, speed, skipCheck) {
  element.innerHTML = "";

  const parser = new DOMParser();
  const parsedContent = parser.parseFromString(htmlContent, "text/html").body;
  const nodes = Array.from(parsedContent.childNodes);

  let index = 0;

  typeNode();

  function typeNode() {
    if (index < nodes.length) {
      const node = nodes[index];
      if (node.nodeType === Node.TEXT_NODE) {
        typeTextNode(node);
      } else {
        element.appendChild(node.cloneNode(true));
        index++;
        setTimeout(typeNode, speed);
      }
    } else {
      // show next
      setTimeout(() => {
        isTyping = false;
        element.innerHTML = "";
        showMessage();
      }, 500);
    }
  }

  function typeTextNode(textNode) {
    const text = textNode.textContent;
    let textIndex = 0;

    typeCharacter();

    function typeCharacter() {
      if (skipCheck()) {
        element.innerHTML = htmlContent;
        element.scrollTop = element.scrollHeight;
        index = nodes.length;
        setTimeout(() => {
          isTyping = false;
          showMessage();
        }, 100);
      } else if (textIndex < text.length) {
        element.innerHTML += text.charAt(textIndex);
        textIndex++;
        element.scrollTop = element.scrollHeight;
        setTimeout(typeCharacter, speed);
      } else {
        index++;
        setTimeout(typeNode, speed);
      }
    }
  }
}
