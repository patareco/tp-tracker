const GoogleSpreadsheet =  require('google-spreadsheet').GoogleSpreadsheet;
const doc = new GoogleSpreadsheet('1FnuA1w242G_PzEfkiDj21FQlFLXFoNNNQ1SJ9gvdf5o');

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  
  try {
    await doc.useServiceAccountAuth({
      client_email: process.env.VUE_APP_GAPI_EMAIL,
      private_key: process.env.VUE_APP_GAPI_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    console.log(sheet.title);
    console.log(sheet.rowCount);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    await sheet.addRows([
      { Date: today, Number: event.queryStringParameters.number }
    ]);

    const rows = await sheet.getRows();

    console.log(rows);

    const subject = { Date: today, Number: event.queryStringParameters.number }

    return {
      statusCode: 200,
      body: JSON.stringify(subject),


      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
