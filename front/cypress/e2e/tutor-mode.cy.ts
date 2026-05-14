describe('Tutor Mode Visibility', () => {
  it('should show tutor icons if the user is a tutor', () => {
    // Mock user login as tutor
    cy.intercept('POST', '**/auth/login-temporal', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: { id: 1, nom: 'Tutor Test', rol: 'profe' },
          token: 'fake-jwt'
        }
      }
    });

    // Mock initial data
    cy.intercept('GET', '**/back/api/v1/horaris/professor/*', { body: [] });
    cy.intercept('GET', '**/back/api/v1/horaris/usuari/*', { body: [] });
    cy.intercept('GET', '**/back/api/v1/usuaris/*/classe-actual', { body: { data: null } });

    cy.visit('/');
    cy.get('#usuari').type('tutor@example.com');
    cy.get('.boto-entrar').click();

    // Verify we are on the dashboard
    cy.url().should('include', '/professors');

    // Verify tutor icons are visible in the sidebar
    // Academic Cap (Gestió Inscrits) and Calendar Days (Horari Alumnes)
    cy.get('a[href="/gestio-inscrits"]').should('be.visible');
    cy.get('a[href="/horari-alumnes"]').should('be.visible');
  });

  // Since the code currently has 'public esTutor = true' hardcoded, 
  // we might want to check if it's actually hardcoded or if we can test the 'false' case.
});
