let user = {
  nickname: "",
  password: "",
  avatar: "",
  autoLogin: false,
  categories: [
    { color: "rgb(220, 134, 14)", categoryName: "House" },
    { color: "rgb(14, 220, 134)", categoryName: "Family" },
    { color: "rgb(14, 165, 220)", categoryName: "Work" },
  ],
  today: {
    date: "",
    tasks: {},
  },
  tasks: [],
  completedTasks: [],
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
};

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
  switch (page) {
    case "Home":
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

function showHomePage() {
  let needUser = localStorage.getItem("user");
  let user = JSON.parse(needUser);
  homePage.id = "";
  const helloTitle = document.querySelector(".hp-hello-title");
  helloTitle.textContent = `Hello, ${user.nickname}`;
  const todayDateText = document.querySelector(".hp-today-tasks-date");
  todayDateText.innerHTML = `Today <span>(${moment().format("LL")})</span>`;
  let currentDate = moment().format("L");
  //   let splittedDate = currentDate.split("/");
  //   let currentDay = splittedDate[0];
  user.today.date = currentDate;
  for (let i = 0; i < user.tasks.length; i++) {
    const needTask = user.tasks.find((item) => item.dueTo == currentDate);
    if (needTask != null || needTask != undefined) {
      if (user.today.tasks.find((e) => e.task == needTask) == false) {
        user.today.tasks.push(needTask);
      }
    }
  }
  localStorage.setItem("user", JSON.stringify(user));
}

function showAddTaskPage() {
  let needUser = localStorage.getItem("user");
  let user = JSON.parse(needUser);
  addTaskPage.id = "";
  const categoriesContainer = document.querySelector(
    ".addtask-page-category-container"
  );
  categoriesContainer.innerHTML = "";
  for (let i = 0; i < user.categories.length; i++) {
    const categoryButton = document.createElement("button");
    categoryButton.className = "addtask-category-item";
    categoryButton.style.backgroundColor = user.categories[i].color;
    categoryButton.textContent = user.categories[i].categoryName;
    categoriesContainer.appendChild(categoryButton);
  }
}

function addEventListenersToNavButtons() {
  homePageButton.addEventListener("click", function () {
    openPage("Home");
  });
  addTaskPageButton.addEventListener("click", function () {
    openPage("AddTask");
  });
}
