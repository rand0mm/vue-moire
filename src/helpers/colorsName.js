export default function colorName (id) {
  let str = '';
  switch (id) {
    case 20:
      str = 'Красный'
      break;
    case 21:
      str = 'Синий'
      break;
    case 22:
      str = 'Зеленый'
      break;
    case 23:
      str = 'Желтый'
      break;
    case 24:
      str = 'Фиолетовый'
      break;
    case 25:
      str = 'Розовый'
      break;
    case 26:
      str = 'Черный'
      break;
    case 27:
      str = 'Белый'
      break;
    default:
      str = `Другой цвет`;
  }

  return str;

}
