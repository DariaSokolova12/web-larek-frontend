import { Form } from './features/forms';
import { IOrderForm, IContactsForm, IActions } from '../types';
import {  IEvents } from './base/events';
import { ensureElement } from '../utils/utils';



export class Order extends Form<IOrderForm> {
   private _cashBtn: HTMLButtonElement;
   private _cardBtn: HTMLButtonElement;

   constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
      super(container, events);

      this._cardBtn = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
      this._cashBtn = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
      this._cardBtn.classList.add('button_alt-active');

      if (actions?.onClick) {
         this._cardBtn.addEventListener('click', actions.onClick);
         this._cashBtn.addEventListener('click', actions.onClick);
      }
   }

   public set address(value: string) {
      const addressInput = this.container.elements.namedItem('address') as HTMLInputElement;
      if (addressInput) {
         addressInput.value = value;
      }
   }

   public paymentMethod(value: HTMLElement) {
      this._cardBtn.classList.toggle('button_alt-active');
      this._cashBtn.classList.toggle('button_alt-active');
   }
}


export class FormContacts extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

   set phone(value: string) {
      (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
   }

	set email(value: string) {
      (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
   }
}