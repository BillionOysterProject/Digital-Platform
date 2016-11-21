'use strict';

var path = require('path'),
  EC = protractor.ExpectedConditions;

module.exports = {
  select2Fillin: function(id, value) {
    var wrapper = element(by.id(id));
    var selector = wrapper.element(by.css('.select2-container'));
    var options = selector.element(by.css('.select2-choices')).all(by.tagName('input'));

    options.first().click();
    options.first().sendKeys(value);
    options.first().sendKeys(protractor.Key.ENTER);
  },
  wysiwygFillin: function(model, value) {
    var wysiwyg = element(by.model(model));
    var content = wysiwyg.element(by.css('div[contenteditable="true"]'));

    content.click();
    content.clear().sendKeys(value);
  }
};
