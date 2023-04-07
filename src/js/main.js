let user = {
  nickname: "",
  password: "",
  avatar: "",
  autoLogin: false,
  categories: [
    { color: "rgb(220, 134, 14)", categoryName: "House" },
    { color: "green", categoryName: "Family" },
    { color: "rgb(14, 165, 220)", categoryName: "Work" },
  ],
  today: {
    date: "",
    tasks: [],
  },
  tasks: [],
  lastDate: "",
};

let category = {
  color: "",
  categoryName: "",
};

let task = {
  dueTo: "",
  taskName: "",
  description: "",
  category: {},
  priority: "",
  isComplete: false,
  id: "",
};

let currentPage = "";
// Pages
const navMenu = document.querySelector(".nav-menu");

const signupPage = document.querySelector(".signup-page");
const loginPage = document.querySelector(".login-page");
const homePage = document.querySelector(".home-page");
const addTaskPage = document.querySelector(".addTask-page");

//Nav menu buttons
const homePageButton = document.querySelector(".header-main-page-btn");
const addTaskPageButton = document.querySelector(".header-adding-page-btn");

start();

function start() {
  //   openPage("Signup");
  loadData();
}

function loadData() {
  if (localStorage.getItem("user")) {
    let needUser = localStorage.getItem("user");
    let user = JSON.parse(needUser);
    if (user.autoLogin) {
      openPage("Home");
    } else {
      openPage("Login");
    }
  } else {
    openPage("Signup");
  }
}

function openPage(page) {
  signupPage.id = "hidden";
  loginPage.id = "hidden";
  homePage.id = "hidden";
  addTaskPage.id = "hidden";
  homePageButton.id = "";
  addTaskPageButton.id = "";
  currentPage = page;
  switch (page) {
    case "Home":
      hideHomePage();
      showHomePage();
      navMenu.id = "";
      homePageButton.id = "header-current-btn";
      addEventListenersToNavButtons();
      break;
    case "Signup":
      showSignupPanel();
      navMenu.id = "hidden";
      break;
    case "Login":
      showLoginPanel();
      navMenu.id = "hidden";
      break;
    case "AddTask":
      hideAddTaskPage();
      showAddTaskPage();
      navMenu.id = "";
      addTaskPageButton.id = "header-current-btn";
      addEventListenersToNavButtons();
      break;
  }
}

function showSignupPanel() {
  signupPage.id = "";
  const authLoginLink = document.querySelector(".auth-page-login-link");
  authLoginLink.addEventListener("click", function (event) {
    openPage("Login");
    event.preventDefault();
  });
  let nickname = "";
  let email = "";
  let password = "";
  const signUpButton = document.querySelector(".auth-page-signup-btn");
  signUpButton.addEventListener("click", function () {
    const signupNicknameInput = document.querySelector(
      ".signup-page-nickname-input"
    );
    const signupEmailInput = document.querySelector(".signup-page-email-input");
    const signupPasswordInput = document.querySelector(
      ".signup-page-password-input"
    );

    nickname = signupNicknameInput.value;
    email = signupEmailInput.value;
    password = signupPasswordInput.value;
    if (nickname != "" && email != "" && password != "") {
      let newUser = Object.assign({}, user);
      newUser.nickname = nickname;
      newUser.email = email;
      newUser.password = password;
      localStorage.setItem("user", JSON.stringify(newUser));
      openPage("Login");
    }
  });
}

function showLoginPanel() {
  loginPage.id = "";
  const authSignupLink = document.querySelector(".auth-page-signup-link");
  authSignupLink.addEventListener("click", function (event) {
    openPage("Signup");
    event.preventDefault();
  });
  let email = "";
  let password = "";
  const logInButton = document.querySelector(".login-page-login-btn");
  logInButton.addEventListener("click", function () {
    let needUser = localStorage.getItem("user");
    let user = JSON.parse(needUser);
    const loginEmailInput = document.querySelector(".login-page-email-input");
    const loginPasswordInput = document.querySelector(
      ".login-page-password-input"
    );
    email = loginEmailInput.value;
    password = loginPasswordInput.value;
    if (email == user.email && password == user.password) {
      openPage("Home");
    }
  });
}

function openHomePage() {
  if (currentPage != "Home") {
    openPage("Home");
  }
}

function openAddTaskPage() {
  if (currentPage != "AddTask") {
    openPage("AddTask");
  }
}

function showHomePage() {
  let needUser = localStorage.getItem("user");
  let _user = JSON.parse(needUser);
  homePage.id = "";
  const helloTitle = document.querySelector(".hp-hello-title");
  helloTitle.textContent = `Hello, ${user.nickname}`;
  const todayDateText = document.querySelector(".hp-today-tasks-date");
  todayDateText.innerHTML = `Today <span>(${moment().format("LL")})</span>`;
  let currentDate = moment().format("L");
  let splittedDate = currentDate.split("/");
  let currentDay = splittedDate[0];
  let currentMonth = splittedDate[1];
  let currentYear = splittedDate[2];
  let newCurrentDate = currentYear + "-" + currentDay + "-" + currentMonth;
  _user.today.date = newCurrentDate;
  if (_user.lastDate != newCurrentDate) {
    _user.today.tasks = [];
  }
  for (let i = 0; i < _user.tasks.length; i++) {
    const needTask = _user.tasks[i];
    if (needTask.dueTo == newCurrentDate) {
      const foundTask = _user.today.tasks.find(
        (item) => item.id === needTask.id
      );
      if (!foundTask) {
        _user.today.tasks.push(needTask);
      }
    }
  }
  localStorage.setItem("user", JSON.stringify(_user));

  const todayInProgressTasksAmount = document.querySelector(
    ".hp-inprogress-tasks-amount"
  );
  const todayCompletedTasksAmount = document.querySelector(
    ".hp-completed-tasks-amount"
  );

  const todayTasksContainer = document.querySelector(".hp-today-tasks-list");
  const todayInProgressTasksButton =
    document.querySelector(".hp-inprogress-btn");
  function updateTodaySortTypesAmount() {
    let inProgressTasksAmount = 0;
    for (const inProgressTasks of _user.today.tasks) {
      if (inProgressTasks.isComplete == false) {
        inProgressTasksAmount++;
      }
    }
    let completedTasksAmount = 0;
    for (const completedTasks of _user.today.tasks) {
      if (completedTasks.isComplete == true) {
        completedTasksAmount++;
      }
    }
    todayInProgressTasksAmount.textContent = inProgressTasksAmount;
    todayCompletedTasksAmount.textContent = completedTasksAmount;
  }
  const todayCompletedTasksButton = document.querySelector(".hp-completed-btn");
  function instantiateTodayTasks(type) {
    todayTasksContainer.innerHTML = "";
    todayInProgressTasksButton.id = "";
    todayCompletedTasksButton.id = "";
    updateTodaySortTypesAmount();
    if (type === "InProgress") {
      todayInProgressTasksButton.id = "hp-current-sort-btn";
      for (const task of _user.today.tasks) {
        if (task.isComplete == false) {
          let todayTaskItem = document.createElement("div");
          todayTaskItem.className = "hp-today-task-item";

          let todayTaskItemBlock1 = document.createElement("div");
          todayTaskItemBlock1.className = "hp-today-task-item-block1";
          let todayTaskInfo = document.createElement("div");
          todayTaskInfo.className = "hp-today-task-info";
          let todayTaskName = document.createElement("p");
          todayTaskName.className = "hp-today-task-name";
          todayTaskName.textContent = task.taskName;
          todayTaskInfo.appendChild(todayTaskName);
          let todayTaskDescription = document.createElement("p");
          todayTaskDescription.className = "hp-today-task-description";
          todayTaskDescription.textContent = task.description;
          todayTaskInfo.appendChild(todayTaskDescription);
          todayTaskItemBlock1.appendChild(todayTaskInfo);
          let todayTaskCompleteCheckbox = document.createElement("input");
          todayTaskCompleteCheckbox.type = "checkbox";
          todayTaskCompleteCheckbox.className = "hp-today-task-checkbox";
          todayTaskCompleteCheckbox.addEventListener("change", function () {
            if (todayTaskCompleteCheckbox.checked == true) {
              let completedTask = task;
              completedTask.isComplete = true;
              let completedTask2 = _user.tasks.find(
                (item) => item.id == completedTask.id
              );
              completedTask2.isComplete = true;
              localStorage.setItem("user", JSON.stringify(_user));
              updateTodaySortTypesAmount();
              todayTasksContainer.removeChild(todayTaskItem);
            }
          });
          todayTaskItemBlock1.appendChild(todayTaskCompleteCheckbox);
          todayTaskItem.appendChild(todayTaskItemBlock1);

          let todayTaskItemBlock2 = document.createElement("div");
          todayTaskItemBlock2.className = "hp-today-task-item-block2";
          let todayTaskCategory = document.createElement("div");
          todayTaskCategory.className = "hp-today-task-item-category";
          todayTaskCategory.style.color = task.category.color;
          todayTaskCategory.innerHTML = `<i class="fa-solid fa-cube"></i> ${task.category.categoryName}`;
          todayTaskItemBlock2.appendChild(todayTaskCategory);
          let todayTaskPriority = document.createElement("div");
          todayTaskPriority.className = "hp-today-task-item-priority";
          todayTaskPriority.id = `priority-${task.priority}`;
          todayTaskPriority.innerHTML = `<i class="fa-solid fa-flag"></i>${
            task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
          }`;
          todayTaskItemBlock2.appendChild(todayTaskPriority);
          todayTaskItem.appendChild(todayTaskItemBlock2);

          todayTasksContainer.appendChild(todayTaskItem);
        }
      }
      for (let i = 0; i < _user.today.tasks.length; i++) {}
    } else if (type === "Completed") {
      todayCompletedTasksButton.id = "hp-current-sort-btn";
      for (const task of _user.today.tasks) {
        if (task.isComplete == true) {
          let todayTaskItem = document.createElement("div");
          todayTaskItem.className = "hp-today-task-item";
          todayTaskItem.style.backgroundColor = "rgb(240, 240, 240)";
          let todayTaskItemBlock1 = document.createElement("div");
          todayTaskItemBlock1.className = "hp-today-task-item-block1";
          let todayTaskInfo = document.createElement("div");
          todayTaskInfo.className = "hp-today-task-info";
          let todayTaskName = document.createElement("p");
          todayTaskName.className = "hp-today-task-name";
          todayTaskName.style.textDecoration = "line-through";
          todayTaskName.textContent = task.taskName;
          todayTaskInfo.appendChild(todayTaskName);
          let todayTaskDescription = document.createElement("p");
          todayTaskDescription.className = "hp-today-task-description";
          todayTaskDescription.textContent = task.description;
          todayTaskDescription.style.textDecoration = "line-through";
          todayTaskInfo.appendChild(todayTaskDescription);
          todayTaskItemBlock1.appendChild(todayTaskInfo);
          let todayTaskCompleteCheckbox = document.createElement("input");
          todayTaskCompleteCheckbox.type = "checkbox";
          todayTaskCompleteCheckbox.checked = true;
          todayTaskCompleteCheckbox.className = "hp-today-task-checkbox";
          todayTaskCompleteCheckbox.addEventListener("change", function () {
            if (todayTaskCompleteCheckbox.checked == false) {
              let completedTask = task;
              completedTask.isComplete = false;
              let completedTask2 = _user.tasks.find(
                (item) => item.id == completedTask.id
              );
              completedTask2.isComplete = false;
              localStorage.setItem("user", JSON.stringify(_user));
              updateTodaySortTypesAmount();
              todayTasksContainer.removeChild(todayTaskItem);
            }
          });
          todayTaskItemBlock1.appendChild(todayTaskCompleteCheckbox);
          todayTaskItem.appendChild(todayTaskItemBlock1);

          let todayTaskItemBlock2 = document.createElement("div");
          todayTaskItemBlock2.className = "hp-today-task-item-block2";
          let todayTaskCategory = document.createElement("div");
          todayTaskCategory.className = "hp-today-task-item-category";
          todayTaskCategory.style.color = task.category.color;
          todayTaskCategory.innerHTML = `<i class="fa-solid fa-cube"></i> ${task.category.categoryName}`;
          todayTaskItemBlock2.appendChild(todayTaskCategory);
          let todayTaskPriority = document.createElement("div");
          todayTaskPriority.className = "hp-today-task-item-priority";
          todayTaskPriority.id = `priority-${task.priority}`;
          todayTaskPriority.innerHTML = `<i class="fa-solid fa-flag"></i>${
            task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
          }`;
          todayTaskItemBlock2.appendChild(todayTaskPriority);
          todayTaskItem.appendChild(todayTaskItemBlock2);

          todayTasksContainer.appendChild(todayTaskItem);
        }
      }
    }
  }
  instantiateTodayTasks("InProgress");
  todayInProgressTasksButton.addEventListener("click", function () {
    instantiateTodayTasks("InProgress");
  });
  todayCompletedTasksButton.addEventListener("click", function () {
    instantiateTodayTasks("Completed");
  });
}

function showAddTaskPage() {
  let needUser = localStorage.getItem("user");
  let user = JSON.parse(needUser);
  addTaskPage.id = "";
  let taskName = "";
  let taskDescription = "";
  let taskDueToDate = "";
  let category = {};
  let priority = "";
  const categoriesContainer = document.querySelector(
    ".addtask-page-category-container"
  );
  categoriesContainer.innerHTML = "";
  for (let i = 0; i < user.categories.length; i++) {
    const categoryButton = document.createElement("button");
    categoryButton.className = "addtask-category-item";
    categoryButton.style.backgroundColor = user.categories[i].color;
    categoryButton.textContent = user.categories[i].categoryName;
    categoryButton.addEventListener("click", function () {
      category = user.categories[i];
      const categoryLabel = document.querySelector(".addtask-label-category");
      categoryLabel.textContent = `Category - ${category.categoryName}`;
    });
    categoriesContainer.appendChild(categoryButton);
  }
  const addTaskButton = document.querySelector(".add-task-button");
  const taskNameInput = document.querySelector(".addtask-input-name");
  const taskDescriptionInput = document.querySelector(
    ".addtask-input-description"
  );
  const taskDateInput = document.querySelector(".addtask-input-date");
  const chooseHighPriorityButton = document.querySelector(
    ".addtask-priority-high-button"
  );
  const chooseMediumPriorityButton = document.querySelector(
    ".addtask-priority-medium-button"
  );
  const chooseLowPriorityButton = document.querySelector(
    ".addtask-priority-low-button"
  );
  function chooseNewTaskPriority(_priority) {
    priority = _priority;
    let priorityLabelValue =
      priority.charAt(0).toUpperCase() + priority.slice(1);
    const priorityLabel = document.querySelector(".addtask-label-priority");
    priorityLabel.textContent = `Priority - ${priorityLabelValue}`;
  }
  chooseHighPriorityButton.addEventListener("click", function () {
    chooseNewTaskPriority("high");
  });
  chooseMediumPriorityButton.addEventListener("click", function () {
    chooseNewTaskPriority("medium");
  });
  chooseLowPriorityButton.addEventListener("click", function () {
    chooseNewTaskPriority("low");
  });
  addTaskButton.addEventListener("click", function () {
    taskName = taskNameInput.value;
    taskDescription = taskDescriptionInput.value;
    taskDueToDate = taskDateInput.value;
    if (
      taskName != "" &&
      taskDescription != "" &&
      taskDueToDate != "" &&
      priority != "" &&
      category != undefined
    ) {
      let newTask = Object.assign({}, task);
      newTask.taskName = taskName;
      newTask.description = taskDescription;
      newTask.priority = priority;
      newTask.category = category;
      newTask.dueTo = taskDueToDate;
      newTask.isComplete = false;
      newTask.id =
        taskName.slice(1) + taskName + randomIntFromInterval(1, 10000);
      user.tasks.push(newTask);
      localStorage.setItem("user", JSON.stringify(user));
    }
  });
}

function hideHomePage() {
  if (homePageButton) {
    homePageButton.removeEventListener("click", openHomePage, false);
  }
  if (addTaskPageButton) {
    addTaskPageButton.removeEventListener("click", openAddTaskPage, false);
  }
}

function hideAddTaskPage() {
  if (homePageButton) {
    homePageButton.removeEventListener("click", openHomePage, false);
  }
  if (addTaskPageButton) {
    addTaskPageButton.removeEventListener("click", openAddTaskPage, false);
  }
  const addTaskButton = document.querySelector(".add-task-button");
  if (addTaskButton) {
    addTaskButton.removeEventListener("click", arguments.callee, false);
  }
  const priorityItems = document.querySelectorAll(".add-task-priority-btn");
  priorityItems.forEach((item) => {
    item.removeEventListener("click", arguments.callee, false);
  });
  const categoryItems = document.querySelectorAll(".addtask-category-item");
  categoryItems.forEach((item) => {
    item.removeEventListener("click", arguments.callee, false);
  });
}

//
//
// Core functions
//
//
function removeEventListenerFromButtons(...buttons) {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].removeEventListener("click", arguments.callee, false);
  }
}

function addEventListenersToNavButtons() {
  if (homePageButton) {
    homePageButton.addEventListener("click", openHomePage);
  }
  if (addTaskPageButton) {
    addTaskPageButton.addEventListener("click", openAddTaskPage);
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
