@accessibility @a11y @ui
Feature: Accessibility

  Scenario Outline: Homepage meets WCAG level <level>
    Given the user opens the homepage
    Then the page meets WCAG level <level>

    Examples:
      | level |
      | A     |
      | AA    |
      | AAA   |

  Scenario Outline: Login page meets WCAG level <level>
    Given the user is on the login page
    Then the page meets WCAG level <level>

    Examples:
      | level |
      | A     |
      | AA    |
      | AAA   |

  Scenario Outline: Product listing page meets WCAG level <level>
    Given the user is logged in
    And the user is on the product listing page
    Then the page meets WCAG level <level>

    Examples:
      | level |
      | A     |
      | AA    |
      | AAA   |

  Scenario Outline: Shopping cart page meets WCAG level <level>
    Given the user is logged in
    And the user is on the product listing page
    When the user adds "ADIDAS ORIGINAL" to the cart
    And the user navigates to the cart
    Then the page meets WCAG level <level>

    Examples:
      | level |
      | A     |
      | AA    |
      | AAA   |

  Scenario Outline: Checkout page meets WCAG level <level>
    Given the user is logged in
    And the user has items in the shopping cart
    When the user navigates to checkout
    Then the page meets WCAG level <level>

    Examples:
      | level |
      | A     |
      | AA    |
      | AAA   |
