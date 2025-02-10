class SheetManager {
  private spreadsheetId: string
  private sheetName: string
  private sheet: GoogleAppsScript.Spreadsheet.Sheet
  constructor(spreadsheetId: string, sheetName: string) {
    this.spreadsheetId = spreadsheetId
    this.sheetName = sheetName
    const ss = SpreadsheetApp.openById(this.spreadsheetId)
    this.sheet = ss.getSheetByName(this.sheetName)!
  }
  public pasteInSheet(arrayToPaste: any[]) {
    if (arrayToPaste.length != 0) {
      var firstRow = this.sheet.getLastRow() + 1
      var subarrayLength = arrayToPaste[0].length
      var arrayLength = arrayToPaste.length
      this.sheet.getRange(firstRow, 1, arrayLength, subarrayLength).setValues(arrayToPaste)
      Logger.log("Pasted Data in sheet %s", this.sheet.getSheetName())
    }
  }
  public clearData(range: string) {
    this.sheet.getRange(range).clearContent()
  }
}
