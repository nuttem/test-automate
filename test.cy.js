describe('Sender, Receiver account status must active Posible account status = Active, Inactive , Block', () => {
  const transferData = {
    amount: 500.00,
    sendingAccount: 'active_sender',
    receivingAccount: 'active_receiver',
    receivingBankCode: '123'
  };

  it('Success', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: transferData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message', 'Transfer successful.');
    });
  });
});

describe('Transfer amount should not over 20,000,000.00 per day.', () => {
  const money = 1000000.00; 
  const transferData = {
    sendingAccount: 'active_sender',
    receivingAccount: 'active_receiver',
    receivingBankCode: '123'
  };

  it('TC - 020', () => {
    for (let i = 1; i <= 20; i++) {
      transferData.money = money.toFixed(2);

      cy.request({
        method: 'POST',
        url: baseUrl,
        body: transferData,
        failOnStatusCode: false  
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('message', 'Transfer successful.');
      });
    }
  });

  it('TC - 021', () => {
    for (let i = 1; i <= 21; i++) {
      transferData.money = money.toFixed(2);

      cy.request({
        method: 'POST',
        url: transferEndpoint,
        body: transferData,
        failOnStatusCode: false  
      }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body).to.have.property('Error', true);
        expect(response.body).to.have.property('message', 'Transfer amount exceeds the daily limit of 20,000,000.00 THB.');
      });
    }
  });
});

describe('Money Transfer API Test - Attempt to Transfer Below Minimum Amount', () => {
  const transferDataSuccess = {
    amountFail: 0.001,  
    sendingAccount: 'active_sender',
    receivingAccount: 'active_receiver',
    receivingBankCode: '123'
  };
  const transferDataFail = {
    amountFail: 0.001,  
    sendingAccount: 'active_sender',
    receivingAccount: 'active_receiver',
    receivingBankCode: '123'
  };

  it('Fail', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: transferDataFail,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('message', 'Transfer amount must not be less than 0.01.');
    });
  });

  it('Success', () => {
    cy.request({
      method: 'POST',
      url: transferEndpoint,
      body: transferDataSuccess,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message', 'Transfer successful.');
    });
  });
});

describe('Transfer amount should not over 1,000,000.00 per transaction.', () => {
  const transferDataSuccess = {
    amountFail: 1000001.00,  
    sendingAccount: 'active_sender',
    receivingAccount: 'active_receiver',
    receivingBankCode: '123'
  };
  const transferDataFail = {
    amountFail: 1000000.00,  
    sendingAccount: 'active_sender',
    receivingAccount: 'active_receiver',
    receivingBankCode: '123'
  };

  it('Fail', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: transferDataFail,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('message', 'Transaction is over limit of account capability.');
    });
  });

  it('Success', () => {
    cy.request({
      method: 'POST',
      url: transferEndpoint,
      body: transferDataSuccess,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message', 'Transfer successful.');
    });
  });
});