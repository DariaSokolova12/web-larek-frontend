import { Component } from '../base/components';
import { ensureElement, createElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IBasketView, ICardProduct } from '../../types';

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _buttonDelete: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    // Инициализация элементов
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._price = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');
    this._buttonDelete = this.container.querySelector('.basket__item-delete');

    // Добавляем события для кнопок
    this._button?.addEventListener('click', () => events.emit('order:open'));
    this._buttonDelete?.addEventListener('click', () => events.emit('item:toggle'));

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    // Обновляем список товаров или показываем сообщение, если корзина пуста
    this._list.replaceChildren(
      ...items.length ? items : [createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' })]
    );
    this.setDisabled(this._button, items.length === 0);
  }

  set selected(items: ICardProduct[]) {
    // Включаем/выключаем кнопку в зависимости от выбранных товаров
    this.setDisabled(this._button, items.length === 0);
  }

  set total(total: number) {
    // Обновляем стоимость корзины
    this.setText(this._price, `${total} синапсов`);
  }
}
