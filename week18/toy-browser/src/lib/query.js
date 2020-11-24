export function queryElement(elements, root, attrName, attrValue) {
  if (root.type !== 'element' && root.type !== 'document') {
    return;
  }
  if (root.attributes?.find((a) => a.name === attrName && a.value === attrValue)) {
    elements.push(root);
  }
  if (root.children) {
    for (const child of root.children) {
      queryElement(elements, child, attrName, attrValue);
    }
  }
}

// module.exports = queryElement;
