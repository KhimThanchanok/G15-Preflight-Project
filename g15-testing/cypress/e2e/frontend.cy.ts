before(() => {
  const url = Cypress.env("BACKEND_URL");
  cy.request({
    method: "POST",
    url: `${url}/todo/all`,
  });
});

describe("Frontend", () => {
  it("connects", () => {
    const url = Cypress.env("FRONTEND_URL");
    cy.visit(url);
  });
  it("creates todo", () => {
    const url = Cypress.env("FRONTEND_URL");
    const text = new Date().getTime().toString();
    cy.visit(url);
    cy.get("[data-cy='todo-header']").type(text);
    cy.get("[data-cy='input-text']").type(text);
    cy.get("[data-cy='submit']").click();
    cy.contains(text);
  });
});
  // it("deletes todo", () => {
  //   const url = Cypress.env("FRONTEND_URL");

  //   const text = new Date().getTime().toString();
  //   cy.visit(url);
  //   cy.get("[data-cy='todo-header']").type(text);
  //   cy.get("[data-cy='input-text']").type(text);
  //   cy.get("[data-cy='submit']").click();
  //   cy.get("[data-cy='todo-item-wrapper']")
  //     .contains(text)
  //     .parent()
  //     .within(() => {
  //       cy.get("[data-cy='todo-item-wrapper']").click();
  //     });
  //   cy.contains(text).should("not.exist");
  // });

  it("deletes todo", () => {
    const url = Cypress.env("FRONTEND_URL");
    const text = new Date().getTime().toString();
  
    cy.visit(url);
    cy.get("[data-cy='todo-header']").type(text);
    cy.get("[data-cy='input-text']").type(text);
    cy.get("[data-cy='submit']").click();
  
    // Wait for the TODO item to be visible
    cy.get("[data-cy='todo-item-wrapper']").contains(text).should("be.visible");
  
    // Click the delete button for the specific TODO item
    cy.get("[data-cy='todo-item-wrapper']")
      .contains(text)
      .parent()
      .find("[data-cy='todo-item-delete']")
      .click();
  
    // Verify that the TODO item is deleted
    cy.contains(text).should("not.exist");
  });
  
//   it("updates todo", () => {
//     const url = Cypress.env("FRONTEND_URL");

//     const text = new Date().getTime().toString();
//     const textUpdated = "123456";
//     cy.visit(url);
//     cy.get("[data-cy='todo-header']").type(text);
//     cy.get("[data-cy='input-text']").type(text);
//     cy.get("[data-cy='submit']").click();
//     cy.get("[data-cy='todo-item-wrapper']")
//       .contains(text)
//       .parent()
//       .within(() => {
//         cy.get("[data-cy='todo-item-update']").click();
//       });
//     cy.get("[data-cy='input-text']").clear().type(textUpdated);
//     cy.get("[data-cy='submit']").click();
//     cy.contains(textUpdated);
//     cy.contains(text).should("not.exist");
//   });
// });

it("updates todo", () => {
  const url = Cypress.env("FRONTEND_URL");
  const text = new Date().getTime().toString();
  const textUpdated = "123456";

  cy.visit(url);
  cy.get("[data-cy='todo-header']").type(text);
  cy.get("[data-cy='input-text']").type(text);
  cy.get("[data-cy='submit']").click();

  // Wait for the TODO item to be visible
  cy.get("[data-cy='todo-item-wrapper']").contains(text).should("be.visible");

  // Click the update button for the specific TODO item
  cy.get("[data-cy='todo-item-wrapper']")
    .contains(text)
    .parent()
    .find("[data-cy='todo-item-update']")
    .click();

  // Update the TODO item
  cy.get("[data-cy='input-text']").clear().type(textUpdated);
  cy.get("[data-cy='submit']").click();

  // Verify that the TODO item is updated
  cy.contains(textUpdated).should("exist");
  cy.contains(text).should("not.exist");
});
