describe('Upload CSV file using cypress.request', () => {
  it('should upload a user.csv file', () => {
    cy.fixture('users.csv', 'binary').then((fileContent) => {
      const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'text/csv');

      const formData = new FormData();
      formData.append('file', blob, 'user.csv');

      cy.request({
        method: 'POST',
        url: 'http://localhost:9000/users/upload',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
        expect(response.status).eq(201);
      });
    });
  });
});

