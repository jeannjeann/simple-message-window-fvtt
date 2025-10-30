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

// MCTSettingsDialog class
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
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
