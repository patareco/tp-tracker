const GoogleSpreadsheet =  require('google-spreadsheet').GoogleSpreadsheet;
const doc = new GoogleSpreadsheet('1FnuA1w242G_PzEfkiDj21FQlFLXFoNNNQ1SJ9gvdf5o');

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  try {
    var subject = {};
    await doc.useServiceAccountAuth({
      client_email: process.env.VUE_APP_GAPI_EMAIL,
      private_key: process.env.VUE_APP_GAPI_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
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
    // crazy date formatting in gspreadsheets
    var todayGSFormat = dd + '-' + mm + '-' + yyyy

    if ( event.queryStringParameters.number ) {
      let obj = { Date: today, Number: event.queryStringParameters.number };

      const rows = await sheet.getRows();

      //add rows if last today's date is different
      if ( rows[rows.length-1].Date != todayGSFormat ) {
        await sheet.addRows([
          obj  
        ]);
        subject.status = "Added TP number Row for " + todayGSFormat; 
      }
      else {
        //update last row if today's date is the same as last row
        rows[rows.length-1].Date = today;
        rows[rows.length-1].Number = event.queryStringParameters.number;
        await rows[rows.length-1].save(); // save changes
        subject.status = "Updated TP number Row"
      }

      subject = {
        ...subject,
        success: true,
        dataAdded: obj
      }
    }
    else {
      subject = {
        success: false,
        status: "Failed to add rows - You need to specify a number of rolls using a query param \'number\'"
      }
    }


    return {
      statusCode: 200,
      body: JSON.stringify(subject),
      headers: {
        "access-control-allow-origin": "*"
      }

      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
