describe(`Store User EP`, () => {
  it(`POST/users withoutbody`, () => {
    cy.request({ url: 'http://localhost:9000/users', method: 'post', failOnStatusCode: false })
        .then((err) => {
          expect(err.status).eq(400);
          
        });
  });
  
  it(`POST/users withoutbody`, () => {
      cy.fixture('storeUserPayload').then((payload) => {
        cy.request({ url: 'http://localhost:9000/users', method: 'post', body: payload })
            .then((res) => {
              expect(res.status).eq(201); 
            });
        });
  });
});
