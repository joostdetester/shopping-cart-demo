@ui @shopping
Feature: Shopping cart

  Scenario: User adds multiple products to shopping cart
    Given the user is logged in
    And the user is on the product listing page
    When the user adds "ADIDAS ORIGINAL" to the cart
    And the user adds "IPHONE 13 PRO" to the cart
    Then the cart counter should display "2"
    And the cart should contain both items

  Scenario: User removes an item from the shopping cart
    Given the user is logged in
    And the user has added "ADIDAS ORIGINAL" and "IPHONE 13 PRO" to cart
    When the user navigates to the cart
    And the user removes "IPHONE 13 PRO" from the cart
    Then the cart should only contain "ADIDAS ORIGINAL"
    And the cart total should be "$78000"
