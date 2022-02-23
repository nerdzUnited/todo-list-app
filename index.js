// declare variables - selecting html elements
let userInput = document.querySelector("#user-input");
let submitBtn = document.querySelector("#submit");
let todoList = document.querySelector("#todo-list");
let clearAll = document.querySelector("#clear-all");
let clearCompleted = document.querySelector("#clear-completed");

const STORAGE_KEY = "my-to-dos";

const getUserInput = () => userInput.value;
const getListLength = () => todoList.children.length;
const isLocalStoragePopulated = () =>
  localStorage.getItem(STORAGE_KEY) &&
  Object.keys(localStorage.getItem(STORAGE_KEY)).length > 0;
const getStoredTodos = () => JSON.parse(localStorage.getItem(STORAGE_KEY));

window.addEventListener("load", () => {
  if (isLocalStoragePopulated()) {
    const storedTodos = getStoredTodos();
    Object.keys(storedTodos).forEach((key) => {
      const storedTodo = storedTodos[key];
      let todo = document.createElement("div");
      todo.classList = storedTodo.classList;
      todo.dataset.timestamp = key;
      todo.textContent = storedTodo.textContent;
      todoList.append(todo);
      let checkIcon = document.createElement("i");
      if (storedTodo.classList.split(" ").includes("completed")) {
        checkIcon.classList = "fa-solid fa-circle";
      } else {
        checkIcon.classList = "fa-solid fa-circle-check";
      }
      todo.appendChild(checkIcon);

      todo.addEventListener("click", (e) =>
        toggleCompleteTodo(e, todo, checkIcon)
      );
    });
  }
});

function saveTodo(todoObj, timestamp) {
  if (isLocalStoragePopulated()) {
    const storedTodos = getStoredTodos();
    storedTodos[String(timestamp)] = todoObj;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedTodos));
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ [timestamp]: todoObj }));
  }
}

function toggleCompleteTodo(e, todo, checkIcon) {
  if (e.target !== todo) {
    todo.classList.toggle("completed");
    checkIcon.classList.toggle("fa-circle-check");
    checkIcon.classList.toggle("fa-circle");
    const storedTodos = getStoredTodos();
    if (todo.classList.contains("completed")) {
      storedTodos[todo.dataset.timestamp].classList = "todo-item completed";
    } else {
      storedTodos[todo.dataset.timestamp].classList = "todo-item";
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedTodos));
  }
}

function createTodo() {
  if (getUserInput().length > 0) {
    let todo = document.createElement("div");
    todo.setAttribute("class", "todo-item");
    const inputValue = getUserInput();
    todo.textContent = inputValue;
    todo.dataset.timestamp = Date.now();
    todoList.append(todo);
    userInput.value = "";

    const todoObj = {
      textContent: inputValue,
      classList: "todo-item",
    };
    saveTodo(todoObj, todo.dataset.timestamp);

    // create checkmark
    let checkIcon = document.createElement("i");
    checkIcon.setAttribute("class", "fa-solid fa-circle-check");
    todo.appendChild(checkIcon);

    // give it an event listener
    todo.addEventListener("click", (e) =>
      toggleCompleteTodo(e, todo, checkIcon)
    );
  }
}

submitBtn.addEventListener("click", createTodo);

userInput.addEventListener("keyup", (e) => e.keyCode === 13 && createTodo());

clearAll.addEventListener("click", () => {
  todoList.innerHTML = "";
  localStorage.removeItem(STORAGE_KEY);
});

clearCompleted.addEventListener("click", () => {
  let storedTodos;
  if (isLocalStoragePopulated()) {
    storedTodos = getStoredTodos();
  }
  const todos = document.querySelectorAll(".completed");
  todos.forEach((todo) => {
    if (storedTodos && storedTodos[todo.dataset.timestamp]) {
      delete storedTodos[todo.dataset.timestamp];
    }
    todo.remove();
  });
  if (storedTodos && Object.keys(storedTodos).length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedTodos));
  }
});
