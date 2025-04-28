import { deleteCard as apiDeleteCard, likeCard as apiLikeCard, unlikeCard as apiUnlikeCard } from './api.js';

export function createCard(cardData, userId, imageClickCallback) {
  const template = document.getElementById('card-template').content;
  const cardElement = template.querySelector('.places__item').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  // Создаём счётчик лайков
  const likeCount = document.createElement('span');
  likeCount.classList.add('card__like-count');
  likeCount.textContent = cardData.likes.length;

  // Обёртка для кнопки лайка и счётчика
  const likeGroup = document.createElement('div');
  likeGroup.classList.add('card__like-group');
  likeGroup.append(likeButton, likeCount);

  // Добавляем обёртку в описание карточки после заголовка
  const description = cardElement.querySelector('.card__description');
  description.append(likeGroup);

  // Настройка содержимого
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Удаление карточки (только свой)
  if (cardData.owner._id === userId) {
    deleteButton.addEventListener('click', () => {
      apiDeleteCard(cardData._id)
        .then(() => cardElement.remove())
        .catch(err => console.error(err));
    });
  } else {
    deleteButton.remove();
  }

  // Инициализация состояния лайка
  if (cardData.likes.some(u => u._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }
  // Обработчик лайка/дизлайка
  likeButton.addEventListener('click', () => {
    const action = likeButton.classList.contains('card__like-button_is-active')
      ? apiUnlikeCard
      : apiLikeCard;
    action(cardData._id)
      .then(updatedCard => {
        cardData.likes = updatedCard.likes;
        likeCount.textContent = updatedCard.likes.length;
        likeButton.classList.toggle('card__like-button_is-active');
      })
      .catch(err => console.error(err));
  });

  // Открытие попапа просмотра изображения
  cardImage.addEventListener('click', () => imageClickCallback(cardData));

  return cardElement;
}