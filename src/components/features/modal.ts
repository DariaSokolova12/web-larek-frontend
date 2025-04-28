import { Component } from "../base/components";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { IModalData } from "../../types";

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Находим элементы внутри контейнера
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Обработчик клика на кнопке закрытия
        this._closeButton.addEventListener('click', this.close.bind(this));

        // Обработчик клика по контейнеру для закрытия окна, только если клик на фоне
        this.container.addEventListener('click', (event) => {
            // Закрытие окна, если клик по фону, а не по контенту
            if (event.target === this.container) {
                this.close();
            }
        });

        // Чтобы клик по контенту не закрывал окно
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    // Устанавливаем контент окна
    set content(value: HTMLElement | null) {
        if (value) {
            this._content.replaceChildren(value);
        } else {
            this._content.innerHTML = ''; // Очищаем контент при закрытии
        }
    }

    // Открытие модального окна
    open() {
        this.toggleClass(this.container, 'modal_active', true);
        this.events.emit('modal:open');  // Отправляем событие открытия
    }

    // Закрытие модального окна
    close() {
        console.log('Закрытие модального окна'); // Для отладки
        this.container.classList.remove('modal_active');
        this.content = null;  // Очищаем контент
        this.events.emit('modal:close'); // Отправляем событие закрытия
    }

    // Метод рендера для обновления данных
    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open(); // Открываем модальное окно при рендере
        return this.container;
    }
}

 