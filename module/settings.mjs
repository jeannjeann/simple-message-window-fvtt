// SMWSettings class
export class SMWSettings {
  static register() {
    // Prepare module settings.
    game.settings.register("simple-message-window", "smwEnable", {
      name: game.i18n.localize("SETTING.smwEnable.name"),
      scope: "client",
      config: false,
      type: Boolean,
      default: true,
    });
    game.settings.registerMenu("simple-message-window", "layoutSettings", {
      name: game.i18n.localize("SETTING.layoutMenu.name"),
      label: game.i18n.localize("SETTING.layoutMenu.label"),
      hint: game.i18n.localize("SETTING.layoutMenu.hint"),
      icon: "fas fa-ruler-combined",
      type: LayoutSettingsDialog,
      restricted: true,
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
      default: 10000,
    });
    game.settings.register("simple-message-window", "transparent", {
      name: game.i18n.localize("SETTING.transparent.name"),
      hint: game.i18n.localize("SETTING.transparent.hint"),
      scope: "world",
      config: false,
      type: Number,
      default: 10,
    });
    game.settings.register("simple-message-window", "fontSize", {
      name: game.i18n.localize("SETTING.fontSize.name"),
      hint: game.i18n.localize("SETTING.fontSize.hint"),
      scope: "client",
      config: false,
      type: Number,
      default: 100,
    });
    game.settings.register("simple-message-window", "textSpeed", {
      name: game.i18n.localize("SETTING.textSpeed.name"),
      hint: game.i18n.localize("SETTING.textSpeed.hint"),
      scope: "client",
      config: false,
      type: Number,
      default: 100,
    });
    game.settings.register("simple-message-window", "windowHPosition", {
      name: game.i18n.localize("SETTING.windowHPosition.name"),
      hint: game.i18n.localize("SETTING.windowHPosition.hint"),
      scope: "client",
      config: false,
      type: Number,
      default: 50,
    });
    game.settings.register("simple-message-window", "windowVPosition", {
      name: game.i18n.localize("SETTING.windowVPosition.name"),
      hint: game.i18n.localize("SETTING.windowVPosition.hint"),
      scope: "client",
      config: false,
      type: Number,
      default: 10,
    });
    game.settings.register("simple-message-window", "windowWidth", {
      name: game.i18n.localize("SETTING.windowWidth.name"),
      hint: game.i18n.localize("SETTING.windowWidth.hint"),
      scope: "client",
      config: false,
      type: Number,
      default: 100,
    });
    game.settings.register("simple-message-window", "windowHeight", {
      name: game.i18n.localize("SETTING.windowHeight.name"),
      hint: game.i18n.localize("SETTING.windowHeight.hint"),
      scope: "client",
      config: false,
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
      config: false,
      type: Number,
      default: 10,
    });
    game.settings.register("simple-message-window", "imgSize", {
      name: game.i18n.localize("SETTING.imgSize.name"),
      hint: game.i18n.localize("SETTING.imgSize.hint"),
      scope: "client",
      config: false,
      type: Number,
      default: 100,
    });
    if (game.modules.get("multiple-chat-tabs")?.active) {
      game.settings.register("simple-message-window", "mctDisplayTabs", {
        scope: "client",
        config: false,
        type: Array,
        default: undefined,
      });
      game.settings.registerMenu("simple-message-window", "mctSettings", {
        name: game.i18n.localize("SETTING.mct.name"),
        label: game.i18n.localize("SETTING.mct.label"),
        hint: game.i18n.localize("SETTING.mct.hint"),
        icon: "fas fa-comments",
        type: MCTSettingsDialog,
        restricted: true,
      });
    }
  }
}

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

// LayoutSettingsDialog class
class LayoutSettingsDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  _previewElements = null;
  _animationTimeout = null;
  _isGuiMode = false;
  _dragData = null;

  static DEFAULT_OPTIONS = {
    id: "smw-layout-settings",
    classes: ["smw-layout-dialog"],
    tag: "form",
    position: {
      width: 450,
      height: 500,
    },
    window: {
      title: "SETTING.layout.title",
      resizable: true,
    },
    form: {
      handler: LayoutSettingsDialog.#onSubmit,
      closeOnSubmit: true,
    },
  };

  static PARTS = {
    form: {
      template: "modules/simple-message-window/templates/layout-settings.hbs",
    },
  };

  async _prepareContext(options) {
    const settingsData = {
      window: {
        windowHPosition: { min: 0, max: 100 },
        windowVPosition: { min: 0, max: 100 },
        windowWidth: { min: 50, max: 200 },
        windowHeight: { min: 50, max: 400 },
        transparent: { min: 0, max: 100 },
        fontSize: { min: 50, max: 300 },
        textSpeed: { min: 10, max: 500 },
      },
      image: {
        imgSize: { min: 10, max: 300 },
        imgTransparent: { min: 0, max: 100 },
      },
    };

    const processGroup = (group) => {
      return Object.keys(group).reduce((acc, key) => {
        acc[key] = {
          value: game.settings.get("simple-message-window", key),
          label: game.i18n.localize(`SETTING.${key}.name`),
          hint: game.i18n.localize(`SETTING.${key}.hint`),
          min: group[key].min,
          max: group[key].max,
        };
        return acc;
      }, {});
    };

    return {
      settings: {
        window: processGroup(settingsData.window),
        image: processGroup(settingsData.image),
      },
      labels: {
        guiMode: game.i18n.localize("SETTING.layout.guiMode"),
        save: game.i18n.localize("SETTING.layout.save"),
        groupWindow: game.i18n.localize("SETTING.layout.groupWindow"),
        groupImage: game.i18n.localize("SETTING.layout.groupImage"),
      },
      labels: {
        guiMode: game.i18n.localize("SETTING.layout.guiMode"),
        guiModeStart: game.i18n.localize("SETTING.layout.guiModeStart"),
        reset: game.i18n.localize("SETTING.layout.reset"),
        save: game.i18n.localize("SETTING.layout.save"),
        groupWindow: game.i18n.localize("SETTING.layout.groupWindow"),
        groupImage: game.i18n.localize("SETTING.layout.groupImage"),
      },
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const html = this.element;

    if (!this._previewElements) {
      // Create preview
      const windowEl = document.createElement("div");
      windowEl.id = "smw-preview-window";
      windowEl.dataset.action = "move-window";
      windowEl.innerHTML = `
                <div class="smw-header">${game.i18n.localize(
                  "SETTING.layout.previewHeader"
                )}</div>
                <div class="smw-message"></div>
                <div class="smw-resize-handle" data-action="resize-window"></div>`;
      const portraitEl = document.createElement("div");
      portraitEl.id = "smw-preview-portrait";
      portraitEl.innerHTML = `
                <img src="icons/svg/mystery-man.svg" alt="Preview Portrait">
                <div class="smw-resize-handle" data-action="resize-portrait"></div>`;
      document.body.appendChild(windowEl);
      document.body.appendChild(portraitEl);
      this._previewElements = { window: windowEl, portrait: portraitEl };
      // Mouse listener
      Object.values(this._previewElements).forEach((el) => {
        el.addEventListener("mousedown", this._onDragStart.bind(this));
      });
    }
    this._updateGuiModeVisuals();
    this._updatePreview();
    this._startPreviewAnimation();

    // Activate Listeners
    const $html = $(html);
    // GUI Toggle Button
    $html.find('[data-action="toggle-gui"]').on("click", (event) => {
      event.preventDefault();
      this._isGuiMode = !this._isGuiMode;
      this._updateGuiModeVisuals();
    });
    // Reset Button
    $html
      .find('[data-action="reset-settings"]')
      .on("click", this._onResetSettings.bind(this));
    // Input listener
    const inputs = $html.find('input[type="range"], input[type="number"]');
    inputs.on("input", (event) => {
      const input = event.currentTarget;
      const name = input.name;
      const value = input.value;
      // Sync slider and input
      const otherInput = $html.find(`[name="${name}"]`).not(input);
      otherInput.val(value);
      this._updatePreview();
      // Restart animation
      if (name === "textSpeed") {
        this._startPreviewAnimation();
      }
    });
  }

  _onClose(options) {
    this._onDragEnd();
    if (this._previewElements) {
      this._previewElements.window.remove();
      this._previewElements.portrait.remove();
      this._previewElements = null;
    }
    if (this._animationTimeout) {
      clearTimeout(this._animationTimeout);
      this._animationTimeout = null;
    }
    super._onClose(options);
  }

  static async #onSubmit(event, form, formData) {
    const settingKeys = [
      "windowHPosition",
      "windowVPosition",
      "windowWidth",
      "windowHeight",
      "transparent",
      "fontSize",
      "textSpeed",
      "imgSize",
      "imgTransparent",
    ];
    const promises = settingKeys.map((key) => {
      const inputElement = form.querySelector(
        `input[type="number"][name="${key}"]`
      );
      if (inputElement) {
        const value = parseFloat(inputElement.value);
        return game.settings.set("simple-message-window", key, value);
      }
    });
    await Promise.all(promises.filter((p) => p));
  }

  _updateGuiModeVisuals() {
    if (!this._previewElements) return;
    const { window, portrait } = this._previewElements;
    const button = $(this.element).find('[data-action="toggle-gui"]');
    const icon = button.find("i");
    if (this._isGuiMode) {
      window.classList.add("gui-active");
      portrait.classList.add("gui-active");
      button.addClass("active");
      button.attr("title", game.i18n.localize("SETTING.layout.guiModeEnd"));
      icon.removeClass("fa-toggle-off").addClass("fa-toggle-on");
    } else {
      window.classList.remove("gui-active");
      portrait.classList.remove("gui-active");
      button.removeClass("active");
      button.attr("title", game.i18n.localize("SETTING.layout.guiModeStart"));
      icon.removeClass("fa-toggle-on").addClass("fa-toggle-off");
    }
  }

  _updatePreview() {
    if (!this._previewElements) return;
    const form = this.element;
    if (!form) return;

    const data = {};
    const settingKeys = [
      "windowHPosition",
      "windowVPosition",
      "windowWidth",
      "windowHeight",
      "transparent",
      "fontSize",
      "textSpeed",
      "imgSize",
      "imgTransparent",
    ];
    for (const key of settingKeys) {
      const inputElement = form.querySelector(
        `input[type="number"][name="${key}"]`
      );
      data[key] = parseFloat(inputElement?.value ?? 0);
    }

    const { window, portrait } = this._previewElements;
    const board = document.getElementById("board");
    const sidebar = document.getElementById("sidebar");
    if (!board || !sidebar) return;

    const overlayWidth = board.offsetWidth - sidebar.offsetWidth;

    // Window opacity
    const windowTransparent = (100 - data.transparent) / 100;
    window.style.backgroundColor = `rgba(0, 0, 0, ${windowTransparent})`;
    // Image opacity
    const imageTransparent = (100 - data.imgTransparent) / 100;
    portrait.querySelector("img").style.opacity = imageTransparent;
    // Window position
    window.style.bottom = `${data.windowVPosition}%`;
    const chatLeft = (overlayWidth / 100) * data.windowHPosition;
    window.style.left = `${chatLeft}px`;
    // Window size
    const chatWidth = (overlayWidth * 0.7 * data.windowWidth) / 100;
    const chatHeight = (overlayWidth * 0.15 * data.windowHeight) / 100;
    window.style.width = `${chatWidth}px`;
    window.style.height = `${chatHeight}px`;
    // Adjust message area
    const headerEl = window.querySelector(".smw-header");
    const messageEl = window.querySelector(".smw-message");
    if (headerEl && messageEl) {
      const headerHeight = headerEl.offsetHeight;
      messageEl.style.maxHeight = `${chatHeight - headerHeight - 10}px`;
    }
    // Font size
    const fontSize = (1.2 * data.fontSize) / 100;
    window.style.fontSize = `${fontSize}em`;
    // Portrait size & position
    const chatBottomPx = parseFloat(getComputedStyle(window).bottom);
    const portraitWidth = (chatHeight * data.imgSize) / 100;
    const portraitHeight = (chatHeight * data.imgSize) / 100;
    const portraitLeft = chatLeft - chatWidth / 2 + portraitWidth / 2 + 10;
    const portraitBottom = chatBottomPx + chatHeight;
    portrait.style.width = `${portraitWidth}px`;
    portrait.style.height = `${portraitHeight}px`;
    portrait.style.left = `${portraitLeft}px`;
    portrait.style.bottom = `${portraitBottom}px`;
  }

  _startPreviewAnimation() {
    if (this._animationTimeout) {
      clearTimeout(this._animationTimeout);
    }
    const message = game.i18n.localize("SETTING.layout.previewMessage");
    const messageEl =
      this._previewElements?.window.querySelector(".smw-message");
    if (!messageEl) return;
    // Restart animation
    this._animateText(messageEl, message, () => {
      // Loop delay
      this._animationTimeout = setTimeout(
        () => this._startPreviewAnimation(),
        2000
      );
    });
  }

  _animateText(element, text, onComplete) {
    const form = this.element;
    const speedValue = form.querySelector('[name="textSpeed"]')?.value ?? 100;
    const speed = 80 / (parseFloat(speedValue) / 100);
    element.innerHTML = "";
    const lines = text.split("\n");
    let lineIndex = 0;
    const typeLine = () => {
      if (!this._previewElements) return;
      const line = lines[lineIndex];
      let charIndex = 0;
      const typeChar = () => {
        if (!this._previewElements) return;
        if (charIndex < line.length) {
          element.innerHTML += line.charAt(charIndex);
          charIndex++;
          element.scrollTop = element.scrollHeight;
          this._animationTimeout = setTimeout(typeChar, speed);
        } else {
          lineIndex++;
          if (lineIndex < lines.length) {
            element.innerHTML += "<br>";
            typeLine();
          } else if (onComplete) {
            onComplete();
          }
        }
      };
      typeChar();
    };
    typeLine();
  }

  _onDragStart(event) {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) return;
    const action = actionTarget.dataset.action;
    if (!action) return;

    event.preventDefault();
    event.stopPropagation();

    const { window, portrait } = this._previewElements;
    const board = document.getElementById("board");
    const sidebar = document.getElementById("sidebar");
    const overlayWidth = board.offsetWidth - sidebar.offsetWidth;
    const form = this.element;

    this._dragData = {
      action: action,
      startX: event.clientX,
      startY: event.clientY,
      overlayWidth: overlayWidth,
      initial: {
        // Get current values
        windowHPos: parseFloat(
          form.querySelector('input[type="number"][name="windowHPosition"]')
            .value
        ),
        windowVPos: parseFloat(
          form.querySelector('input[type="number"][name="windowVPosition"]')
            .value
        ),
        windowWidth: parseFloat(
          form.querySelector('input[type="number"][name="windowWidth"]').value
        ),
        windowHeight: parseFloat(
          form.querySelector('input[type="number"][name="windowHeight"]').value
        ),
        imgSize: parseFloat(
          form.querySelector('input[type="number"][name="imgSize"]').value
        ),
      },
    };

    this._onDragMove = this._onDragMove.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    document.addEventListener("mousemove", this._onDragMove);
    document.addEventListener("mouseup", this._onDragEnd, { once: true });
  }

  _onDragMove(event) {
    if (!this._dragData) return;
    event.preventDefault();

    const dx = event.clientX - this._dragData.startX;
    const dy = event.clientY - this._dragData.startY;
    const form = this.element;

    const { action, initial, overlayWidth } = this._dragData;

    // Calculate proporty
    if (action === "move-window") {
      const dHPos = (dx / overlayWidth) * 100;
      const dVPos = (dy / document.body.clientHeight) * -100;
      const newHPos = Math.round(initial.windowHPos + dHPos);
      const newVPos = Math.round(initial.windowVPos + dVPos);
      Array.from(form.elements.windowHPosition).forEach(
        (el) => (el.value = newHPos)
      );
      Array.from(form.elements.windowVPosition).forEach(
        (el) => (el.value = newVPos)
      );
    } else if (action === "resize-window") {
      const baseWidth = overlayWidth * 0.7;
      const baseHeight = overlayWidth * 0.15;
      const dWidth = (dx / baseWidth) * 100;
      const dHeight = (dy / baseHeight) * -100;
      const newWidth = Math.round(initial.windowWidth + dWidth);
      const newHeight = Math.round(initial.windowHeight + dHeight);
      Array.from(form.elements.windowWidth).forEach(
        (el) => (el.value = newWidth)
      );
      Array.from(form.elements.windowHeight).forEach(
        (el) => (el.value = newHeight)
      );
    } else if (action === "resize-portrait") {
      const chatHeight = (overlayWidth * 0.15 * initial.windowHeight) / 100;
      const dSize = Math.abs(dx) > Math.abs(dy) ? dx : -dy;
      const dImgSize = (dSize / chatHeight) * 100;
      const newImgSize = Math.round(initial.imgSize + dImgSize);
      Array.from(form.elements.imgSize).forEach(
        (el) => (el.value = newImgSize)
      );
    }

    this._updatePreview();
  }

  _onDragEnd(event) {
    if (!this._dragData) return;
    this._dragData = null;
    document.removeEventListener("mousemove", this._onDragMove);
    document.removeEventListener("mouseup", this._onDragEnd);
  }

  async _onResetSettings(event) {
    event.preventDefault();
    const form = this.element;

    const settingsToReset = [
      "windowHPosition",
      "windowVPosition",
      "windowWidth",
      "windowHeight",
      "transparent",
      "fontSize",
      "textSpeed",
      "imgSize",
      "imgTransparent",
    ];
    for (const key of settingsToReset) {
      const setting = game.settings.settings.get(
        `simple-message-window.${key}`
      );
      if (!setting) continue;
      const defaultValue = setting.default;
      const inputs = form.elements[key];
      if (inputs)
        Array.from(inputs).forEach((input) => (input.value = defaultValue));
    }
    this._updatePreview();
  }
}

// MCTSettingsDialog class
export class MCTSettingsDialog extends HandlebarsApplicationMixin(
  ApplicationV2
) {
  static DEFAULT_OPTIONS = {
    classes: ["smw-mct-dialog"],
    id: "smw-mct-settings",
    tag: "form",
    position: {
      width: 400,
      height: "auto",
    },
    window: {
      title: "SETTING.mctDialog.title",
    },
    form: {
      submitOnChange: true,
      handler: MCTSettingsDialog.#onCheckboxChange,
      closeOnSubmit: false,
    },
  };

  static PARTS = {
    form: {
      template: "modules/simple-message-window/templates/mct-settings.hbs",
    },
  };

  async _prepareContext() {
    const tabsJSON = game.settings.get("multiple-chat-tabs", "tabs") || "[]";
    const allTabs = JSON.parse(tabsJSON);

    if (!allTabs || allTabs.length === 0) {
      return {
        description: game.i18n.localize("SETTING.mctDialog.description"),
        tabs: [],
      };
    }

    let displayTabs = game.settings.get(
      "simple-message-window",
      "mctDisplayTabs"
    );

    // Set default setting
    if (displayTabs === undefined || displayTabs === null) {
      const firstTabId = allTabs[0]?.id;
      displayTabs = firstTabId ? [firstTabId] : [];
      await game.settings.set(
        "simple-message-window",
        "mctDisplayTabs",
        displayTabs
      );
    } else {
      // clean up invalid tab id
      const validTabIds = allTabs.map((t) => t.id);
      const cleanedDisplayTabs = displayTabs.filter((id) =>
        validTabIds.includes(id)
      );
      if (cleanedDisplayTabs.length !== displayTabs.length) {
        displayTabs = cleanedDisplayTabs;
        await game.settings.set(
          "simple-message-window",
          "mctDisplayTabs",
          displayTabs
        );
      }
    }

    const tabsData = allTabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      checked: !displayTabs.includes(tab.id),
    }));

    return {
      description: game.i18n.localize("SETTING.mctDialog.description"),
      tabs: tabsData,
    };
  }

  static async #onCheckboxChange(event, form, formData) {
    // list display tabs
    const displayTabs = Object.entries(formData.object)
      .filter(([_id, checked]) => !checked)
      .map(([id, _checked]) => id);

    await game.settings.set(
      "simple-message-window",
      "mctDisplayTabs",
      displayTabs
    );
  }
}
