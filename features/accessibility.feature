@accessibility @a11y @ui
Feature: Homepage accessibility

  Scenario: Homepage has no critical or serious accessibility violations
    Given the user opens the homepage
    Then the page has no critical or serious accessibility violations
