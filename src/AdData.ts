class adData {
  private accountId: string
  private clientName: string
  private today = new Date()
  private yesterday = new Date(this.today.getDate() - 1)
  private startDate = Utilities.formatDate(this.yesterday, "GMT+0", "yyyy-MM-dd")
  private endDate = Utilities.formatDate(this.today, "GMT+0", "yyyy-MM-dd")
  private metaApi: MetaAdsClient

  constructor(accountId: string, clientName: string) {
    this.accountId = accountId
    this.clientName = clientName
    this.metaApi = new MetaAdsClient()
  }

  private getAdData() {
    const endpoint = `act_${this.accountId}/ads?fields=name%2Ceffective_status%2Ccreative%7Basset_feed_spec%2Cobject_story_spec%7D&filtering=%5B%7Bfield%3A%22effective_status%22%2Coperator%3A%22IN%22%2Cvalue%3A%5B%22ACTIVE%22%5D%7D%5D`
    const responseData = this.metaApi.makeApiRequest(endpoint)
    return responseData
  }

  private getAdParents() {
    const endpoint = `act_${this.accountId}/insights?level=ad&fields=ad_id%2Cadset_name%2Ccampaign_name%2Cspend&time_range=%7B%22since%22%3A%22${this.startDate}%22%2C%22until%22%3A%22${this.endDate}%22%7D`
    const responseData = this.metaApi.makeApiRequest(endpoint)
    const adParents = responseData.map((x) => ({
      campaign_name: x.campaign_name,
      adset_name: x.adset_name,
      ad_id: x.ad_id
    }))
    return adParents
  }

  private adConfiguration() {
    const adData = this.getAdData()
    const adParents = this.getAdParents()
    const result = adData.map((innerArray) => {
      const matchValue = innerArray[7]

      const matchingItem = adParents.find((item) => item.ad_id === matchValue)

      if (matchingItem) {
        return [innerArray[0], matchingItem.campaign_name, matchingItem.adset_name, ...innerArray.slice(1, -1)]
      }

      return innerArray.slice(0, -1)
    })
    return result
  }
}
