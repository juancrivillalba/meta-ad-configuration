class MetaAdsClient {
  private API_VERSION = 21
  private accessToken = PropertiesService.getScriptProperties().getProperty("ACCESS_TOKEN")

  public makeApiRequest(endpoint: string, payload?: object): any[] {
    const url = `https://graph.facebook.com/v${this.API_VERSION}.0/${endpoint}${endpoint.includes("?") ? "&" : "?"}access_token=${this.accessToken}`
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: payload ? "post" : "get",
      contentType: "application/json",
      muteHttpExceptions: true,
      payload: payload ? JSON.stringify(payload) : undefined
    }

    const allData: any[] = []

    try {
      const response = UrlFetchApp.fetch(url, options)
      const responseCode = response.getResponseCode()
      let responseData = JSON.parse(response.getContentText())
      if (responseCode !== 200) {
        console.log(response.getContentText())
        throw new Error(response.getContentText())
      } else {
        if (responseData.data) {
          allData.push(...responseData.data)
        } else {
          allData.push(responseData)
        }
      }

      while (responseData.paging?.next) {
        const nextResponse = UrlFetchApp.fetch(responseData.paging.next, options)
        responseData = JSON.parse(nextResponse.getContentText())
        if (responseData.data) {
          allData.push(...responseData.data)
        } else {
          allData.push(responseData)
        }
      }
    } catch (error) {
      const metaAdsError = JSON.parse(error.message).error
      console.log(metaAdsError.error_user_msg ?? metaAdsError.message)
    }
    return allData
  }
}
