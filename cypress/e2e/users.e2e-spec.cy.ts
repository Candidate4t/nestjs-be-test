describe(`Users API E2E Test`, () => {
  it(`GET /users?firstName=John&limit=20&page=1&sort=-1&sortBy=createdAt)`, () => {
    cy.visit(
      `http://localhost:9000/swagger#/Users%20API/UsersController_getUsers`,
    );

    cy.get(
      '#operations-Users_API-UsersController_getUsers .try-out__btn',
    ).click();


    cy.get('.execute').click();
  });
});
