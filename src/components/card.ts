import { Component } from './base/components';
import { ICardActions, ICardItem, categoryType } from '../types/index';
import { ensureElement } from '../utils/utils';

export class Card extends Component<ICardItem> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _buttonText: string;
  protected _index: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    // Инициализация элементов
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._image = container.querySelector('.card__image');
    this._description = container.querySelector('.card__text');
    this._button = container.querySelector('.card__button');
    this._category = container.querySelector('.card__category');
    this._price = container.querySelector('.card__price');
    this._index = container.querySelector('.basket__item-index');

    // Обработчик кликов на карточку
    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  // Устанавливаем уникальный идентификатор для карточки
  set id(value: string) {
    super.container.dataset.id = value;
  }

  // Получаем идентификатор карточки
  get id(): string {
    return this.container.dataset.id || '';
  }

  // Устанавливаем и получаем название карточки
  set title(value: string) {
    super.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || '';
  }

  // Устанавливаем и получаем индекс карточки
  get index(): string {
    return this._index.textContent || '';
  }

  set index(value: string | string[]) {
    super.setText(this._index, value);
  }

  // Устанавливаем текст на кнопке в зависимости от статуса
  set buttonText(status: string) {
    if (status === 'active') {
      super.setText(this._button, 'В корзину');
    } else {
      super.setText(this._button, 'Убрать с корзины');
    }
  }

  // Устанавливаем изображение карточки
  set image(value: string) {
    super.setImage(this._image, value, this.title);
  }

  // Устанавливаем категорию карточки и добавляем класс для категории
  set category(value: string) {
    super.setText(this._category, value);
    this.addCategoryClass(value);
  }

  // Добавляем класс для категории
  addCategoryClass(value: string) {
    this._category.classList.add(categoryType[value]);
  }

  // Устанавливаем цену карточки
  set price(value: null | number) {
    super.setText(this._price, value !== null ? `${value} синапсов` : 'Бесценно');
    // Если цена не указана, кнопка становится неактивной
    if (this._button && value === null) {
      this.setDisabled(this._button, true);
    }
  }

  // Устанавливаем описание карточки
  set description(value: string | string[]) {
    super.setText(this._description, value);
  }
}
