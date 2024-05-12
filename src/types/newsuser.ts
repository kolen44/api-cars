export interface IUser {
  response?: any; //На случай ошибки, так как она может быть любой то прописываем any просто для проверки явности ошибки
  telephone_number: string;
  id: string;
  fio: string;
}
