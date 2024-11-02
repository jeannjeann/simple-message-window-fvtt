// module/smw.mjs

// flags
let isReady = false;
let isTyping = false;
let messageQueue = [];

Hooks.once("init", () => {
  const chatOverlay = document.createElement("div");
  chatOverlay.id = "smw-chat-overlay";
  document.body.appendChild(chatOverlay);
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
    console.log(messageQueue);
    showMessage();
  }
});

async function showMessage() {
  if (messageQueue.length == 0) return;
  isTyping = true;

  const chatOverlay = document.getElementById("smw-chat-overlay");
  if (!chatOverlay) return;

  const message = messageQueue.shift();
  const speaker = message.alias;
  const content = message.content;
  const textspeed = 80;

  const window = await renderTemplate(
    "modules/simple-message-window/templates/smw.hbs",
    {
      speaker: speaker,
      message: "",
    }
  );

  chatOverlay.innerHTML = window;
  chatOverlay.style.display = "block";
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
  });

  // window timeout
  let timeout = null;
  if (timeout) {
    setTimeout(() => {
      chatOverlay.style.display = "none";
    }, timeout);
  }
}

function adjustOverlaySize() {
  const chatOverlay = document.getElementById("smw-chat-overlay");
  if (!chatOverlay) return;

  const board = document.getElementById("board");
  const sidebar = document.getElementById("sidebar");

  if (board && sidebar && chatOverlay) {
    const boardWidth = board.offsetWidth;
    const sidebarWidth = sidebar.offsetWidth;
    const overlayWidth = boardWidth - sidebarWidth;
    chatOverlay.style.width = `${overlayWidth * 0.7}px`;
    chatOverlay.style.height = `${overlayWidth * 0.2}px`;
    chatOverlay.style.left = `calc(50% - ${sidebarWidth / 2}px)`;

    const overlayHeight = chatOverlay.offsetHeight;
    const headerHeight =
      chatOverlay.querySelector(".smw-header")?.offsetHeight || 0;
    const messageElement = chatOverlay.querySelector(".smw-message");
    if (messageElement) {
      const contentHeight = overlayHeight - headerHeight - 20;
      messageElement.style.maxHeight = `${contentHeight}px`;
    }
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
          element.innerHTML = "";
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
