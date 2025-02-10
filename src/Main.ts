function main() {
  let array = new Array()
  const headers = ["country", "campaign_name", "adset_name", "ad_name", "copies", "titles", "descriptions", "call_to_action", "link"]
  array.push(headers)
  for (const account of config.acounts) {
    try {
      const adData = new AdData(account.accountId, account.name)
      const adConfiguration = adData.adConfiguration()
      array = array.concat(adConfiguration)
    } catch (e) {
      console.log(`Error getting data for ${account.name}: ${e}`)
    }
  }
  const sheetManager = new SheetManager(config.spreadSheetId, config.sheetName)
  try {
    sheetManager.clearData("A2:I")
    sheetManager.pasteInSheet(array)
  } catch (e) {
    console.log(`Error traying to paste ad configuration data: ${e}`)
  }
}
