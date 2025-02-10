class AdData {
  private accountId: string
  private clientName: string
  private metaApi: MetaAdsClient

  constructor(accountId: string, clientName: string) {
    this.accountId = accountId
    this.clientName = clientName
    this.metaApi = new MetaAdsClient()
  }

  private getAdData() {
    console.log(`Fetching ad configuration data for:
      client name: ${this.clientName}
      account id: ${this.accountId}`)
    const endpoint = `act_${this.accountId}/ads?fields=name%2Ceffective_status%2Ccreative%7Basset_feed_spec%2Cobject_story_spec%7D&filtering=%5B%7Bfield%3A%22effective_status%22%2Coperator%3A%22IN%22%2Cvalue%3A%5B%22ACTIVE%22%5D%7D%5D`
    const responseData = this.metaApi.makeApiRequest(endpoint)
    const array = new Array()
    for (const ad of responseData) {
      const adName = ad.name
      const adId = ad.id
      const creative = ad.creative
      let copies: string
      let titles: string
      let descriptions: string
      let callToAction: string
      let linkUrl: string
      let spec: any
      if (creative.asset_feed_spec) {
        spec = creative.asset_feed_spec
        copies = spec.bodies.map((obj) => obj.text).join(",") || ""
        titles = spec.titles.map((obj) => obj.text).join(",") || ""
        descriptions = spec.descriptions.map((obj) => obj.text).join(",") || ""
        callToAction = spec.call_to_action_types[0] || ""
        linkUrl = spec.link_urls.map((obj) => obj.website_url).join(",") || ""
      }
      if (creative.object_story_spec.link_data || creative.object_story_spec.video_data || creative.object_story_spec.template_data) {
        spec = creative.object_story_spec.video_data || creative.object_story_spec.link_data || creative.object_story_spec.template_data
        copies = spec.message || ""
        titles = spec.title || ""
        descriptions = spec.link_description || ""
        callToAction = spec.call_to_action.type || ""
        linkUrl = spec.call_to_action.value.link || spec.link || ""
      }
      array.push([this.clientName, adName, copies, titles, descriptions, callToAction, linkUrl, adId])
    }
    return array
  }

  private getAdParents() {
    console.log(`Fetching ad parents data for:
      client name: ${this.clientName}
      account id: ${this.accountId}`)
    const today = new Date()
    const startDate = Utilities.formatDate(new Date(today.setDate(today.getDate() - 1)), "GMT+0", "yyyy-MM-dd")
    const endDate = Utilities.formatDate(new Date(), "GMT+0", "yyyy-MM-dd")
    const endpoint = `act_${this.accountId}/insights?level=ad&fields=ad_id%2Cadset_name%2Ccampaign_name%2Cspend&time_range=%7B%22since%22%3A%22${startDate}%22%2C%22until%22%3A%22${endDate}%22%7D`
    const responseData = this.metaApi.makeApiRequest(endpoint)
    const adParents = responseData.map((x) => ({
      campaign_name: x.campaign_name,
      adset_name: x.adset_name,
      ad_id: x.ad_id
    }))
    return adParents
  }

  public adConfiguration() {
    const adData = this.getAdData()
    const adParents = this.getAdParents()
    const result = adData.map((innerArray) => {
      const matchValue = innerArray[7]
      const matchingItem = adParents.find((item) => item.ad_id === matchValue)
      if (matchingItem) {
        return [innerArray[0], matchingItem.campaign_name, matchingItem.adset_name, ...innerArray.slice(1, -1)]
      }
      return [innerArray[0], "", "", ...innerArray.slice(1, -1)]
    })
    console.log(`Finished fetching data for:
        client name: ${this.clientName}
        account id: ${this.accountId}`)
    return result
  }
}
