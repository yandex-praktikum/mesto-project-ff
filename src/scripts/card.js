export function createCard(cardData, deleteCallback, imageClickCallback) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  // Настройка карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Добавляем обработчик удаления карточки
  deleteButton.addEventListener("click", () => deleteCallback(cardElement));

  // Добавляем именованный обработчик лайка
  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", handleLikeClick);

  // Добавляем обработчик клика по изображению карточки
  cardImage.addEventListener("click", () => {
    imageClickCallback(cardData);
  });

  return cardElement;
}

export function handleLikeClick(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

export function deleteCard(cardElement) {
  cardElement.remove();
}