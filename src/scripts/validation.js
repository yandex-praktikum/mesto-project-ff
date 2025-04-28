// Паттерн для полей "Имя", "О себе" и "Название"
const textPattern = /^[A-Za-zА-Яа-яЁё\s-]+$/;
const textErrorMessage =
  "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы";

/** Функция показа ошибки */
function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

/** Функция скрытия ошибки */
function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = "";
}

/** Проверка валидности поля в реальном времени */
function checkInputValidity(formElement, inputElement, config) {
  const name = inputElement.name;
  const value = inputElement.value.trim();

  if (!value) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
    return false;
  }
  // Длина полей
  if (name === "name" && (value.length < 2 || value.length > 40)) {
    showInputError(
      formElement,
      inputElement,
      "Должно быть от 2 до 40 символов",
      config
    );
    return false;
  }
  if (name === "description" && (value.length < 2 || value.length > 200)) {
    showInputError(
      formElement,
      inputElement,
      "Должно быть от 2 до 200 символов",
      config
    );
    return false;
  }
  if (name === "place-name" && (value.length < 2 || value.length > 30)) {
    showInputError(
      formElement,
      inputElement,
      "Должно быть от 2 до 30 символов",
      config
    );
    return false;
  }
  // Регулярка для текстовых полей
  if (
    (name === "name" || name === "description" || name === "place-name") &&
    !textPattern.test(value)
  ) {
    showInputError(formElement, inputElement, textErrorMessage, config);
    return false;
  }
  // Проверка URL
  if (inputElement.type === "url" && !inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
    return false;
  }

  hideInputError(formElement, inputElement, config);
  return true;
}

/** Проверка на наличие невалидных полей */
function hasInvalidInput(inputList, config) {
  return inputList.some(
    (input) => !checkInputValidity(input.form, input, config)
  );
}

/** Переключение состояния кнопки отправки */
function toggleButtonState(inputList, buttonElement, config) {
  if (hasInvalidInput(inputList, config)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

/** Установка слушателей и создание элементов ошибок */
function setEventListeners(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  // Добавляем <span> для ошибок, если нет
  inputList.forEach((input) => {
    if (!formElement.querySelector(`.${input.name}-error`)) {
      const errorEl = document.createElement("span");
      errorEl.classList.add(`${input.name}-error`);
      formElement.insertBefore(errorEl, input.nextSibling);
    }
  });

  // Деактивируем кнопку при инициализации
  toggleButtonState(inputList, buttonElement, config);

  // Живая проверка при вводе
  inputList.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(formElement, input, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

/** Включение валидации всех форм */
export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((form) => setEventListeners(form, config));
}

/** Очистка ошибок и деактивация кнопки */
export function clearValidation(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((input) => hideInputError(formElement, input, config));
  buttonElement.classList.add(config.inactiveButtonClass);
  buttonElement.disabled = true;
}
