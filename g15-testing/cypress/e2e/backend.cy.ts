import "dotenv/config";

before(() => {
  const url = Cypress.env("BACKEND_URL");
  cy.request({
    method: "POST",
    url: `${url}/todo/all`,
  });
});

describe("Backend", () => {
  it("checks env", () => {
    cy.log(JSON.stringify(Cypress.env()));
  });

  it("checks CORS disabled", () => {
    const url = Cypress.env("BACKEND_URL");
    cy.request({
      method: "GET",
      url: `${url}/todo`,
    }).then((res) => {
      expect(res.headers).to.not.have.property("access-control-allow-origin");
    });
  });

  it("checks get response", () => {
    const url = Cypress.env("BACKEND_URL");
    cy.request({
      method: "GET",
      url: `${url}/todo`,
    }).then((res) => {
      expect(res.body).to.be.a("array");
    });
  });

  it("creates todo", () => {
    const url = Cypress.env("BACKEND_URL");
    cy.request({
      method: "PUT",
      url: `${url}/todo`,
      body: {
        todoHeader: "Header",
        todoText: "New Todo",
        priority: "low",
      },
    }).then((res) => {
      expect(res.body).to.have.all.keys("msg", "data");
      expect(res.body.data).to.have.all.keys("id", "todoText");
    });
  });

  it("deletes todo", () => {
    const url = Cypress.env("BACKEND_URL");

    cy.request({
      method: "PUT",
      url: `${url}/todo`,
      body: {
        todoHeader: "Header",
        todoText: "New Todo",
        priority: "low",
      },
    }).then((res) => {
      const todo = res.body.data;
      cy.request({
        method: "DELETE",
        url: `${url}/todo`,
        body: {
          id: todo.id,
        },
      }).then((res) => {
        expect(res.body).to.have.all.keys("msg", "data");
        expect(res.body.data).to.have.key("id");
      });
    });
  });

  it("updates todo", () => {
    const url = Cypress.env("BACKEND_URL");

    cy.request({
      method: "PUT",
      url: `${url}/todo`,
      body: {
        todoHeader: "Header",
        todoText: "New Todo",
        priority: "low",
      },
    }).then((res) => {
      const todo = res.body.data;
      cy.wrap(todo.id).as("currentId"); // Storing id for using later in the chain
      cy.request({
        method: "PATCH",
        url: `${url}/todo`,
        body: {
          id: todo.id,
          todoText: "Updated Text",
          priority: "medium",
        },
      }).then((res) => {
        cy.request({
          method: "GET",
          url: `${url}/todo`,
        }).then(function (res) {
          const currentId = this.currentId; // Get value from context
          const todos = res.body;
          const todo = todos.find((el) => el.id === currentId);
          expect(todo.todoText).to.equal("Updated Text");
          expect(todo.priority).to.equal("medium");
        });
      });
    });
  });
});
