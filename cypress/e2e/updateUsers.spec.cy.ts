describe(`Store User EP`, () => {
  it(`PATCH /users without body`, () => {
    cy.request({ url: 'http://localhost:9000/users/some-bad-id', method: 'patch', failOnStatusCode: false })
        .then((err) => {
          expect(err.status).eq(400);
          
        });
  });
  
  it(`PATCH /users/\{id\} with payload`, () => {
      let id: string;
      cy.request({ url: 'http://localhost:9000/users?page=1&limit=1', method: 'get'})
          .then((res) => {
          id = res.body.data[0]._id;
          expect(res.status).eq(200., 'cant find any user to update');
      }); 
      cy.fixture('updateUserPayload').then((payload) => {
          cy.request({ url: `http://localhost:9000/users/${id}`, method: 'patch', body: payload })
              .then((res) => {
              expect(res.status).eq(200); 
          });
      });
  });
});

