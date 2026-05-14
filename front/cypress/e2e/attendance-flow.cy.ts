describe('Attendance Flow', () => {
  beforeEach(() => {
    // We mock the API responses to make the test independent of the back-end state
    // and faster to run in CI.
    cy.intercept('POST', '**/auth/login-temporal', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: {
            id: 1,
            nom: 'Professor de Prova',
            email: 'test@example.com',
            rol: 'profe'
          },
          token: 'fake-jwt-token'
        }
      }
    }).as('loginRequest');

    // Specific intercepts first
    cy.intercept('GET', '**/back/api/v1/horaris/professor/*/context', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          sessions: [
            {
              id: 1,
              codi_hora: 'X1',
              assignatura: { nom: 'Matemàtiques' },
              aula: { nom: 'Aula 101' }
            }
          ],
          default_id: 1
        }
      }
    }).as('getSessions');

    cy.intercept('GET', '**/back/api/v1/horaris/*/assistencia-setmanal*', {
      statusCode: 200,
      body: [
        {
          id: 1, // id de la inscripció
          alumne: {
            id: 101,
            nom: 'Alumne',
            cognom: 'Test'
          },
          assistencies: [
            {
              data: '2026-05-13T00:00:00.000000Z',
              estat: 'Assistit',
              justificat: false
            }
          ]
        }
      ]
    }).as('getAttendance');

    cy.intercept('POST', '**/back/api/v1/assistencies', {
      statusCode: 200,
      body: { message: 'Assitència guardada' }
    }).as('saveAttendance');

    // More generic intercepts or others
    cy.intercept('GET', '**/back/api/v1/horaris/usuari/*', { body: [] });
    cy.intercept('GET', '**/back/api/v1/usuaris/*/classe-actual', { body: { data: null } });
  });

  it('should login and mark an absence', () => {
    cy.visit('/');

    // Login
    cy.get('#usuari').type('test@example.com');
    cy.get('.boto-entrar').click();
    
    cy.wait('@loginRequest');

    // Check we are in the dashboard
    cy.url().should('include', '/professors');

    // Click on "Llista Classe" in sidebar - using href for better reliability
    cy.get('a[href="/llista-classe"]').click();

    // Check we are in the attendance list
    cy.url().should('include', '/llista-classe');

    // Wait for data to load
    cy.wait(['@getSessions', '@getAttendance']);

    // Find the input for the first student and Wednesday (colIndex 2)
    // Based on the HTML we saw: [id]="'input-' + filaIndex + '-' + colIndex"
    cy.get('#input-0-2').should('be.visible');

    // Mark as "F" (Falta)
    cy.get('#input-0-2').clear().type('F').blur();

    // Verify the API call was made
    cy.wait('@saveAttendance').its('request.body').should('deep.include', {
      estat: 'Falta'
    });
  });
});
