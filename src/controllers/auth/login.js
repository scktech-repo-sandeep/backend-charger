var AWS = require("aws-sdk");
const config = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("../auth/authentication");
//const dynamoose = require("dynamoose");

const login = async function (req, res) {
  AWS.config.update(config.aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();
  const table = "app_users";
  const mobileNo = req.body.mobileNo;
  const password = req.body.password;
  var params = {
    TableName: table,
    KeyConditionExpression: "#yr = :yyyy",
    ExpressionAttributeNames: {
      "#yr": "mobileNo",
    },
    ExpressionAttributeValues: {
      ":yyyy": mobileNo,
    },
  };
  try {
    docClient.query(params, function (err, data) {
      if (data.Items.length == 0) {
        return res
          .status(200)
          .json({ message: "please register", result: data.Items });
      } else {
        data.Items.forEach((item) => {
          let hash = item.password;
          bcrypt.compare(password, hash, function (err, resl1) {
            if (err) throw err;
            if (resl1) {
              let token = jwt.generateToken();
              let response = {
                id: item.id,
                username: item.emailId,
                token: token,
              };
              return res
                .status(200)
                .json({ message: "Login Success", result: response });
            } else {
              return res
                .status(400)
                .json({ message: "Invalid Username Or Password " });
            }
          });
        });
      }
    });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

// const getDataTest = async function (req, res) {
//   dynamoose.aws.sdk.config.update(config.aws_remote_config);
// };

module.exports = {
  login,
};
