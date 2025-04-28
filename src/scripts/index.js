import "core-js/stable";
import "regenerator-runtime/runtime";

import "../pages/index.css";
import { enableValidation, clearValidation } from "./validation.js";
import {
  getUserInfo,
  getInitialCards,
  setUserInfo,
  addCard,
  deleteCard as apiDeleteCard,
  likeCard as apiLikeCard,
  unlikeCard as apiUnlikeCard,
  updateAvatar
} from "./api.js";
import { openPopup, closePopup } from "./modal.js";
import { createCard } from "./card.js";
import { images } from "../utils/images.js";

// Инициализация логотипа и аватара из ассетов
const logoElement = document.querySelector('.header__logo');
logoElement.src = images['logo.svg'];

// DOM-элементы профиля
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');

// Валидация
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};
enableValidation(validationConfig);

// Кнопки и попапы
const editButton = document.querySelector('.profile__edit-button');
const avatarButton = document.querySelector('.profile__avatar-edit-button');
// Устанавливаем иконку редактирования аватара из ассетов
avatarButton.style.backgroundImage = `url(${images['edit-icon.svg']})`;
avatarButton.style.backgroundSize = 'contain';
const addButton = document.querySelector('.profile__add-button');

const editPopup = document.querySelector('.popup_type_edit');
const avatarPopup = document.querySelector('.popup_type_avatar');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Формы и поля
const editForm = document.forms['edit-profile'];
const avatarForm = document.forms['update-avatar'];
const newCardForm = document.forms['new-place'];

const nameInput = editForm.querySelector('.popup__input_type_name');
const jobInput = editForm.querySelector('.popup__input_type_description');
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar-url');
const cardNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = newCardForm.querySelector('.popup__input_type_url');

// Список карточек
const placesList = document.querySelector('.places__list');
let currentUserId;

// Обработчики
function handleCardClick(cardData) {
  const popupImage = imagePopup.querySelector('.popup__image');
  const popupCaption = imagePopup.querySelector('.popup__caption');

  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(imagePopup);
}

function handleEditClick() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editForm, validationConfig);
  openPopup(editPopup);
}

function handleAvatarClick() {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openPopup(avatarPopup);
}

function handleAddClick() {
  newCardForm.reset();
  clearValidation(newCardForm, validationConfig);
  openPopup(newCardPopup);
}

function handleProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = editForm.querySelector('.popup__button');
  submitBtn.textContent = 'Сохранение...';

  setUserInfo({ name: nameInput.value, about: jobInput.value })
    .then(user => {
      profileTitle.textContent = user.name;
      profileDescription.textContent = user.about;
      closePopup(editPopup);
    })
    .catch(err => console.error(err))
    .finally(() => submitBtn.textContent = 'Сохранить');
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = avatarForm.querySelector('.popup__button');
  submitBtn.textContent = 'Сохранение...';

  updateAvatar({ avatar: avatarInput.value })
    .then(user => {
      profileAvatar.style.backgroundImage = `url(${user.avatar})`;
      closePopup(avatarPopup);
    })
    .catch(err => console.error(err))
    .finally(() => submitBtn.textContent = 'Сохранить');
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = newCardForm.querySelector('.popup__button');
  submitBtn.textContent = 'Создание...';

  addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then(cardData => {
      const card = createCard(cardData, currentUserId, handleCardClick);
      placesList.prepend(card);
      closePopup(newCardPopup);
    })
    .catch(err => console.error(err))
    .finally(() => submitBtn.textContent = 'Создать');
}

// Закрытие попапов
document.querySelectorAll('.popup__close').forEach(btn => {
  btn.addEventListener('click', () => closePopup(btn.closest('.popup')));
});

// Навешиваем слушатели
editButton.addEventListener('click', handleEditClick);
avatarButton.addEventListener('click', handleAvatarClick);
addButton.addEventListener('click', handleAddClick);
editForm.addEventListener('submit', handleProfileSubmit);
avatarForm.addEventListener('submit', handleAvatarSubmit);
newCardForm.addEventListener('submit', handleNewCardSubmit);

// Инициализация данных
Promise.all([getUserInfo(), getInitialCards()])
  .then(([user, cards]) => {
    currentUserId = user._id;
    profileTitle.textContent = user.name;
    profileDescription.textContent = user.about;
    profileAvatar.style.backgroundImage = `url(${user.avatar})`;

    cards.forEach(cardData => {
      const card = createCard(cardData, currentUserId, handleCardClick);
      placesList.append(card);
    });
  })
  .catch(err => console.error(err));
