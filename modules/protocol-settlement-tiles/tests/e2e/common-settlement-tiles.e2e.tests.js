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

var assertSettlementTileView = function(index, tile) {
  element(by.id('settlementTileImage'+index)).getAttribute('src')
    .then(function(text){
      if (text !== null) {
        expect(text).not.toEqual('');
        expect(text.search('s3-us-west-1.amazonaws.com')).toBeGreaterThan(-1);
      }
    });
  if (tile.description) {
    expect(element(by.id('settlementTileDescription'+index)).getText())
      .toEqual('Description: ' + tile.description);
  }

  var checkTileImage = function(tileGrid) {
    tileGrid.element(by.css('img[class="img-rounded img-responsive"]')).getAttribute('src')
    .then(function(text){
      if (text !== null) {
        expect(text).not.toEqual('');
        expect(text.search('s3-us-west-1.amazonaws.com')).toBeGreaterThan(-1);
      }
    });
  };
  for (var i = 1; i <= tile.organisms.length; i++) {
    var expectedString = '' + i + ' ' + tile.organismsText[i-1];
    if (tile.organismsText[i-1] === 'Other (mark in notes)') {
      expectedString = '' + i + '\n' + tile.notes;
      expect(element(by.id('settlementTile'+index+'Grid'+i)).getText())
        .toEqual(expectedString);
    } else {
      var tileGrid = element(by.id('settlementTile'+index+'Grid'+i));
      expect(tileGrid.getText()).toEqual(expectedString);
      checkTileImage(tileGrid);
    }
  }
};

var assertSettlementTilesView = function(values, teamMember) {
  //Meta data
  var members = element.all(by.repeater('member in settlementTiles.teamMembers'));
  expect(members.count()).toEqual(1);
  var member = members.get(0);
  expect(member.element(by.binding('member.displayName')).isPresent()).toBe(true);
  expect(member.element(by.binding('member.displayName')).getText()).toEqual(teamMember.displayName);
  if (values.notes) {
    expect(element(by.binding('settlementTiles.notes')).isPresent()).toBe(true);
    expect(element(by.binding('settlementTiles.notes')).getText()).toEqual('Notes: ' + values.notes);
  }
  if (values.settlementTile1) {
    assertSettlementTileView(0, values.settlementTile1);
  }
  if (values.settlementTile2) {
    assertSettlementTileView(1, values.settlementTile2);
  }
  if (values.settlementTile3) {
    assertSettlementTileView(2, values.settlementTile3);
  }
  if (values.settlementTile4) {
    assertSettlementTileView(3, values.settlementTile4);
  }
};

var getSettlementTileGridList = function(organisms, notes) {
  var gridList = '';
  for (var i = 0; i < organisms.length; i++) {
    var commonName = organisms[i];
    if (commonName === 'Other (mark in notes)') {
      gridList += (i+1) + ': Other\n' + notes + '\n';
    } else {
      gridList += (i+1) + ': ' + commonName + '\n\n';
    }
  }
  return gridList.replace(/\n$/, '');
};

var assertSettlementTileCompare = function(index, values) {
  if (element(by.id('settlement-tile-description-compare')).isPresent()) {
    var tileDescriptionRow = element(by.id('settlement-tile-description-compare')).all(by.tagName('td'));
    var tileDescription = tileDescriptionRow.get(index);
    var tileDescriptionString = '';
    if (values.settlementTile1) {
      tileDescriptionString += 'Settlement Tile 1:\n\n' + values.settlementTile1.description + '\n\n';
    }
    if (values.settlementTile2) {
      tileDescriptionString += 'Settlement Tile 2:\n\n' + values.settlementTile2.description + '\n\n';
    }
    if (values.settlementTile3) {
      tileDescriptionString += 'Settlement Tile 3:\n\n' + values.settlementTile3.description + '\n\n';
    }
    if (values.settlementTile4) {
      tileDescriptionString += 'Settlement Tile 4:\n\n' + values.settlementTile4.description + '\n\n';
    }
    expect(tileDescription.getText()).toEqual(tileDescriptionString.trim());
  }
  if (element(by.id('sessile-organisms-observed-compare')).isPresent()) {
    // var organismsRow = element(by.id('sessile-organisms-observed-compare')).all(by.tagName('td'));
    // var tileTable = organismsRow.get(index);
    var tileTable = element(by.id('sessile-organisms-table-'+(index-1))).all(by.tagName('table'));
    //var tileTable = organismsRow.get(index-1);
    var tileTableString = '';
    if (values.settlementTile1) {
      tileTableString += 'SETTLEMENT TILE #1\n' +
        getSettlementTileGridList(values.settlementTile1.organismsText, values.settlementTile1.notes) + '\n';
    }
    if (values.settlementTile2) {
      tileTableString += 'SETTLEMENT TILE #2\n' +
        getSettlementTileGridList(values.settlementTile2.organismsText, values.settlementTile2.notes) + '\n';
    }
    if (values.settlementTile3) {
      tileTableString += 'SETTLEMENT TILE #3\n' +
        getSettlementTileGridList(values.settlementTile3.organismsText, values.settlementTile3.notes) + '\n';
    }
    if (values.settlementTile4) {
      tileTableString += 'SETTLEMENT TILE #4\n' +
        getSettlementTileGridList(values.settlementTile4.organismsText, values.settlementTile4.notes) + '\n';
    }
    var tileTableArray = [];
    tileTableArray.push(tileTableString.trim());
    expect(tileTable.getText()).toEqual(tileTableArray);
  }
};

module.exports = {
  settlementTiles1: settlementTiles1,
  settlementTiles2: settlementTiles2,
  settlementTiles3: settlementTiles3,
  assertSettlementTile: assertSettlementTile,
  assertSettlementTiles: assertSettlementTiles,
  fillOutSettlementTile: fillOutSettlementTile,
  fillOutSettlementTiles: fillOutSettlementTiles,
  assertSettlementTilesView: assertSettlementTilesView,
  assertSettlementTileCompare: assertSettlementTileCompare
};
