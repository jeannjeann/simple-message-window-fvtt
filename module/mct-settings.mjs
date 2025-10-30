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

    if (displayTabs === undefined || displayTabs === null) {
      const firstTabId = allTabs[0]?.id;
      displayTabs = firstTabId ? [firstTabId] : [];
      await game.settings.set(
        "simple-message-window",
        "mctDisplayTabs",
        displayTabs
      );
    } else {
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
