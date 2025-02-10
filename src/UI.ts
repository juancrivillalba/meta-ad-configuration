function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Ad Configuration data")
    .addItem("Get ad Data", "main")
    .addToUi();
}

function createTrigger() {
  const ss = SpreadsheetApp.openById("");
  ScriptApp.newTrigger("onOpen").forSpreadsheet(ss).onOpen().create();
}
