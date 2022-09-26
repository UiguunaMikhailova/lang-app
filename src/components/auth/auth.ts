import './auth.css';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';
import { TUser } from '../../shared/types';

class Auth {
  private isRegistrationPage = false;

  renderAuthPage(): string {
    const html = `
  <div class="sign-in">
        <h3 class="form__title" id="form__title">Войти</h3>
        <form class="sign-in__form form" id="form">
            <label for="email" class="form__label">Введите E-mail</label>
            <input type="email" class="form__input" name="email" placeholder="E-mail..." id="form__email" autocomplete="off">
            <label for="password" class="form__label">Введите пароль</label>
            <input type="password" class="form__input" name="password" placeholder="Пароль..." id="form__password" autocomplete="off">
            <div class="form__error-message" id="form__error">Пароль должен содержать не менее 8 символов, как минимум одну заглавную букву, одну прописную букву, одну цифру и один специальный символ "+-_@$!%*?&amp;#.,;:[]{}]</div>
            <input type="submit" class="button" value="Sign in" id="form__submit">
        </form>
        <button class="button button-small" id="form__change-btn">У вас нет аккаунта? Зарегистрируйтесь</button>
    </div>`;
    return html;
  }

  addListeners(): void {
    const form = document.getElementById('form');
    form?.addEventListener('submit', (e) => this.submitForm(e));
    const changeFormBtn = <HTMLButtonElement>document.getElementById('form__change-btn');
    changeFormBtn?.addEventListener('click', () => this.changeFormAuth());
  }

  submitForm(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formInputs = target.elements;
    const email = (formInputs[0] as HTMLInputElement).value;
    const password = (formInputs[1] as HTMLInputElement).value;

    const input = document.querySelectorAll('.form__input');
    const errMsg = document.getElementById('form__error') as HTMLElement;
    input.forEach((elem) => {
      elem.addEventListener('focusin', () => {
        errMsg.style.display = 'none';
      });
    });

    if (!isStrongPassword(password)) {
      this.showErrMessage('Пароль должен содержать не менее 8 символов, как минимум одну заглавную букву, одну прописную букву, одну цифру и один специальный символ "+-_@$!%*?&amp;#.,;:[]{}]');
    }
    if (!isEmail(email)) {
      this.showErrMessage('Некорректный E-mail');
    }
    if (isEmail(email) && isStrongPassword(password)) {
      if (this.isRegistrationPage) {
        // create user
        this.dispatchLoginEvent({ email, password, create: true });
      } else {
        // login
        this.dispatchLoginEvent({ email, password, create: false });
      }
    }
  }

  // create - true: add user, false: signin
  dispatchLoginEvent(authData: TUser): void {
    const { email, password, create } = authData;
    const event = new CustomEvent('userLogin', { detail: { email, password, create } });
    document.dispatchEvent(event);
  }

  changeFormAuth(): void {
    const errMsg = document.getElementById('form__error') as HTMLElement;
    errMsg.style.display = 'none';
    this.isRegistrationPage = !this.isRegistrationPage;

    const title = document.getElementById('form__title') as HTMLElement;
    const button = document.getElementById('form__submit') as HTMLInputElement;
    const changeFormBtn = document.getElementById('form__change-btn') as HTMLButtonElement;
    if (this.isRegistrationPage) {
      title.innerText = 'Регистрация';
      button.value = 'Зарегистрироваться';
      changeFormBtn.innerText = 'У вас есть аккаунт? Войдите';
    } else {
      title.innerText = 'Авторизация';
      button.value = 'Войти';
      changeFormBtn.innerText = 'У вас нет аккаунта? Зарегистрируйтесь';
    }
  }

  showErrMessage(text: string): void {
    const elem = document.getElementById('form__error') as HTMLElement;
    elem.innerText = text;
    elem.style.display = 'block';
  }
}

export default Auth;
