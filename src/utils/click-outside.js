// I'm experimenting with an easier-to-use click outside
// action. This deviates from what is currently in graph-paper. If it works out
// I think we should just bundle this.

export default function clickOutside(node, onEventFunction) {
  const isNestedChild = (parent, child) => {
    let currentNode = child;

    while (currentNode !== null) {
      if (currentNode.parentNode === parent) {
        return true;
      }
      currentNode = currentNode.parentNode;
    }

    return false;
  };

  const handleClick = (event) => {
    const { target } = event;

    if (!node.isSameNode(target) && !isNestedChild(node, target)) {
      onEventFunction();
    }
  };

  // wait for the next tick before moving forward.
  setTimeout(() => document.addEventListener("click", handleClick));

  return {
    destroy() {
      document.removeEventListener("click", handleClick);
    },
  };
}
