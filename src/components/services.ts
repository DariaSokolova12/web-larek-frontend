import { Api, ApiListResponse } from './base/api';
import { IOrder, ICardProduct, ISuccess, } from '../types';


export class LarekAPI extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string) {
		super(baseUrl);
		this.cdn = cdn;
	}

	getProductList(): Promise<ICardProduct[]> {
		return this.get('/product').then((data: ApiListResponse<ICardProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderProduct(order: IOrder): Promise<ISuccess> {
		return this.post('/order', order).then(
			(data: ISuccess) => data);
	}
}