// module/smw.mjs

// flags
let isReady = false;
let isTyping = false;
let messageId = null;
let messageQueue = [];
let windowTimeout = null;

Hooks.once("init", () => {
  //prepare overlay
  const chatOverlay = document.createElement("div");
  chatOverlay.id = "smw-chat-overlay";
  document.body.appendChild(chatOverlay);

  const portraitOverlay = document.createElement("div");
  portraitOverlay.id = "smw-portrait-overlay";
  portraitOverlay.innerHTML = `<img src="" alt="Image">`;
  document.body.appendChild(portraitOverlay);

  // Prepare module settings.
  game.settings.register("simple-message-window", "smwEnable", {
    name: game.i18n.localize("SETTING.smwEnable.name"),
    scope: "client",
    config: false,
    type: Boolean,
    default: true,
  });
  game.settings.register("simple-message-window", "showCharacter", {
    name: game.i18n.localize("SETTING.showCharacter.name"),
    hint: game.i18n.localize("SETTING.showCharacter.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register("simple-message-window", "showGM", {
    name: game.i18n.localize("SETTING.showGM.name"),
    hint: game.i18n.localize("SETTING.showGM.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register("simple-message-window", "showPlayer", {
    name: game.i18n.localize("SETTING.showPlayer.name"),
    hint: game.i18n.localize("SETTING.showPlayer.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register("simple-message-window", "showRoll", {
    name: game.i18n.localize("SETTING.showRoll.name"),
    hint: game.i18n.localize("SETTING.showRoll.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register("simple-message-window", "showOther", {
    name: game.i18n.localize("SETTING.showOther.name"),
    hint: game.i18n.localize("SETTING.showOther.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register("simple-message-window", "delayTime", {
    name: game.i18n.localize("SETTING.delayTime.name"),
    hint: game.i18n.localize("SETTING.delayTime.hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 0,
  });
  game.settings.register("simple-message-window", "transparent", {
    name: game.i18n.localize("SETTING.transparent.name"),
    hint: game.i18n.localize("SETTING.transparent.hint"),
    scope: "world",
    config: true,
    type: Number,
    default: 10,
  });
  game.settings.register("simple-message-window", "fontSize", {
    name: game.i18n.localize("SETTING.fontSize.name"),
    hint: game.i18n.localize("SETTING.fontSize.hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 100,
  });
  game.settings.register("simple-message-window", "textSpeed", {
    name: game.i18n.localize("SETTING.textSpeed.name"),
    hint: game.i18n.localize("SETTING.textSpeed.hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 100,
  });
  game.settings.register("simple-message-window", "windowHPosition", {
    name: game.i18n.localize("SETTING.windowHPosition.name"),
    hint: game.i18n.localize("SETTING.windowHPosition.hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 50,
  });
  game.settings.register("simple-message-window", "windowVPosition", {
    name: game.i18n.localize("SETTING.windowVPosition.name"),
    hint: game.i18n.localize("SETTING.windowVPosition.hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 10,
  });
  game.settings.register("simple-message-window", "windowWidth", {
    name: game.i18n.localize("SETTING.windowWidth.name"),
    hint: game.i18n.localize("SETTING.windowWidth.hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 100,
  });
  game.settings.register("simple-message-window", "windowHeight", {
    name: game.i18n.localize("SETTING.windowHeight.name"),
    hint: game.i18n.localize("SETTING.windowHeight.hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 100,
  });
  game.settings.register("simple-message-window", "showImg", {
    name: game.i18n.localize("SETTING.showImg.name"),
    hint: game.i18n.localize("SETTING.showImg.hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register("simple-message-window", "hideMysteryman", {
    name: game.i18n.localize("SETTING.hideMysteryman.name"),
    hint: game.i18n.localize("SETTING.hideMysteryman.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register("simple-message-window", "imgTransparent", {
    name: game.i18n.localize("SETTING.imgTransparent.name"),
    hint: game.i18n.localize("SETTING.imgTransparent.hint"),
    scope: "world",
    config: true,
    type: Number,
    default: 10,
  });
  game.settings.register("simple-message-window", "imgSize", {
    name: game.i18n.localize("SETTING.imgSize.name"),
    hint: game.i18n.localize("SETTING.imgSize.hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 100,
  });
});

Hooks.once("ready", () => {
  isReady = true;
});

Hooks.on("renderSceneControls", async function () {
  if (!$("#smw-control").length) {
    $("#controls > .main-controls").append(
      '<li class="scene-control" id="smw-control" title="Simple Message Window Toggle"><i class="fas fa-comment-alt"></i></li>'
    );
    updateIconState();
    $("#smw-control").click(() => {
      toggleSMW();
    });
  }
  async function toggleSMW() {
    const current = game.settings.get("simple-message-window", "smwEnable");
    await game.settings.set("simple-message-window", "smwEnable", !current);
    updateIconState();
  }
  function updateIconState() {
    const isEnabled = game.settings.get("simple-message-window", "smwEnable");
    const control = $("#smw-control");
    if (isEnabled) {
      control.addClass("toggle");
    } else {
      control.removeClass("toggle");
    }
  }
});

Hooks.on("canvasReady", () => {
  window.addEventListener("resize", adjustOverlaySize);
});

Hooks.on("createChatMessage", async (message, html, data) => {
  // check show condition
  let smwEnable = game.settings.get("simple-message-window", "smwEnable");
  if (!smwEnable) return;
  if (!isReady) return;
  if (!showCheck(message)) return;

  // store message ID
  messageId = message.id;
});

Hooks.on("renderChatMessage", async (message, html, data) => {
  // check correct message
  if (messageId == message.id) {
    messageQueue.push(message);
    messageId = null;
  }

  // show message
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

    // window transparent
    let transparent =
      game.settings.get("simple-message-window", "transparent") ?? 10;
    const windowTransparent = (100 - transparent) / 100;
    chatOverlay.style.setProperty(
      "background-color",
      `rgba(0, 0, 0, ${windowTransparent})`
    );
    chatOverlay.style.setProperty(
      "color",
      `rgba(255, 255, 255, ${windowTransparent})`
    );

    // image transparent
    let imgtransparent =
      game.settings.get("simple-message-window", "imgTransparent") ?? 10;
    const imageTransparent = (100 - imgtransparent) / 100;
    const imgOverlay = document.querySelector("#smw-portrait-overlay img");
    imgOverlay.style.opacity = `${imageTransparent}`;

    // window position
    let windowVPositionSetting =
      game.settings.get("simple-message-window", "windowVPosition") ?? 5;
    chatOverlay.style.bottom = `${windowVPositionSetting}%`;
    let windowHPositionSetting =
      game.settings.get("simple-message-window", "windowHPosition") ?? 50;
    const chatLeft = (overlayWidth / 100) * windowHPositionSetting;
    chatOverlay.style.left = `${chatLeft}px`;

    // window size
    let windowWidthSetting =
      game.settings.get("simple-message-window", "windowWidth") ?? 100;
    let windowHeightSetting =
      game.settings.get("simple-message-window", "windowHeight") ?? 100;
    const chatWidth = (overlayWidth * 0.7 * windowWidthSetting) / 100;
    const chatHeight = (overlayWidth * 0.15 * windowHeightSetting) / 100;
    const chatBottom =
      parseFloat(window.getComputedStyle(chatOverlay).bottom) || 0;

    chatOverlay.style.width = `${chatWidth}px`;
    chatOverlay.style.height = `${chatHeight}px`;

    const overlayHeight = chatOverlay.offsetHeight;
    const headerHeight =
      chatOverlay.querySelector(".smw-header")?.offsetHeight || 0;
    const messageElement = chatOverlay.querySelector(".smw-message");
    if (messageElement) {
      const contentHeight = overlayHeight - headerHeight - 20;
      messageElement.style.maxHeight = `${contentHeight}px`;
    }

    // font size
    let fontSizeSetting =
      game.settings.get("simple-message-window", "fontSize") ?? 100;
    const fontSize = (1.2 * fontSizeSetting) / 100;
    chatOverlay.style.setProperty("font-size", `${fontSize}em`);

    // portrait size
    let imgSizeSetting =
      game.settings.get("simple-message-window", "imgSize") ?? 100;
    const portraitHeigt = (chatHeight * imgSizeSetting) / 100;
    const portraitWidth = (chatHeight * imgSizeSetting) / 100;
    const portraitLeft = chatLeft - chatWidth / 2 + portraitWidth / 2 + 10;
    const portraitBottom = chatBottom + chatHeight;

    portraitOverlay.style.height = `${portraitHeigt}px`;
    portraitOverlay.style.width = `${portraitWidth}px`;
    portraitOverlay.style.left = `${portraitLeft}px`;
    portraitOverlay.style.bottom = `${portraitBottom}px`;
  }
}

function showCheck(message) {
  let showCharacter = game.settings.get(
    "simple-message-window",
    "showCharacter"
  );
  let showGM = game.settings.get("simple-message-window", "showGM");
  let showPlayer = game.settings.get("simple-message-window", "showPlayer");
  let showOther = game.settings.get("simple-message-window", "showOther");
  let showRoll = game.settings.get("simple-message-window", "showRoll");

  const messageType = [];
  if (message.whisper.length > 0) messageType.push("whisper");
  if (message.rolls.length > 0 || message.isRoll) messageType.push("roll");
  if (!message.speaker.actor) {
    const isV12Plus = foundry.utils.isNewerVersion(game.version, "12");
    // v12 or later
    if (isV12Plus) {
      messageType.push(message.author.isGM ? "gamemaster" : "player");
    }
    // under v11
    else {
      messageType.push(message.user.isGM ? "gamemaster" : "player");
    }
  } else messageType.push("character");

  if (messageType.includes("whisper")) {
    return;
  }
  if (messageType.includes("roll") && !showRoll) {
    return;
  }
  if (messageType.includes("player") && !showPlayer) {
    return;
  }
  if (messageType.includes("gamemaster") && !showGM) {
    return;
  }
  if (messageType.includes("character") && !showCharacter) {
    return;
  }
  if (message.type == 0 && !showOther) {
    return;
  }
  // Narrator Tools support
  if (game.modules.get("narrator-tools")?.active) {
    if (message.flags["narrator-tools"]?.type == "narration") return;
    if (message.flags["narrator-tools"]?.type == "description") return;
  }
  return true;
}

// show message text
async function showMessage() {
  const chatOverlay = document.getElementById("smw-chat-overlay");
  const portraitOverlay = document.getElementById("smw-portrait-overlay");

  if (messageQueue.length == 0) {
    let delayTime =
      game.settings.get("simple-message-window", "delayTime") ?? 0;
    if (delayTime != 0) {
      windowTimeout = setTimeout(() => {
        chatOverlay.style.display = "none";
        portraitOverlay.style.display = "none";
      }, delayTime);
    }
    return;
  }
  isTyping = true;

  if (!chatOverlay) return;

  const message = messageQueue.shift();
  const speaker = message.alias;
  const actor = game.actors?.get(message.speaker.actor) || null;
  const token = canvas.tokens?.get(message.speaker.token) || null;
  const characterImg = token?.actor.img;
  let content = message.flavor + message.content;
  // v12 or later check
  const isV12Plus = foundry.utils.isNewerVersion(game.version, "12");
  const playerImg = isV12Plus ? message.author.avatar : message.user.avatar;

  // support polyglot module
  if (message.flags.polyglot) {
    content = await getPolyglotMessage();

    async function getPolyglotMessage() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const targetMessage = game.messages.get(message.id);
          if (targetMessage) {
            const messageHTML = document.querySelector(
              `.chat-message[data-message-id="${targetMessage._id}"]`
            );
            if (messageHTML) {
              const preRenderedHTML =
                messageHTML.querySelector(".message-content");
              if (preRenderedHTML) {
                const renderedHTML = preRenderedHTML.outerHTML
                  .replace(/^\s*<div class="message-content">\s*/, "")
                  .replace(/\s*<\/div>\s*$/, "");
                resolve(renderedHTML);
              }
            }
          }
        }, 100);
      });
    }
  }

  // text Speed
  let textSpeedSetting =
    game.settings.get("simple-message-window", "textSpeed") ?? 100;
  const textspeed = 80 / (textSpeedSetting / 100);

  const window = await renderTemplate(
    "modules/simple-message-window/templates/smw.hbs",
    {
      speaker: speaker,
      message: "",
    }
  );

  chatOverlay.innerHTML = window;

  // set image
  let hideMysteryman =
    game.settings.get("simple-message-window", "hideMysteryman") ?? 100;
  let image = "";
  if (characterImg) {
    image = characterImg;
  } else {
    image = playerImg;
  }
  if (hideMysteryman) {
    if (image == "icons/svg/mystery-man.svg") image = "";
  }
  portraitOverlay.querySelector("img").src = image;

  chatOverlay.style.display = "block";
  let showImg = game.settings.get("simple-message-window", "showImg");
  if (showImg && image != "") {
    portraitOverlay.style.display = "block";
  } else {
    portraitOverlay.style.display = "none";
  }
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
}

// text animation
function animateText(element, htmlContent, speed, skipCheck) {
  element.innerHTML = "";

  const parser = new DOMParser();
  const parsedContent = parser.parseFromString(htmlContent, "text/html").body;
  blackBGwhiteFont(parsedContent);
  const nodes = Array.from(parsedContent.childNodes);
  let index = 0;

  typeNode();

  function typeNode() {
    if (index < nodes.length) {
      const node = nodes[index];
      // node skip
      if (skipNode(node)) {
        index++;
      } else if (node.nodeType === Node.TEXT_NODE) {
        typeTextNode(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const parentElement = document.createElement(node.tagName);
        Array.from(node.attributes).forEach((attr) =>
          parentElement.setAttribute(attr.name, attr.value)
        );
        element.appendChild(parentElement);
        typeElementNode(parentElement, node, () => {
          index++;
          setTimeout(typeNode, speed);
        });
      }
    } else {
      // show next
      setTimeout(() => {
        isTyping = false;
        showMessage();
      }, 500);
    }
  }

  function typeElementNode(container, elementNode, onComplete) {
    const childNodes = Array.from(elementNode.childNodes);
    let childIndex = 0;

    typeChild();

    function typeChild() {
      if (childIndex < childNodes.length) {
        const child = childNodes[childIndex];
        if (skipNode(child)) {
          // skip childNode
          childIndex++;
          typeChild();
        } else if (child.nodeType === Node.TEXT_NODE) {
          typeTextInElement(container, child, () => {
            childIndex++;
            typeChild();
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const childElement = document.createElement(child.tagName);
          Array.from(child.attributes).forEach((attr) =>
            childElement.setAttribute(attr.name, attr.value)
          );
          container.appendChild(childElement);
          typeElementNode(childElement, child, () => {
            childIndex++;
            typeChild();
          });
        }
      } else {
        onComplete();
      }
    }
  }

  // Node skip check
  function skipNode(node) {
    let skip = false;
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.classList?.contains("tooltip-part")) skip = true;
      if (node.tagName === "BUTTON") skip = true;
      //if (node.classList?.contains("collapsible-content")) skip = true; // for DnD5e System
    }
    return skip;
  }

  function typeTextInElement(container, textNode, onComplete) {
    const text = textNode.textContent;
    let textIndex = 0;

    function typeCharacter() {
      const isSkipCharacter =
        text.charAt(textIndex) === "" || text.charAt(textIndex) === " ";
      const timeout = isSkipCharacter ? 0 : speed;
      if (skipCheck()) {
        element.innerHTML = htmlContent;
        element.scrollTop = element.scrollHeight;
        index = nodes.length;
        setTimeout(() => {
          isTyping = false;
          showMessage();
        }, 100);
      } else if (textIndex < text.length) {
        container.innerHTML += text.charAt(textIndex);
        textIndex++;
        element.scrollTop = element.scrollHeight;
        setTimeout(typeCharacter, timeout);
      } else {
        onComplete();
      }
    }
    typeCharacter();
  }

  function typeTextNode(textNode) {
    const text = textNode.textContent;
    let textIndex = 0;

    function typeCharacter() {
      const isSkipCharacter =
        text.charAt(textIndex) === "" || text.charAt(textIndex) === " ";
      const timeout = isSkipCharacter ? 0 : speed;
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
        setTimeout(typeCharacter, timeout);
      } else {
        index++;
        setTimeout(typeNode, timeout);
      }
    }
    typeCharacter();
  }
}

// enforce white font color and black background color
function blackBGwhiteFont(contentElement) {
  const allElements = contentElement.querySelectorAll("*");

  allElements.forEach((el) => {
    el.style.backgroundColor = "rgba(0, 0, 0, 0)";
    el.style.color = "rgba(255, 255, 255, 0.9)";
  });

  contentElement.style.backgroundColor = "rgba(0, 0, 0, 0)";
  contentElement.style.color = "rgba(255, 255, 255, 0.9)";
}
