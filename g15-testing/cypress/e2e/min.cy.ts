describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
  });
});

describe("Backend", () => {
  it("checks get response", () => {
    const url = "http://localhost:3000";
    cy.request({
      method: "GET",
      url: `${url}/todo`,
    }).then((res) => {
      expect(res.body).to.be.a("array");
    });
  });
});

describe("Frontend", () => {
  it("creates todo", () => {
    const url = "http://localhost:4444";
    const text = new Date().getTime().toString();
    cy.visit(url);
    cy.get("[data-cy='todo-header']").type(text);
    cy.get("[data-cy='input-text']").type(text);
    cy.get("[data-cy='submit']").click();
    cy.contains(text);
  });
});

// describe("Frontend", () => {
//   it("creates todo", () => {
//     const url = "http://localhost:4444";
//     const text = new Date().getTime().toString(); // Unique text for each test run
//     const title = `Title ${text}`;
//     const description = `Description ${text}`;
//     const priority = "high"; // Assuming you have a way to select priority by value

//     cy.visit(url);
    
//     // Enter title
//     cy.get("[data-cy='input-header']").type(title);
    
//     // Select priority (assuming priority picker is a dropdown or similar element)
//     // cy.get("[data-cy='select-priority']").select(priority);
    
//     // Enter text (if there's an additional text field apart from title and description)
//     cy.get("[data-cy='input-text']").type(text);
    
//     // Submit the form
//     cy.get("[data-cy='submit']").click();
    
//     // Verify that the new todo item is displayed
//     cy.contains(title);
//     cy.contains(text);
//   });
// });

