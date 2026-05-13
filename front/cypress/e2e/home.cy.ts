describe('Home Page', () => {
  it('should load the home page successfully', () => {
    cy.visit('/');
    // Check for some content that should be on the home page
    // Assuming there is a title or a specific element
    cy.get('app-root').should('exist');
  });

  it('should load in production environment if prodUrl is set', () => {
    const prodUrl = Cypress.env('prodUrl');
    if (prodUrl) {
      cy.visit(prodUrl);
      cy.get('body').should('exist');
    }
  });
});
