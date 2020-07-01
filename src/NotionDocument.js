class NotionDocument {
  constructor({ root, icon, title }) {
    this._root = root;
    this._icon = icon;
    this._title = title;
    // this._blocks содержит блоки. На странице блоки отображаются
    // в таком же порядке, в каком лежат в массиве
    this._blocks = [];
    // Счетчик нужен для присвоения блоку уникального идентификатора
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

  // addBlock добавляет новый блок на страницу.
  // prevBlockId - идентификатор блока, после которого нужно вставить новый блок
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

    this._updateStorageBlocks();
  };

  _createContainer = (id) => {
    const container = document.createElement("div");
    container.setAttribute("id", id);
    container.classList.add("block");
    this._addButtons(container);
    return container;
  };

  _addButtons = (container) => {
    const template = this._buttonsTemplate.cloneNode(true).children[0];
    container.append(template);

    const h1 = template.querySelector(".btn_type_h1");
    h1.addEventListener("click", () => {
      this.addBlock(
        { type: "title", value: "Type something" },
        container.getAttribute("id")
      );
    });

    const text = template.querySelector(".btn_type_text");
    text.addEventListener("click", () => {
      this.addBlock(
        { type: "paragraph", value: "Type something" },
        container.getAttribute("id")
      );
    });

    const deleteButton = template.querySelector(".btn_type_delete");
    deleteButton.addEventListener("click", () => {
      this.removeBlock(container.getAttribute("id"));
    });
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

  // _blockListener сохраняет состояние блока при его обновлении
  _blockListener = (blockElem, block) => {
    blockElem.addEventListener("input", (event) => {
      block.value = event.target.textContent;
      this._updateStorageBlocks();
    });
  };

  removeBlock = (id) => {
    const index = this._indexOfBlock(id);

    if (index !== -1) {
      this._blocks.splice(index, 1);
      document.getElementById(id).remove();
      this._updateStorageBlocks();
    }

    if (this._blocks.length === 0) {
      this.addBlock({ type: "paragraph", value: "Type something" });
    }
  };

  _updateStorageBlocks = () => {
    const blocksJSON = JSON.stringify(this._blocks);
    localStorage.setItem("blocks", blocksJSON);
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
