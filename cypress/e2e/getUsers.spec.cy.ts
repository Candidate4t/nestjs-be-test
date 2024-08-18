describe(`Users API Integration Tests`, () => {
  it(`GET /users`, () => {
    cy.request({ url: 'http://localhost:9000/users', method: 'get' }).then(
      (res) => {
        expect(res.status).eq(200);
        expect(res.body.data.length).to.be.greaterThan(0);
      },
    );
  });

  it(`GET /users?firstName=John&limit=20&page=1&sort=-1&sortBy=createdAt`, () => {
    cy.request({
      url: 'http://localhost:9000/users?firstName=John&limit=20&page=1&sort=-1&sortBy=createdAt',
      method: 'get',
    }).then((res) => {
      expect(res.status).eq(200);
      expect(res.body.page).to.eq('1');
      expect(res.body.limit).to.eq('20');
      expect(res.body.sort).to.eq('-1');
      expect(res.body.sortBy).to.eq('createdAt');
      expect(res.body.data.length).to.be.greaterThan(0);
      expect(res.body.data.every((user) => user.firstName.match(/john/i)));
    });
  });

  it(`GET /users?limit=20&page=1&sort=-1&sortBy=firstName`, () => {
    cy.request({
      url: 'http://localhost:9000/users?limit=20&page=2&sort=-1&sortBy=firstname',
      method: 'get',
    }).then((res) => {
      expect(res.status).eq(200);
      expect(res.body.page).to.eq('2');
      expect(res.body.limit).to.eq('20');
      expect(res.body.sort).to.eq('-1');
      expect(res.body.sortBy).to.eq('firstname');
      expect(res.body.data.length).to.be.eq(20);
    });
  });
  
  it(`GET /users?&&sort=-1&sortBy=firstName`, () => {
    cy.request({
      url: 'http://localhost:9000/users?sort=-1&sortBy=firstname',
      method: 'get',
    }).then((res) => {
      expect(res.status).eq(200);
      expect(res.body.page).to.eq('1');
      expect(res.body.limit).to.eq('1');
      expect(res.body.sort).to.eq('-1');
      expect(res.body.sortBy).to.eq('firstname');
      expect(res.body.data.length).to.be.eq(20);
    });
  });
});
