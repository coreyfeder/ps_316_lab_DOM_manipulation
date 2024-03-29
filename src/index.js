// import "./styles.css";

// ...welp, that didn't work. And I'm failing to make it work.
// So, I'm sticking it back where it wants to be.
let cssLink = document.createElement('link')
cssLink.setAttribute('rel', 'stylesheet');
cssLink.setAttribute('href', 'src/styles.css');
document.getElementsByTagName('head')[0].appendChild(cssLink);


// Menu data structure
//   (Treat this the source data. Don't rearrange or rename anything.)
const menuLinks = [
  { text: "about", href: "/about" },
  {
    text: "catalog",
    href: "#",
    subLinks: [
      { text: "all", href: "/catalog/all" },
      { text: "top selling", href: "/catalog/top" },
      { text: "search", href: "/catalog/search" },
    ],
  },
  {
    text: "orders",
    href: "#",
    subLinks: [
      { text: "new", href: "/orders/new" },
      { text: "pending", href: "/orders/pending" },
      { text: "history", href: "/orders/history" },
    ],
  },
  {
    text: "account",
    href: "#",
    subLinks: [
      { text: "profile", href: "/account/profile" },
      { text: "sign out", href: "/account/signout" },
    ],
  },
];


const mainEl = document.querySelector("main");
const topMenuEl = document.getElementById("top-menu");
const subMenuEl = document.getElementById("sub-menu");
const topMenuLinks = document.querySelectorAll("#top-menu a");


// init
( () => {
  let newNode;
  
  mainEl.style.backgroundColor = "var(--main-bg)";
  newNode = document.createElement("h1");
  newNode.textContent = "DOM Manipulation";
  mainEl.appendChild(newNode);
  mainEl.classList.add("flex-ctr");

  topMenuEl.style.height = "100%";
  topMenuEl.style.backgroundColor = "var(--top-menu-bg)";
  topMenuEl.classList.add("flex-around");

  subMenuEl.style.height = "100%";
  subMenuEl.style.backgroundColor = "var(--sub-menu-bg)";
  subMenuEl.classList.add("flex-around");
  subMenuEl.style.position = "absolute";
  subMenuEl.style.top = "0";
  
  for (let link of menuLinks) {
    // create the top-level nav links
    let newLink = document.createElement("a");
    newLink.setAttribute("href", link.href);
    newLink.textContent = link.text;
    topMenuEl.appendChild(newLink);
    // create the sub-menu nav links as children
    if (link.subLinks) {
      for (let subLink of link["subLinks"]) {
        let newSubLink = document.createElement("a");
        newSubLink.setAttribute("href", subLink.href);
        newSubLink.textContent = subLink.text;
        newLink.appendChild(newSubLink);
      };
    };
  };
  // but keep the subMenu nodes hidden while they're not in the subMenu.
  let submenuStorage = document.createElement("style");
  submenuStorage.textContent = '#top-menu a a { display: none; }';
  document.querySelector("head").appendChild(submenuStorage);

})();  


// don't pass gloabls to the helper functions

function getActive() {
  // would querySelector(".active") be better? or getElementsByClassName("active")?
  return document.querySelector("#top-menu a.active");
}

function isActive(menuEl) {
  return menuEl.classList.contains("active");
}

function activate(menuEl) {
  console.assert(!isActive(menuEl), "Cannot activate active menu item. " + menuEl);
  menuEl.classList.add('active')
}

function deactivate(menuEl) {
  // console.assert(isActive(menuEl), "Cannot deactivate inactive menu item. " + menuEl);
  if (menuEl) {
    menuEl.classList.remove('active')
  } else {
    return false;
  }
}  

function isSubmenuCollapsed() {
  return subMenuEl.style.top == "0px";
}

function collapseSubmenu() {
  subMenuEl.style.top = "0";
}

function expandSubmenu() {
  subMenuEl.style.top = "100%";
}

function hasSubmenu(navNode) {
  // wait..  navNode.getAttribute('href') != navNode.href  ...are you kidding?
  if (!navNode) return false;
  return navNode.getAttribute('href') == '#';
}  

function moveChildLinks(childrenFrom, childrenTo) {
  // Returns true if any child elements were moved.
  let result = false;
  // don't use .children.length == 0 to check for children when I actually mean to check for children who are Elements
  console.assert(childrenTo.firstElementChild === null, "This primary navigation item already has its secondary links.");
  while (childrenFrom.firstElementChild != null) {
    childrenTo.appendChild(childrenFrom.firstElementChild);
    result = true;
  }
  return result;
}

function stowSubmenuLinks(navNode) {
  console.assert(hasSubmenu(navNode), "Stowing submenu nav links in a nav node without any subnav!");
  console.assert(isActive(navNode), "Stowing submenu nav links in a non-active nav parent node.");
  moveChildLinks(subMenuEl, navNode);
}

function presentSubmenuLinks(navNode) {
  // console.assert(hasSubmenu(navNode), "This nav node does not have any subnmenu nav to present!");
  // console.assert(isActive(navNode), "Presenting submenu nav links of a non-active nav parent node.");
  if (hasSubmenu(navNode) && isActive(navNode)) {
    moveChildLinks(navNode, subMenuEl);
    expandSubmenu();
  }
}

function shutdownNav() {
  // stow links as needed then collapse subMenu
  if (!isSubmenuCollapsed()) {
    stowSubmenuLinks(getActive());
    collapseSubmenu();
  };
  deactivate(getActive());
};

function startupNav(navNode) {
  if (navNode) {
    activate(navNode);
    if (hasSubmenu(navNode)) {
      presentSubmenuLinks(navNode);
    }
  }
}

function displayMessage(message) {
  let newText;
  if (!message) {
    newText = "DOM Manipulation";
  } else if (typeof message == 'string' ) {
    newText = message;
  } else if (typeof message == 'object' ) {
    try {
      newText = message.innerText || message.textContent || message.toString();
    } catch (e) {
      newText = "DOM Manipulation";
    };
  };
  document.querySelector('main > h1').textContent = newText;
};

function handlerTopMenuClick(e) {
  // handle clicks in the primary nav bar
  e.preventDefault();
  if (e.target.tagName != "A") return;  // ignore clicks in the nav bar's dead space
  console.log(e.target.innerText);

  let nextActiveNode = isActive(e.target) ? null : e.target;
  shutdownNav();
  startupNav(nextActiveNode);

  if (nextActiveNode && !hasSubmenu(nextActiveNode)) {
    displayMessage(nextActiveNode.innerText);
  };
};

function handlerSubMenuClick(e) {
  e.preventDefault();
  if (e.target.tagName != "A") return;  // ignore clicks in the nav bar's dead space
  console.log(e.target.innerText);
  document.querySelector('main > h1').textContent = e.target.innerText;
  shutdownNav();
}


topMenuEl.addEventListener("click", handlerTopMenuClick);
subMenuEl.addEventListener("click", handlerSubMenuClick);
