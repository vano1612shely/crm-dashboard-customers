import gsap from "gsap";

const menu_item = document.querySelectorAll(".menu__list li");
const emoji = document.querySelector(".page-title__emoji");
const upper = document.querySelector(".hamburger__upper");
const middle = document.querySelector(".hamburger__middle");
const lower = document.querySelector(".hamburger__lower");
const menu = document.querySelector(".menu");
const user = document.querySelector(".user");
const logo = document.querySelector(".logo");
const sidebarButton = document.querySelector(".sidebar__button");
let mobileTl = gsap.timeline({ paused: true, reversed: true });
let mm = gsap.matchMedia();
const toggleMenu = () => {
  if (mobileTl.reversed()) {
    menu.classList.add("menu_active");
    mobileTl.play();
  } else {
    menu.classList.remove("menu_active");
    mobileTl.reverse().then(() => {
      user.style = "";
    });
  }
};
sidebarButton.addEventListener("click", toggleMenu);

mm.add("(max-width: 550px)", () => {
  mobileTl
    .to(
      upper,
      { duration: 0.2, attr: { d: "M8,2 L2,8" }, x: 1, ease: "power2.inOut" },
      "start",
    )
    .to(middle, { duration: 0.2, autoAlpha: 0 }, "start")
    .to(
      lower,
      { duration: 0.2, attr: { d: "M8,8 L2,2" }, x: 1, ease: "power2.inOut" },
      "start",
    )
    .to(logo, {
      opacity: 0,
      duration: 0.2,
      display: "none",
    })
    .to(user, {
      display: "flex",
      opacity: 1,
      x: 20,
      duration: 0.2,
      marginRight: "auto",
    })
    .to(menu, {
      display: "block",
      duration: 0.5,
      opacity: 1,
      ease: "expo.inOut",
    })
    .from(
      menu_item,
      {
        duration: 1,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: "expo.inOut",
      },
      "-=0.5",
    );
});
mm.add("(min-width: 551px) and (max-width: 1120px)", () => {
  mobileTl
    .to(
      upper,
      { duration: 0.2, attr: { d: "M8,2 L2,8" }, x: 1, ease: "power2.inOut" },
      "start",
    )
    .to(middle, { duration: 0.2, autoAlpha: 0 }, "start")
    .to(
      lower,
      { duration: 0.2, attr: { d: "M8,8 L2,2" }, x: 1, ease: "power2.inOut" },
      "start",
    )
    .to(logo, {
      opacity: 0,
      duration: 0.2,
      display: "none",
    })
    .to(user, { marginRight: "auto", duration: 0.2 })
    .to(menu, {
      display: "block",
      duration: 0.5,
      opacity: 1,
      ease: "expo.inOut",
    })
    .from(
      menu_item,
      {
        duration: 1,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: "expo.inOut",
      },
      "-=0.5",
    );
});

mm.add("(min-width: 1120px)", (context) => {
  let desktopTl = gsap.from(menu_item, {
    opacity: 0,
    x: -20,
    duration: 0.5,
    stagger: 0.2,
  });
  return () => {
    desktopTl.kill();
  };
});

gsap.fromTo(
  emoji,
  { rotation: -15 },
  {
    rotation: 15,
    repeat: -1,
    yoyo: true,
    duration: 0.5,
  },
);
