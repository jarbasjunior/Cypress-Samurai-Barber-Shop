import { el } from './elements';

class SignupPage {
  static fillForm(user) {
    cy.get(el.fieldName).type(user.name);
    cy.get(el.fieldEmail).type(user.email);
    cy.get(el.fieldPassword).type(user.password);
  }

  static submitForm() {
    cy.contains(el.registerButton).click();
  }
}

export default SignupPage;
