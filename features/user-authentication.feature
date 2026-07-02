@ui @authentication
Feature: User authentication

  Scenario: User logs in successfully
    Given the user is on the login page
    When the user enters email "joost.de.jong74+shopping-cart-demo@gmail.com"
    And the user enters password
    And the user clicks the Login button
    Then the user should be redirected to the dashboard
    And the user should see the product listing page
