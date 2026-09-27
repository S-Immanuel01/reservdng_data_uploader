// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("parseXlsx", (inputFile) => {
    return cy.task('parseXlsx', { filePath: inputFile })
});

Cypress.Commands.add("login", (email) => {
    cy.session('login', () => {
        cy.visit('/')
        cy.contains('Sign In')
            .click()
        cy.get('#email-input')
            .type(email)
        cy.get('#request-otp-btn')
            .click()
        cy.get('#verify-btn', { timeout: 180000 })
            .should('be.enabled')
            .click()
    })
})

Cypress.Commands.add("loginWithEmailAndPassword", (email, password) => {
    cy.session('login', () => {
        cy.visit('/')
        cy.contains('Sign In')
            .click()
        cy.get('#email-input')
            .type(email)
        cy.get('#password-input')
            .type(password)
        cy.get('#request-otp-btn', { timeout: 180000 })
            .should('be.enabled')
            .click()
    })
})