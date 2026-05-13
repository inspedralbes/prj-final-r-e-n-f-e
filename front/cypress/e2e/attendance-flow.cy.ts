describe('Attendance Flow', () => {
  beforeEach(() => {
    // We mock the API responses to make the test independent of the back-end state
    // and faster to run in CI.
    cy.intercept('POST', '**/api/login', {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          nom: 'Professor de Prova',
          email: 'test@example.com',
          rol: 'professor'
        },
        token: 'fake-jwt-token'
      }
    }).as('loginRequest');

    cy.intercept('GET', '**/api/sessions-professor', {
      statusCode: 200,
      body: [
        {
          id: 1,
          codi_hora: '1a Hora',
          assignatura: { nom: 'Matemàtiques' },
          aula: { nom: 'Aula 101' }
        }
      ]
    }).as('getSessions');

    cy.intercept('GET', '**/api/assistencies*', {
      statusCode: 200,
      body: [
        {
          id: 101,
          nom: 'Alumne Test',
          assistencia: {
            '2026-05-13': '.'
          }
        }
      ]
    }).as('getAttendance');

    cy.intercept('POST', '**/api/assistencies', {
      statusCode: 200,
      body: { message: 'Assitència guardada' }
    }).as('saveAttendance');
  });

  it('should login and mark an absence', () => {
    cy.visit('/login');

    // Login
    cy.get('#usuari').type('test@example.com');
    cy.get('.boto-entrar').click();
    
    cy.wait('@loginRequest');

    // Check we are in the dashboard or attendance list
    cy.url().should('include', '/professors/llista-classe');

    // Wait for data to load
    cy.wait(['@getSessions', '@getAttendance']);

    // Find the input for the first student and first day
    // Based on the HTML we saw: [id]="'input-' + filaIndex + '-' + colIndex"
    cy.get('#input-0-0').should('be.visible');

    // Mark as "F" (Falta)
    cy.get('#input-0-0').clear().type('F').blur();

    // Verify the API call was made
    cy.wait('@saveAttendance').its('request.body').should('deep.include', {
      estat: 'F'
    });
  });
});
