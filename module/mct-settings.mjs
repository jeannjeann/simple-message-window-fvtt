// MCTSettingsDialog class
export class MCTSettingsDialog extends FormApplication {
  static get defaultOptions() {
    const options = super.defaultOptions;
    const newOptions = {
      id: "smw-mct-settings",
      title: game.i18n.localize("SETTING.mctDialog.title"),
      template: "modules/simple-message-window/templates/mct-settings.hbs",
      width: 400,
      height: "auto",
      classes: ["smw-mct-dialog"],
      closeOnSubmit: false,
      submitOnChange: false,
    };
    if (foundry.utils.isNewerVersion(game.version, "12")) {
      // v12 or later
      return foundry.utils.mergeObject(options, newOptions);
    } else {
      // under v11
      return mergeObject(options, newOptions);
    }
  }

  async getData() {
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

  activateListeners(html) {
    super.activateListeners(html);
    html
      .find('input[type="checkbox"]')
      .on("change", this._onCheckboxChange.bind(this));
  }

  async _onCheckboxChange(event) {
    const form = this.form;
    const formData = new FormDataExtended(form).object;

    // list display tabs
    const displayTabs = Object.entries(formData)
      .filter(([_id, checked]) => !checked)
      .map(([id, _checked]) => id);

    await game.settings.set(
      "simple-message-window",
      "mctDisplayTabs",
      displayTabs
    );
    this.render();
  }

  async _updateObject(event, formData) {}
}
