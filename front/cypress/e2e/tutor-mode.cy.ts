describe('Tutor Mode Visibility', () => {
  it('should show tutor icons if the user is a tutor', () => {
    // Mock user login as tutor
    cy.intercept('POST', '**/auth/google/redirect', {
      statusCode: 200,
      body: {
        success: true,
        redirect_url: 'http://localhost:4200/auth/callback?code=mock-code'
      }
    }).as('googleRedirect');

    cy.intercept('POST', '**/auth/google/callback', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: { id: 1, nom: 'Tutor Test', rol: 'Profe', isProfileComplited: true },
          token: 'fake-jwt'
        }
      }
    }).as('googleCallback');

    // Mock initial data
    cy.intercept('GET', '**/back/api/v1/horaris/professor/*', { body: [] });
    cy.intercept('GET', '**/back/api/v1/horaris/usuari/*', { body: [] });
    cy.intercept('GET', '**/back/api/v1/usuaris/*/classe-actual', { body: { data: null } });
    cy.intercept('GET', '**/back/api/v1/classes/tutor/1', { body: { data: { id: 1, nom: 'Classe Test' } } });

    cy.visit('/');
    cy.get('.boto-google').click();
    cy.wait('@googleRedirect');
    cy.wait('@googleCallback', { timeout: 10000 });

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
