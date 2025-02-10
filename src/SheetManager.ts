class SheetTimestampDataCleaner {
  private spreadsheetId: string;
  private sheetName: string;
  private sheet: GoogleAppsScript.Spreadsheet.Sheet;
  constructor(spreadsheetId, sheetName) {
    this.spreadsheetId = spreadsheetId;
    this.sheetName = sheetName;
    const ss = SpreadsheetApp.openById(this.spreadsheetId);
    this.sheet = ss.getSheetByName(this.sheetName)!;
  }
  private pasteInSheet(arrayToPaste) {
    if (arrayToPaste.length != 0) {
      var firstRow = this.sheet.getLastRow() + 2; //Assist card pone la data a partir de la segunda fila
      var subarrayLength = arrayToPaste[0].length;
      var arrayLength = arrayToPaste.length;
      this.sheet
        .getRange(firstRow, 1, arrayLength, subarrayLength)
        .setValues(arrayToPaste);
      Logger.log("Pasted Data in sheet %s", this.sheet.getSheetName());
    }
  }
  private clearData(sheet, range) {
    sheet.getRange(range).clearContent();
  }
}
