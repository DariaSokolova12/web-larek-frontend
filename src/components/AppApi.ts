import { Model } from './base/modal';
import {
	ICardProduct,
	IOrderForm,
	IOrder,
	IContactsForm,
	IAppData,
} from '../types';
import { TErrorsContacts, TErrorsOrder } from '../types';

export class AppState extends Model<IAppData> {
	basket: ICardProduct[] = [];
	catalog: ICardProduct[];

	order: IOrder = {
		items: [],
		address: '',
		payment: 'online',
		email: '',
		phone: '',
		total: 0,
	};

	TErrorsOrder: TErrorsOrder = {};
	TErrorsContacts: TErrorsContacts = {};

	toggleBasket(item: ICardProduct) {
		if (item.status === 'active' && item.price !== null) {
			if (!this.basket.includes(item)) {
				this.basket.push(item);
			}
			item.status = 'closed';
		} else if (item.status === 'closed') {
			const index = this.basket.indexOf(item);
			if (index !== -1) {
				this.basket.splice(index, 1);
			}
			item.status = 'active';
		}

		this.emitChanges('basket:changed', this.basket);
	}

	clearBasket() {
		this.basket = [];
	}

	getTotal() {
		return this.basket.reduce((a, c) => a + (c.price || 0), 0);
	}

	getBasket(): ICardProduct[] {
		return this.basket;
	}

	setCatalog(items: ICardProduct[]) {
		this.catalog = items.map((item) => ({
			...item,
			status: 'active',
		}));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contact:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.TErrorsOrder = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адресс';
		}

		this.TErrorsOrder = errors;
		this.events.emit('TErrorsOrder:change', this.TErrorsOrder);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.TErrorsContacts = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.TErrorsContacts = errors;
		this.events.emit('TErrorsContacts:change', this.TErrorsContacts);
		return Object.keys(errors).length === 0;
	}

	getOrderPayload(): {
		items: string[];
		total: number;
		address: string;
		payment: string;
		email: string;
		phone: string;
	} {
		return {
			items: this.basket.map((item) => item.id),
			total: this.getTotal(),
			address: this.order.address,
			payment: this.order.payment,
			email: this.order.email,
			phone: this.order.phone,
		};
	}
}
