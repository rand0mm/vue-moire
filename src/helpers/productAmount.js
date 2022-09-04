export default function productAmount(value) {
  let str = String(value)

  str = str.length > 1 ? Number(str[str.length - 1]) : Number(str);
  switch (str) {
    case 0:
      str = value < 10 ? 'Нет' : value+'товаров';
      break;
    case 1:
      str = value < 20 ? value+' товаров':value+' товар';
      break;
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      str = value < 20 ? value+' товаров' : `${value} товара`;
      break;
    default:
      str = `${value} товаров`;
  }
  return str;
}
