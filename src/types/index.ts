export interface IBasketView {
	items: HTMLElement[];
	total: number | string;
	selected: string[];
}

export interface IModalData {
   content: HTMLElement;
}

export interface IFormState {
   valid: boolean;
   errors: string[];
}

export interface IPage {
	catalog: HTMLElement[]; // каталог карт выводимых на сайт
	locked: boolean; // открыта ли карточка
}

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccessActions {
	onClick: () => void;
}

// Оформление заказа
export interface ISuccess {
	id: string; // Идентификатор завершенного заказа
	total: number; // Цена заказа (Итог)
}

export interface ICardActions {
   onClick: (event: MouseEvent) => void;
}

// Интерфейс описание карточки
export interface ICardProduct {
	id: string; // id
	category: string; // категория товара
	image: string; // картинка
	description: string; // описание товара
	title: string; // название товара
	price: number | null; // цена
    status: 'active' | 'closed';
}

export type TErrorsOrder = Partial<Record<keyof IOrder, string>>; // тип описывающий ошибки интерфейса IOrder
export type TErrorsContacts = Partial<Record<keyof IContacts, string>>; // тип описывающий ошибки интерфейса IContacts

// Тип категории товара
export const categoryType: { [value: string]: string } = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
   'кнопка': 'card__category_button',
	'дополнительное': 'card__category_additional',
   'другое': 'card__category_other',
};

export const paymentType: { [value: string]: string } = {
	'card': 'online',
	'cash': 'offline',
};

// Адрес доставки товара
export interface IOrderForm {
	payment: string; // способ оплаты (при получении/онлайн)
	address: string; // адресс
}

// Контактные данные
export interface IContactsForm {
	email: string; // email
	phone: string; // телефон
}

export interface IContacts extends IContactsForm {
	itemsContact: string[];
}

export interface ICardItem extends ICardProduct {
	buttonText: string;
	itemCountProducts: string | number;
}

// Список товаров
export interface IOrder extends IOrderForm, IContactsForm {
	items: string[];
	total: number | string;
}

export interface IAppData {
	basketItem: ICardProduct[];
	catalog: ICardProduct[];
	order: IOrder;
	TErrorsOrder: TErrorsOrder;
	TErrorsContacts: TErrorsContacts;
	toggleBasket(item: ICardProduct): void;
	clearBasket(): void;
	getTotal(): number;
	getBasket(): ICardProduct[];
	setCatalog(items: ICardProduct[]): void;
	setOrderField(field: keyof IOrderForm, value: string): void;
	setContactField(field: keyof IContactsForm, value: string): void;
	validateOrder(): boolean;
	validateContacts(): boolean;
}