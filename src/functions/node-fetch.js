import fetch from "node-fetch"

exports.handler = async (event, context) => {
  // https://github.com/jhackett1/joshuahackett/blob/f137f5283841c8312eb86196737462dff107cc26/src/functions/get-posts.js
  const response = await fetch(event.queryStringParameters.url)
  const bodyContent = await response.text()
  return  {
    statusCode: 200,
    body: bodyContent
  }
}