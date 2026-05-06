(() => {
  const enhancedSelects = new WeakMap();
  const allInstances = new Set();
  let openInstance = null;

  function getSelects() {
    return Array.from(document.querySelectorAll("form select:not([data-premium-select='false'])"));
  }

  function getOptionLabel(option) {
    return option?.textContent?.trim() || "";
  }

  function getOptions(select) {
    return Array.from(select.options).map((option, index) => ({
      index,
      value: option.value,
      label: getOptionLabel(option),
      description: option.dataset.description || "",
      disabled: option.disabled,
      selected: option.selected,
      placeholder: option.value === "",
    }));
  }

  function getSelectedOption(select) {
    return select.options[select.selectedIndex] || select.options[0] || null;
  }

  function closeOpenInstance(nextInstance = null) {
    if (openInstance && openInstance !== nextInstance) {
      openInstance.close();
    }
  }

  function enhanceSelect(select) {
    if (enhancedSelects.has(select)) return enhancedSelects.get(select);

    const id = select.id || `premium-select-${Math.random().toString(36).slice(2)}`;
    if (!select.id) select.id = id;

    const wrapper = document.createElement("div");
    wrapper.className = "premium-select";

    const button = document.createElement("button");
    button.className = "premium-select-button";
    button.type = "button";
    button.id = `${id}-premium-button`;
    button.setAttribute("role", "combobox");
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `${id}-premium-listbox`);
    button.setAttribute("aria-required", select.required ? "true" : "false");

    const valueText = document.createElement("span");
    valueText.className = "premium-select-value";
    button.append(valueText);

    const arrow = document.createElement("span");
    arrow.className = "premium-select-arrow";
    arrow.setAttribute("aria-hidden", "true");
    button.append(arrow);

    const menu = document.createElement("div");
    menu.className = "premium-select-menu";
    menu.id = `${id}-premium-listbox`;
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-labelledby", `${id}-premium-button`);

    wrapper.append(button, menu);
    select.classList.add("premium-native-select");
    select.setAttribute("aria-hidden", "true");
    select.tabIndex = -1;
    select.insertAdjacentElement("afterend", wrapper);

    const instance = {
      select,
      wrapper,
      button,
      menu,
      highlightedIndex: -1,
      isOpen: false,
      open,
      close,
      refresh,
    };

    function setButtonInvalidState() {
      const invalid = select.getAttribute("aria-invalid") === "true";
      button.setAttribute("aria-invalid", invalid ? "true" : "false");
    }

    function setHighlighted(index) {
      const optionElements = Array.from(menu.querySelectorAll("[role='option']"));
      const next = optionElements[index];
      if (!next) return;

      optionElements.forEach((option) => option.classList.remove("is-highlighted"));
      next.classList.add("is-highlighted");
      button.setAttribute("aria-activedescendant", next.id);
      instance.highlightedIndex = index;
      next.scrollIntoView({ block: "nearest" });
    }

    function selectOption(index, shouldFocus = true) {
      const option = select.options[index];
      if (!option || option.disabled) return;

      select.selectedIndex = index;
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
      refresh();
      close();
      if (shouldFocus) button.focus();
    }

    function renderOptions() {
      const options = getOptions(select);
      menu.innerHTML = "";

      options.forEach((option) => {
        const item = document.createElement("div");
        item.className = "premium-select-option";
        item.id = `${id}-premium-option-${option.index}`;
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", option.selected ? "true" : "false");
        item.dataset.index = String(option.index);

        const label = document.createElement("span");
        label.className = "premium-select-option-label";
        label.textContent = option.label;
        item.append(label);

        if (option.description) {
          const description = document.createElement("span");
          description.className = "premium-select-option-description";
          description.textContent = option.description;
          item.append(description);
        }

        if (option.placeholder) item.classList.add("is-placeholder");
        if (option.selected) item.classList.add("is-selected");
        if (option.disabled) item.setAttribute("aria-disabled", "true");

        item.addEventListener("pointerdown", (event) => event.preventDefault());
        item.addEventListener("click", () => selectOption(option.index));
        item.addEventListener("mouseenter", () => {
          const nextIndex = Array.from(menu.children).indexOf(item);
          setHighlighted(nextIndex);
        });

        menu.append(item);
      });
    }

    function refresh() {
      const selected = getSelectedOption(select);
      valueText.textContent = getOptionLabel(selected);
      button.classList.toggle("has-placeholder", !select.value);
      button.disabled = select.disabled;
      setButtonInvalidState();
      renderOptions();

      if (instance.isOpen) {
        const selectedIndex = Math.max(0, select.selectedIndex);
        setHighlighted(selectedIndex);
      }
    }

    function open() {
      if (select.disabled) return;
      closeOpenInstance(instance);
      refresh();
      instance.isOpen = true;
      openInstance = instance;
      wrapper.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      const selectedIndex = Math.max(0, select.selectedIndex);
      setHighlighted(selectedIndex);
    }

    function close() {
      instance.isOpen = false;
      if (openInstance === instance) openInstance = null;
      wrapper.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      button.removeAttribute("aria-activedescendant");
    }

    function moveHighlight(delta) {
      const optionElements = Array.from(menu.querySelectorAll("[role='option']"));
      if (!optionElements.length) return;
      const count = optionElements.length;
      const current = instance.highlightedIndex >= 0 ? instance.highlightedIndex : Math.max(0, select.selectedIndex);
      let next = current;

      for (let i = 0; i < count; i += 1) {
        next = (next + delta + count) % count;
        const disabled = optionElements[next].getAttribute("aria-disabled") === "true";
        if (!disabled) break;
      }

      setHighlighted(next);
    }

    button.addEventListener("click", () => {
      if (instance.isOpen) {
        close();
      } else {
        open();
      }
    });

    button.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!instance.isOpen) open();
        moveHighlight(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!instance.isOpen) open();
        moveHighlight(-1);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!instance.isOpen) {
          open();
          return;
        }
        const highlighted = menu.querySelectorAll("[role='option']")[instance.highlightedIndex];
        if (highlighted) selectOption(Number(highlighted.dataset.index));
      } else if (event.key === "Escape") {
        close();
      } else if (event.key === "Tab") {
        close();
      }
    });

    select.addEventListener("change", refresh);
    select.addEventListener("input", refresh);
    select.addEventListener("focus", () => button.focus());

    const observer = new MutationObserver(refresh);
    observer.observe(select, {
      attributes: true,
      attributeFilter: ["aria-invalid", "disabled", "required"],
      childList: true,
      subtree: true,
      characterData: true,
    });

    refresh();
    enhancedSelects.set(select, instance);
    allInstances.add(instance);
    return instance;
  }

  function refreshAll() {
    allInstances.forEach((instance) => instance.refresh());
  }

  function initPremiumSelects() {
    getSelects().forEach(enhanceSelect);
    refreshAll();
  }

  document.addEventListener("click", (event) => {
    if (!openInstance) return;
    const target = event.target;
    if (target instanceof Node && !openInstance.wrapper.contains(target)) {
      openInstance.close();
    }
  });

  window.addEventListener("starSpeakerLanguageChange", () => {
    window.setTimeout(refreshAll, 0);
  });

  window.starSpeakerPremiumSelects = {
    init: initPremiumSelects,
    refreshAll,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPremiumSelects);
  } else {
    initPremiumSelects();
  }
})();
