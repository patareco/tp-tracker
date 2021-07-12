export default (sheet) => {
  let data = sheet.data.feed.entry;

  var result = new Array();
  data.forEach((cell, i) => {
    if (i % 2 === 0) {
      result[i / 2] = {};
      result[i / 2].label = {
        title: cell.content.$t.split("|")[0].trim(),
        unit:
          cell.content.$t.split("|").length > 1
            ? cell.content.$t.split("|")[1].trim()
            : "",
      };
    } else {
      result[(i - 1) / 2].value = cell.content.$t;
    }
  });
  return result;
};
