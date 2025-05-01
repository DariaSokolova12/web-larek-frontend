import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { Page } from './components/pages';
import { AppState } from './components/AppApi';
import { Card } from './components/card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { LarekAPI } from './components/services';
import { API_URL, CDN_URL } from './utils/constants';
import { Modal } from './components/features/modal';
import { Basket } from './components/features/basket';
import { Order, FormContacts } from './components/order';
import { ICardProduct, IContactsForm, IOrder, IOrderForm, paymentType } from './types';
import { Success } from './components/order-complete';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

function onClickForPayment(e: Event) {
	events.emit('payment:change', e.target);
}

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contacts = new FormContacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});
const order = new Order(cloneTemplate(orderTemplate), events, {
	onClick: onClickForPayment,
});

// Дальше идет бизнес-логика

// Функция для открытия модального окна с новым контентом
const openModalWithContent = (content: HTMLElement) => {
   modal.close(); // Закрываем текущее модальное окно
   modal.render({ content }); // Рендерим новый контент в модальном окне
};

// Изменились элементы каталога
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
	api.orderProduct(appData.order)
		.then((result) => {
			appData.clearBasket();
			page.counter = appData.getBasket().length;
			success.total = result.total;
			openModalWithContent(success.render({}));
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось состояние валидации формы
events.on('TErrorsOrder:change', (errors: Partial<IOrder>) => {
	const { address } = errors;
	order.valid = !address;
	order.errors = Object.values({ address }).filter((i) => !!i).join('; ');
});

events.on('TErrorsContacts:change', (errors: Partial<IOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone }).filter((i) => !!i).join('; ');
});

// Изменилось одно из полей формы заказа 
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm; value: string }) => {
	appData.setOrderField(data.field, data.value);
});

events.on(/^contacts\.[^:]*:change/, (data: { field: keyof IContactsForm; value: string }) => {
	appData.setContactField(data.field, data.value);
});

// Открыть форму заказа
events.on('order:open', () => {
	const orderContent = order.render({
		address: '',
		errors: [],
		valid: false,
	});
	openModalWithContent(orderContent);
});

// Открыть карточку
events.on('card:select', (item: ICardProduct) => {
   const card = new Card(cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
         events.emit('item:toggle', item);
         page.counter = appData.getBasket().length;
         card.buttonText = item.status; // Обновляем статус кнопки
      },
   });
   
   // Рендерим контент карточки с переданными параметрами
   const cardContent = card.render({
      title: item.title,
      image: item.image,
      buttonText: item.status, // Здесь используем item.status для текста кнопки
      description: item.description,
      price: item.price,
      category: item.category,
   });
   openModalWithContent(cardContent);
});

// Открыть корзину
events.on('basket:open', () => {
	// Просто открываем корзину без пересоздания списка товаров
	basket.total = appData.getTotal();
	basket.selected = appData.getBasket();
	openModalWithContent(basket.render());
});

// Обработчик изменения состояния товара в корзине
events.on('item:toggle', (item: ICardProduct) => {
	appData.toggleBasket(item); // Тоглим состояние товара в корзине
	const basketItems = appData.getBasket();
	page.counter = basketItems.length;
	// Сразу после изменения корзины вызываем событие basket:changed
	events.emit('basket:changed', basketItems);
});

// Обработчик события basket:changed
events.on('basket:changed', (items: ICardProduct[]) => {
	// Рендерим корзину с обновленным списком товаров
	basket.items = items.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('item:toggle', item); // Тоглим состояние товара в корзине
			},
		});
		const cardIndex = index + 1;
		card.index = cardIndex.toString();
		return card.render({
			title: item.title,
			price: item.price,
		});
	});

	// Обновляем сумму и выбранные товары в корзине
	basket.total = appData.getTotal();
	basket.selected = items;

	// Рендерим корзину
	openModalWithContent(basket.render());
});

// Способ оплаты
events.on('payment:change', (name: HTMLElement) => {
	if (!name.classList.contains('button_alt-active')) {
		order.paymentMethod(name);
		const atributeName = paymentType[name.getAttribute('name')]
		appData.order.payment = atributeName;
	}
});

// Отправка формы доставки
events.on('order:submit', () => {
	openModalWithContent(contacts.render({
		phone: '',
		email: '',
		valid: false,
		errors: [],
	}));
	const items = appData.basket.map(item => item.id);
	appData.order.items = items;
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокируем прокрутку
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем каталог с сервера
api.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
