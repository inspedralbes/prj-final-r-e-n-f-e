describe('Tutor Mode Visibility', () => {
  it('should show tutor icons if the user is a tutor', () => {
    // Mock user login as tutor
    cy.intercept('POST', '**/api/login', {
      statusCode: 200,
      body: {
        user: { id: 1, nom: 'Tutor Test', rol: 'professor' },
        token: 'fake-jwt'
      }
    });

    // Mock initial data
    cy.intercept('GET', '**/api/sessions-professor', { body: [] });
    cy.intercept('GET', '**/api/horari*', { body: [] });
    cy.intercept('GET', '**/api/classe-actual', { body: null });

    cy.visit('/login');
    cy.get('#usuari').type('tutor@example.com');
    cy.get('.boto-entrar').click();

    // Verify tutor icons are visible in the sidebar
    // Academic Cap (Gestió Inscrits) and Calendar Days (Horari Alumnes)
    cy.get('ng-icon[name="heroAcademicCap"]').should('be.visible');
    cy.get('ng-icon[name="heroCalendarDays"]').should('be.visible');
  });

  // Since the code currently has 'public esTutor = true' hardcoded, 
  // we might want to check if it's actually hardcoded or if we can test the 'false' case.
});
