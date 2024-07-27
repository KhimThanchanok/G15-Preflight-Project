describe("Todo App", () => {
  const backendUrl = Cypress.env("BACKEND_URL");
  const frontendUrl = Cypress.env("FRONTEND_URL");

  before(() => {
    cy.request({
      method: "POST",
      url: `${backendUrl}/todo/all`,
    });
  });

  beforeEach(() => {
    cy.visit(frontendUrl);
  });

  it("connects", () => {
    cy.visit(frontendUrl);
  });
  
  it("creates a todo", () => {
    const text = new Date().getTime().toString();
    cy.get("[data-cy='todo-header']").type(text);
    cy.get("[data-cy='input-text']").type(text);
    cy.get("[data-cy='submit']").click();
    cy.contains(text);
  });

  it("deletes a todo", () => {
    const text = new Date().getTime().toString();

    cy.get("[data-cy='todo-header']").type(text);
    cy.get("[data-cy='input-text']").type(text);
    cy.get("[data-cy='submit']").click();

    cy.get("[data-cy='todo-item-wrapper']")
      .contains(text)
      .parentsUntil("[data-cy='todo-item-wrapper']")
      .find("[data-cy='todo-item-delete']")
      .click();

    cy.contains(text).should("not.exist");
  });

  it("updates a todo", () => {
    const text = new Date().getTime().toString();
    const textUpdated = "123456";

    cy.get("[data-cy='todo-header']").type(text);
    cy.get("[data-cy='input-text']").type(text);
    cy.get("[data-cy='submit']").click();

    cy.get("[data-cy='todo-item-wrapper']")
      .contains(text)
      .parentsUntil("[data-cy='todo-item-wrapper']")
      .find("[data-cy='todo-item-update']")
      .click();

    cy.get("[data-cy='input-text']").clear().type(textUpdated);
    cy.get("[data-cy='submit']").click();

    cy.contains(textUpdated).should("exist");
  });

  it('filters TODO items by Low priority', () => {
    const text = new Date().getTime().toString();

    cy.get("[data-cy='todo-header']").type(text);
    cy.get("[data-cy='input-text']").type(text);
    cy.get('[data-cy=input-priority-low]').click();
    cy.get("[data-cy='submit']").click();
    
    cy.get('[data-cy=todo-priority]').select('low');
    cy.get('[data-cy=todo-item-wrapper]').children().should('have.length', 1);
    // cy.get('[data-cy=todo-item-wrapper]').contains('text');
  });

  it('filters TODO items by Medium priority', () => {
    cy.get('[data-cy=todo-priority]').select('medium');
    cy.get('[data-cy=todo-item-wrapper]').children().should('have.length', 2);
    // cy.get('[data-cy=todo-item-wrapper]').contains('Test TODO 2');
  });

  it('filters TODO items by High priority', () => {
    const text = new Date().getTime().toString();

    cy.get("[data-cy='todo-header']").type(text);
    cy.get("[data-cy='input-text']").type(text);
    cy.get('[data-cy=input-priority-high]').click();
    cy.get("[data-cy='submit']").click();

    cy.get('[data-cy=todo-priority]').select('high');
    cy.get('[data-cy=todo-item-wrapper]').children().should('have.length', 1);
    // cy.get('[data-cy=todo-item-wrapper]').contains('Test TODO 3');
  });

  it('shows all TODO items when All is selected', () => {
    cy.get('[data-cy=todo-priority]').select('all');
    cy.get('[data-cy=todo-item-wrapper]').children().should('have.length', 4);
  });
});
