describe('Delete Users', () => {
  it('Delete a user without id', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:9000/users/1',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('Delete a user', () => {
    cy.fixture('storeUserPayload').then((payload) => {
      let id: string;
      cy.request({url: 'http://localhost:9000/users', method: 'POST', body: payload}).then((res) => {
        expect(res.status).to.eq(201, "user can't be created successfully");
       
        id = res.body._id;
        cy.request({ method: 'DELETE', url: `http://localhost:9000/users/${id}`}).then((response) => {
            expect(response.status).to.eq(200);
        });
      });
    });
  });
});
