import { ISuccess, ISuccessActions } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/components";

export class Success extends Component<ISuccess> {
  // Элементы, с которыми будем работать
  protected _close: HTMLElement;
  protected _total: HTMLElement;

  constructor(container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    // Инициализация элементов
    this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
    this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

    // Обработчик клика на кнопку закрытия
    if (actions?.onClick) {
      this._close.addEventListener('click', actions.onClick);
    }
  }

  // Устанавливаем общий итог
  set total(total: string | number) {
    this.setText(this._total, `Списано ${total} синапсов`);
  }
}
