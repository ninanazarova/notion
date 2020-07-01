const notion = new NotionDocument({
  root: document.querySelector(".main"),
  icon: data.icon,
  title: localStorage.getItem("title")
    ? localStorage.getItem("title")
    : data.title,
});

notion.renderElements();

let blocks = data.blocks;

if (localStorage.getItem("blocks")) {
  const blocksJSON = localStorage.getItem("blocks");
  blocks = JSON.parse(blocksJSON);
}

blocks.forEach((block) => {
  notion.addBlock(block);
});
