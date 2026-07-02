@ui @e2e
Feature: Checkout

  Scenario: User completes order checkout
    Given the user is logged in
    And the user has items in the shopping cart
    When the user navigates to checkout
    And the user selects "Credit Card" as payment method
    And the user enters credit card number "4542 3931 9232 2293"
    And the user enters expiry date "01/16"
    And the user enters CVV code "222"
    And the user enters shipping email "joost.de.jong74+shopping-cart-demo@gmail.com"
    And the user selects "Netherlands" as shipping country
    And the user clicks the "PLACE ORDER" button
    Then the order should be placed successfully
    And the user should see the order confirmation page
    And the confirmation should display "THANK YOU FOR THE ORDER"
