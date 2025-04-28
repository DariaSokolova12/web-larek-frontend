import { IEvents } from './events';

/**
 * Гарда для проверки на модель
 * @param obj - Объект для проверки
 * @returns true, если объект является экземпляром Model
 */
export const isModel = (obj: unknown): obj is Model<any> => {
  return obj instanceof Model;
};

/**
 * Базовая модель, чтобы можно было отличить её от простых объектов с данными
 */
export abstract class Model<T> {
  protected data: T;

  constructor(data: Partial<T>, protected events: IEvents) {
    this.data = { ...data } as T;
  }

  /**
   * Сообщить всем, что модель изменилась
   * @param event - Событие, которое будет эмитироваться
   * @param payload - Дополнительные данные для события
   */
  emitChanges(event: string, payload?: object) {
    this.events?.emit(event, payload ?? {});
  }
}
