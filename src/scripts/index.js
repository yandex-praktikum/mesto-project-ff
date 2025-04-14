import "core-js/stable";
import "regenerator-runtime/runtime";

import { initialCards } from "./cards.js";
import { images } from "../utils/images.js";
import { createCard, deleteCard } from "./card.js";
import { openPopup, closePopup } from "./modal.js";
import "../pages/index.css";  // Импорт стилей

// Инициализация аватара и логотипа
const avatar = document.querySelector(".profile__image");
avatar.style.backgroundImage = `url(${images["avatar.jpg"]})`;

const logo = document.querySelector(".header__logo");
logo.src = images["logo.svg"];

// Добавляем класс анимации ко всем попапам
const popups = document.querySelectorAll(".popup");
popups.forEach((popup) => {
  popup.classList.add("popup_is-animated");
});

// Определяем элементы попапа для просмотра изображения
const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

// Именованный обработчик клика по изображению карточки
function handleCardImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(imagePopup);
}

// Отрисовка карточек
const placesList = document.querySelector(".places__list");
initialCards.forEach((cardData) => {
  const card = createCard(cardData, deleteCard, handleCardImageClick);
  placesList.appendChild(card);
});

// Обработчики закрытия попапов (по крестику)
const popupCloseButtons = document.querySelectorAll(".popup__close");
popupCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    closePopup(popup);
  });
});

// Редактирование профиля
const editButton = document.querySelector(".profile__edit-button");
const editPopup = document.querySelector(".popup_type_edit");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const editForm = document.forms["edit-profile"];
const nameInput = editForm.querySelector(".popup__input_type_name");
const jobInput = editForm.querySelector(".popup__input_type_description");

editButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(editPopup);
});

function handleProfileSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closePopup(editPopup);
}

editForm.addEventListener("submit", handleProfileSubmit);

// Добавление новых карточек
const addButton = document.querySelector(".profile__add-button");
const newCardPopup = document.querySelector(".popup_type_new-card");
const newCardForm = document.forms["new-place"];
const cardNameInput = newCardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = newCardForm.querySelector(".popup__input_type_url");

addButton.addEventListener("click", () => {
  newCardForm.reset();
  openPopup(newCardPopup);
});

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  const card = createCard(newCardData, deleteCard, handleCardImageClick);
  placesList.prepend(card);
  closePopup(newCardPopup);
}

newCardForm.addEventListener("submit", handleNewCardSubmit);