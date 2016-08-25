'use strict';

var CommonExpedition = require('../../../expeditions/tests/e2e/common-expeditions.e2e.tests'),
  uploadImage = CommonExpedition.uploadImage,
  assertImage = CommonExpedition.assertImage,
  defaultMapCoordinates = CommonExpedition.defaultMapCoordinates,
  assertMapCoordinates = CommonExpedition.assertMapCoordinates,
  EC = protractor.ExpectedConditions;

var settlementTiles1 = {
  settlementTile1: {
    description: 'Test description 1a',
    organisms: [2,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
    organismsText: ['Boring sponges','Boring sponges','Bushy brown bryozoan','Chain tunicate',
      'Conopeum bryozoans','Eastern mudsnail','Frilled anemone','Golden star tunicate, star ascidian',
      'Hard tube worms','Hydroids','Ivory barnacle','Lacy bryozoan','Mud tube worm',
      'Northern red anemone','Northern rock barnacle','Orange bryozoan','Orange sheath tunicate',
      'Oyster drill','Red beard sponge','Ribbed mussel','Sea grapes','Sea squirt','Sea vase',
      'Slipper snails','Tube-building polychaete']
  },
  settlementTile2: {
    description: 'Test description 1b',
    organisms: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
    organismsText: ['Boring sponges','Bushy brown bryozoan','Chain tunicate','Conopeum bryozoans',
      'Eastern mudsnail','Frilled anemone','Golden star tunicate, star ascidian','Hard tube worms',
      'Hydroids','Ivory barnacle','Lacy bryozoan','Mud tube worm','Northern red anemone',
      'Northern rock barnacle','Orange bryozoan','Orange sheath tunicate','Oyster drill',
      'Red beard sponge','Ribbed mussel','Sea grapes','Sea squirt','Sea vase','Slipper snails',
      'Tube-building polychaete','Other (mark in notes)'],
    notes: 'Notes 1'
  },
  settlementTile3: {
    description: 'Test description 1c',
    organisms: [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,2],
    organismsText: ['Bushy brown bryozoan','Chain tunicate','Conopeum bryozoans','Eastern mudsnail',
      'Frilled anemone','Golden star tunicate, star ascidian','Hard tube worms','Hydroids',
      'Ivory barnacle','Lacy bryozoan','Mud tube worm','Northern red anemone','Northern rock barnacle',
      'Orange bryozoan','Orange sheath tunicate','Oyster drill','Red beard sponge','Ribbed mussel',
      'Sea grapes','Sea squirt','Sea vase','Slipper snails','Tube-building polychaete',
      'Other (mark in notes)','Boring sponges'],
    notes: 'Notes 2'
  },
  settlementTile4: {
    description: 'Test description 1d',
    organisms: [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,2,2],
    organismsText: ['Chain tunicate','Conopeum bryozoans','Eastern mudsnail','Frilled anemone',
      'Golden star tunicate, star ascidian','Hard tube worms','Hydroids','Ivory barnacle',
      'Lacy bryozoan','Mud tube worm','Northern red anemone','Northern rock barnacle',
      'Orange bryozoan','Orange sheath tunicate','Oyster drill','Red beard sponge','Ribbed mussel',
      'Sea grapes','Sea squirt','Sea vase','Slipper snails','Tube-building polychaete',
      'Other (mark in notes)','Boring sponges','Boring sponges'],
    notes: 'Notes 3'
  }
};

var settlementTiles2 = {
  settlementTile1: {
    description: 'Test description 2a',
    organisms: [2,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
    organismsText: ['Boring sponges','Boring sponges','Bushy brown bryozoan','Chain tunicate',
      'Conopeum bryozoans','Eastern mudsnail','Frilled anemone','Golden star tunicate, star ascidian',
      'Hard tube worms','Hydroids','Ivory barnacle','Lacy bryozoan','Mud tube worm',
      'Northern red anemone','Northern rock barnacle','Orange bryozoan','Orange sheath tunicate',
      'Oyster drill','Red beard sponge','Ribbed mussel','Sea grapes','Sea squirt','Sea vase',
      'Slipper snails','Tube-building polychaete']
  },
  settlementTile2: {
    description: 'Test description 2b',
    organisms: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
    organismsText: ['Boring sponges','Bushy brown bryozoan','Chain tunicate','Conopeum bryozoans',
      'Eastern mudsnail','Frilled anemone','Golden star tunicate, star ascidian','Hard tube worms',
      'Hydroids','Ivory barnacle','Lacy bryozoan','Mud tube worm','Northern red anemone',
      'Northern rock barnacle','Orange bryozoan','Orange sheath tunicate','Oyster drill',
      'Red beard sponge','Ribbed mussel','Sea grapes','Sea squirt','Sea vase','Slipper snails',
      'Tube-building polychaete','Other (mark in notes)'],
    notes: 'Notes 1'
  },
  settlementTile3: {
    description: 'Test description 2c',
    organisms: [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,2],
    organismsText: ['Bushy brown bryozoan','Chain tunicate','Conopeum bryozoans','Eastern mudsnail',
      'Frilled anemone','Golden star tunicate, star ascidian','Hard tube worms','Hydroids',
      'Ivory barnacle','Lacy bryozoan','Mud tube worm','Northern red anemone','Northern rock barnacle',
      'Orange bryozoan','Orange sheath tunicate','Oyster drill','Red beard sponge','Ribbed mussel',
      'Sea grapes','Sea squirt','Sea vase','Slipper snails','Tube-building polychaete',
      'Other (mark in notes)','Boring sponges'],
    notes: 'Notes 2'
  },
  settlementTile4: {
    description: 'Test description 2d',
    organisms: [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,2,2],
    organismsText: ['Chain tunicate','Conopeum bryozoans','Eastern mudsnail','Frilled anemone',
      'Golden star tunicate, star ascidian','Hard tube worms','Hydroids','Ivory barnacle',
      'Lacy bryozoan','Mud tube worm','Northern red anemone','Northern rock barnacle',
      'Orange bryozoan','Orange sheath tunicate','Oyster drill','Red beard sponge','Ribbed mussel',
      'Sea grapes','Sea squirt','Sea vase','Slipper snails','Tube-building polychaete',
      'Other (mark in notes)','Boring sponges','Boring sponges'],
    notes: 'Notes 3'
  }
};

var settlementTiles3 = {
  settlementTile1: {
    description: 'Test description 3a',
    organisms: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    organismsText: ['Blue mussel','Blue mussel','Blue mussel','Blue mussel',
      'Blue mussel','Blue mussel','Blue mussel','Blue mussel','Blue mussel',
      'Blue mussel','Blue mussel','Blue mussel','Blue mussel','Blue mussel',
      'Blue mussel','Blue mussel','Blue mussel','Blue mussel','Blue mussel',
      'Blue mussel','Blue mussel','Blue mussel','Blue mussel','Blue mussel',
      'Blue mussel']
  }
};

var assertSettlementTile = function(tile, index, details) {
  expect(tile.element(by.model('tile.description')).getAttribute('value')).toEqual(details.description);
  assertImage('settlement-tile-image-dropzone-'+index);

  var openButton = element(by.id('edit-settlementtile-'+index));
  openButton.click();

  // Wait until the modal is open
  var modal = element(by.id('modal-settlementtile'+(index+1)));
  browser.wait(EC.visibilityOf(modal), 10000);

  for (var i = 0; i < details.organisms.length; i++) {
    expect(modal.element(by.id('organism'+i)).$('option:checked').getText()).toEqual(details.organismsText[i]);
    if (details.organisms[i] === 26) {
      expect(modal.element(by.id('notes'+i)).getAttribute('value')).toEqual(details.notes);
    }
  }

  // Close the substrate shell
  modal.element(by.buttonText('Cancel')).click();
  browser.wait(EC.invisibilityOf(modal), 5000);
};

var assertSettlementTiles = function() {
  var tiles = element.all(by.repeater('tile in settlementTiles.settlementTiles'));
  browser.executeScript('window.scrollTo(0,0);').then(function () {
    var tile1 = tiles.get(0);
    assertSettlementTile(tile1, 0, settlementTiles1.settlementTile1);
    var tile2 = tiles.get(1);
    assertSettlementTile(tile2, 1, settlementTiles1.settlementTile2);
    var tile3 = tiles.get(2);
    assertSettlementTile(tile3, 2, settlementTiles1.settlementTile3);
    var tile4 = tiles.get(3);
    assertSettlementTile(tile4, 3, settlementTiles1.settlementTile4);
  });
};

var fillOutSettlementTile = function(tile, index, details) {
  tile.element(by.model('tile.description')).sendKeys(details.description);
  uploadImage('settlement-tile-image-dropzone-'+index);

  element(by.id('edit-settlementtile-'+index)).click();
  // Wait until the modal is open
  var modal = element(by.id('modal-settlementtile'+(index+1)));
  browser.wait(EC.visibilityOf(modal), 10000);

  for (var i = 0; i < details.organisms.length; i++) {
    modal.element(by.id('organism'+i)).all(by.tagName('option')).get(details.organisms[i]).click();
    if (details.organisms[i] === 26) {
      modal.element(by.id('notes'+i)).sendKeys(details.notes);
    }
  }

  // Save the substrate shell
  modal.element(by.buttonText('Save')).click();
  browser.wait(EC.invisibilityOf(modal), 5000);
};

var fillOutSettlementTiles = function() {
  var tiles = element.all(by.repeater('tile in settlementTiles.settlementTiles'));
  var tile1 = tiles.get(0);
  fillOutSettlementTile(tile1, 0, settlementTiles1.settlementTile1);
  var tile2 = tiles.get(1);
  fillOutSettlementTile(tile2, 1, settlementTiles1.settlementTile2);
  var tile3 = tiles.get(2);
  fillOutSettlementTile(tile3, 2, settlementTiles1.settlementTile3);
  var tile4 = tiles.get(3);
  fillOutSettlementTile(tile4, 3, settlementTiles1.settlementTile4);
};

var assertSettlementTilesView = function() {
};

module.exports = {
  settlementTiles1: settlementTiles1,
  settlementTiles2: settlementTiles2,
  settlementTiles3: settlementTiles3,
  assertSettlementTile: assertSettlementTile,
  assertSettlementTiles: assertSettlementTiles,
  fillOutSettlementTile: fillOutSettlementTile,
  fillOutSettlementTiles: fillOutSettlementTiles,
  assertSettlementTilesView: assertSettlementTilesView
};
