const initialTasks = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const storageKey = "todoTasks";
const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const template = document.querySelector("#to-do__item-template");
const itemElement = template.content.querySelector(".to-do__item");

function loadTasks() {
  try {
    const tasks = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(tasks) && tasks.every((task) => typeof task === "string")) {
      return tasks;
    }
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
  }

  return initialTasks;
}

function createItem(item) {
  const clone = itemElement.cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = item;

  deleteButton.addEventListener("click", () => {
    clone.remove();
    saveTasks(getTasksFromDOM());
  });

  duplicateButton.addEventListener("click", () => {
    const newItem = createItem(textElement.textContent);
    listElement.prepend(newItem);
    saveTasks(getTasksFromDOM());
  });

  editButton.addEventListener("click", () => {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
  });

  textElement.addEventListener("blur", () => {
    textElement.setAttribute("contenteditable", "false");
    textElement.textContent = textElement.innerText.trim();
    saveTasks(getTasksFromDOM());
  });

  return clone;
}

function getTasksFromDOM() {
  const itemTextElements = listElement.querySelectorAll(".to-do__item-text");
  const tasks = [];

  itemTextElements.forEach((textElement) => {
    tasks.push(textElement.textContent);
  });

  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function handleSubmit(event) {
  event.preventDefault();

  const task = inputElement.value.trim();
  if (!task) {
    return;
  }

  listElement.prepend(createItem(task));
  saveTasks(getTasksFromDOM());
  formElement.reset();
}

formElement.addEventListener("submit", handleSubmit);

const items = loadTasks();
items.forEach((item) => {
  listElement.append(createItem(item));
});
