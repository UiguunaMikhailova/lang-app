import Auth from '../auth/auth';
import Modal from '../modal/modal';

class AuthPage {
  private modal: Modal | undefined;

  private auth: Auth | undefined;

  create(): void {
    this.modal = new Modal();
    this.auth = new Auth();
    this.modal.content.elem.innerHTML = this.auth.renderAuthPage();
    this.auth.addListeners();
  }

  closeModal(): void {
    this.modal?.destroy();
  }

  showErrorMsg(msg: string): void {
    this.auth?.showErrMessage(msg);
  }
}

export default AuthPage;
