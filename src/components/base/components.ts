export abstract class Component<T = {}> {
    protected constructor(protected readonly container: HTMLElement) {
    }
  
    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {
      if (element) {
        element.textContent = String(value);
      }
    }
  
    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
      element.classList.toggle(className, force);
    }
  
    // Установить изображение с альтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
      if (element) {
        element.src = src;
        if (alt) element.alt = alt;
      }
    }
  
    // Установить или удалить атрибут disabled
    setDisabled(element: HTMLElement, state: boolean) {
      if (element) {
        if (state) element.setAttribute('disabled', 'disabled');
        else element.removeAttribute('disabled');
      }
    }
  
    // Скрыть элемент
    protected setHidden(element: HTMLElement) {
      element.style.display = 'none';
    }
  
    // Показать элемент
    protected setVisible(element: HTMLElement) {
      element.style.removeProperty('display');
    }
  
    // Рендеринг компонента
    render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;
    }
  }
  