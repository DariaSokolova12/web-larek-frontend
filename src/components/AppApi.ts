import { Model } from './base/modal';
import {
	ICardProduct,
	IOrderForm,
	IOrder,
	IContactsForm,
	IAppData,
} from '../types';
import { TErrorsContacts, TErrorsOrder } from '../types';

export class AppState extends Model<IAppData>  {
	basketItem: ICardProduct[] = [];
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
			if (!this.basketItem.includes(item)) {
				this.basketItem.push(item);
			}
			item.status = 'closed';
		} else if (item.status === 'closed') {
			const index = this.basketItem.indexOf(item);
			if (index !== -1) {
				this.basketItem.splice(index, 1);
			}
			item.status = 'active';
		}
		item.itemCount = this.basketItem.length;
		this.emitChanges('basket:changed', this.basketItem);
	}

	clearBasket() {
		for (let i = 0; i < this.basketItem.length; i++) {
			this.basketItem[i].status = 'active';
		}
		this.basketItem.length = 0;
	}

	getTotal() {
		return this.basketItem.reduce((a, c) => a + c.price, 0);
	}

	getBasket(): ICardProduct[] {
		return this.basketItem;
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
    
}