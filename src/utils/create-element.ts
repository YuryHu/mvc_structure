export const createElement = <TagName extends keyof HTMLElementTagNameMap>(
  tagName: TagName,
  classNames: string[],
  text: string | null = null,
): HTMLElementTagNameMap[TagName] => {
  const element = document.createElement(tagName);

  if (classNames.length) {
    classNames.forEach((className) => element.classList.add(className));
  }

  if (text) {
    element.innerText = text;
  }

  return element;
};
