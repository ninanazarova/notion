class NotionDocument {
  constructor({ root, icon, title }) {
    this._root = root;
    this._icon = icon;
    this._title = title;
    this._blocks = [];
  }

  _createElements = () => {
    const icon = document.createElement("span");
    const title = document.createElement("h1");
    icon.classList.add("main__icon");
    title.classList.add("main__title");
    icon.setAttribute("contenteditable", "true");
    title.setAttribute("contenteditable", "true");
    icon.textContent = this._icon;
    title.textContent = this._title;
    return [icon, title];
  };

  renderElements = () => {
    const elements = this._createElements();
    elements.forEach((element) => {
      this._root.append(element);
    });
  };

  addBlock = (block) => {
    switch (block.type) {
      case "title":
        this._addTitle(block);
        break;
      case "paragraph":
        this._addParagraph(block);
        break;
    }
  };

  _addTitle(block) {
    this._blocks.push(block);
    const title = document.createElement("h2");
    title.classList.add("block-title");
    title.setAttribute("contenteditable", "true");
    title.textContent = block.value;
    this._root.append(title);
  }

  _addParagraph(block) {
    this._blocks.push(block);
    const paragraph = document.createElement("p");
    paragraph.classList.add("block-paragraph");
    paragraph.setAttribute("contenteditable", "true");
    paragraph.textContent = block.value;
    this._root.append(paragraph);
  }
}
