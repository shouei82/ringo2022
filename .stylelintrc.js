module.exports = {
  "extends": [
    "stylelint-config-standard-scss",
    //"stylelint-config-recess-order"
    //"stylelint-config-property-sort-order-smacss"
    "stylelint-config-hudochenkov/order"
    //"stylelint-config-rational-order"
  ],
  "rules": {
    "number-leading-zero": "never",
    "block-no-empty" : null,
    "selector-class-pattern" : null,
    "scss/at-function-pattern" : null,
    "scss/double-slash-comment-whitespace-inside" : null,
    "number-max-precision": 5,
    "order/order": [
      [
      'declarations',
        {
          type: 'at-rule',
          name: 'include',
        }
      ]
    ]
  }
};