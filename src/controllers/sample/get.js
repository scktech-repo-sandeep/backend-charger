var AWS = require("aws-sdk");
const config = require("../../config/db");
//const dynamoose = require("dynamoose");

const getData = async function (req, res) {
  AWS.config.update(config.aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();
  const table = "charger_register";
  var params = {
    TableName: table,
    FilterExpression: "#yr = :yyyy",
    ExpressionAttributeNames: {
      "#yr": "noVerified",
    },
    ExpressionAttributeValues: {
      ":yyyy": "N",
    },
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      res.send({
        success: false,
        message: JSON.stringify(err, null, 2),
      });
    } else {
      res.send({
        success: true,
        message: "SUCCESS",
        movie: data.Items,
      });
    }
  });
};

// const getDataTest = async function (req, res) {
//   dynamoose.aws.sdk.config.update(config.aws_remote_config);
// };

module.exports = {
  getData,
};
