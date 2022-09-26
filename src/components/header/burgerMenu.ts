class BurgerMenu {
  addListeners(): void {
    const iconBurger: HTMLElement | null = document.querySelector('.burger-menu');
    const menuLinks: NodeListOf<HTMLElement> = document.querySelectorAll('.nav__link');
    if (iconBurger) {
      iconBurger.addEventListener('click', this.open);
    }
    menuLinks.forEach((el) => el.addEventListener('click', this.close));
  }

  open(): void {
    const iconBurger: HTMLElement | null = document.querySelector('.burger-menu');
    const menuBurger: HTMLElement | null = document.querySelector('.nav');
    document.body.classList.toggle('lock');
    if (iconBurger && menuBurger) {
      iconBurger.classList.toggle('open');
      menuBurger.classList.toggle('open');
    }
  }

  close(): void {
    const iconBurger: HTMLElement | null = document.querySelector('.burger-menu');
    const menuBurger: HTMLElement | null = document.querySelector('.nav');
    document.body.classList.remove('lock');
    if (iconBurger && menuBurger) {
      iconBurger.classList.remove('open');
      menuBurger.classList.remove('open');
    }
  }
}

export default BurgerMenu;
