const notion = new NotionDocument({
  root: document.querySelector(".main"),
  icon: data.icon,
  title: data.title,
});

notion.renderElements();

data.blocks.forEach((block) => {
  notion.addBlock(block);
});
