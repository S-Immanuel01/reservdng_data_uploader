declare namespace Cypress {
  interface Chainable {
    parseXlsx(inputFile: string): Chainable<unknown>;
    login(email: string): Chainable<void>;
    loginWithEmailAndPassword(email: string, password: string): Chainable<void>;
  }
}