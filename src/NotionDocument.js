class NotionDocument {
  constructor({ root, icon, title }) {
    this._root = root;
    this._icon = icon;
    this._title = title;
    this._blocks = [];
    this._idCount = 0;
    this._buttonsTemplate = document.querySelector("#buttons-template").content;
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

    title.addEventListener("input", (event) => {
      this._title = event.target.textContent;
      localStorage.setItem("title", this._title);
    });
    return [icon, title];
  };

  renderElements = () => {
    const elements = this._createElements();
    elements.forEach((element) => {
      this._root.append(element);
    });
  };

  addBlock = (block, prevBlockId) => {
    let blockElem = null;

    block.id = ++this._idCount;

    switch (block.type) {
      case "title":
        blockElem = this._createTitle(block);
        break;
      case "paragraph":
        blockElem = this._createParagraph(block);
        break;
      default:
        return;
    }

    const container = this._createContainer(block.id);
    container.append(blockElem);

    // вставляем новый блок в _blocks
    if (prevBlockId) {
      const index = this._indexOfBlock(prevBlockId);
      if (index !== -1) {
        this._blocks.splice(index + 1, 0, block);
      } else {
        this._blocks.push(block);
      }
    } else {
      this._blocks.push(block);
    }

    // вставляем элемент нового блока в DOM
    if (prevBlockId) {
      const afterDiv = document.getElementById(prevBlockId);
      afterDiv.after(container);
    } else {
      this._root.append(container);
    }

    const blocksJSON = JSON.stringify(this._blocks);
    localStorage.setItem("blocks", blocksJSON);
  };

  _createContainer = (id) => {
    const container = document.createElement("div");
    container.setAttribute("id", id);
    container.classList.add("block");
    this._addButtons(container);
    return container;
  };

  _createTitle = (block) => {
    const title = document.createElement("h2");
    title.classList.add("block-title");
    title.setAttribute("contenteditable", "true");
    title.setAttribute("data-placeholder", "Enter text");
    title.textContent = block.value;

    this._blockListener(title, block);

    return title;
  };

  _createParagraph = (block) => {
    const paragraph = document.createElement("p");
    paragraph.classList.add("block-paragraph");
    paragraph.setAttribute("contenteditable", "true");
    paragraph.textContent = block.value;

    this._blockListener(paragraph, block);

    return paragraph;
  };

  _addButtons = (div) => {
    const template = this._buttonsTemplate.cloneNode(true).children[0];
    div.append(template);

    const h1 = template.querySelector(".btn_type_h1");
    h1.addEventListener("click", () => {
      this.addBlock(
        { type: "title", value: "Type something" },
        div.getAttribute("id")
      );
    });

    const text = template.querySelector(".btn_type_text");
    text.addEventListener("click", () => {
      this.addBlock(
        { type: "paragraph", value: "Type something" },
        div.getAttribute("id")
      );
    });
  };

  _blockListener = (blockElem, block) => {
    blockElem.addEventListener("input", (event) => {
      block.value = event.target.textContent;
      localStorage.setItem("blocks", JSON.stringify(this._blocks));
    });
  };

  _indexOfBlock = (id) => {
    for (let i = 0; i < this._blocks.length; i++) {
      if (this._blocks[i].id === Number(id)) {
        return i;
      }
    }
    return -1;
  };
}
