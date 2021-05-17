const AWS = require("aws-sdk");
const config = require("../../config/db");
const uuidv1 = require("uuid/v1");
const bcrypt = require("bcrypt");
const moment = require("moment");

const registerCustomer = async function (req, res) {
  try {
    //let num = req.body.mobileNo;
    //  let getMobileNo = await getNumber(num);
    //console.log(getMobileNo);
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    var userId;
    var isCustomer;
    if (req.body.registerType == "Customer") {
      userId = "CUST" + Math.floor(100000 + Math.random() * 900000);
      isCustomer = "Y";
    }
    if (req.body.registerType == "Partner") {
      userId = "PTR" + Math.floor(100000 + Math.random() * 900000);
      isCustomer = "N";
    }

    const table = "app_users";
    const salt = await bcrypt.genSalt(10);
    const Item = {
      id: uuidv1(),
      userId: userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      mobileNo: req.body.mobileNo,
      emailId: req.body.emailId,
      password: await bcrypt.hash(req.body.password, salt),
      registerType: req.body.registerType,
      mobileVerifed: "N",
      emailVerified: "N",
      termsAndConditions: req.body.termsAndConditions,
      isActive: 1,
      isCustomer: isCustomer,
      createdAt: moment().format(),
    };
    const params = {
      TableName: table,
      Item: Item,
    };

    //Call DynamoDB to add the item to the table
    docClient.put(params, function (err, data) {
      if (err) {
        res.send({
          success: false,
          message: err,
        });
      } else {
        if (req.body.registerType == "Partner") {
          saveCharger(req.body, userId);
        }
        res.send({
          success: true,
          message: "SUCCESS",
          data: Item,
        });
      }
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
      data: null,
    });
  }
};

function saveCharger(item, userId) {
  try {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const table = "app_charger";

    const Item = {
      id: uuidv1(),
      chargerName: item.chargerName,
      chargerId: item.chargerId,
      serviceId: userId,
      powerRating: item.powerRating,
      availability: item.availability,
      plugType: item.plugType,
      cost: item.cost,
      location: {
        long: item.location.long,
        lat: item.location.lat,
        pincode: item.location.pincode,
      },
      amenities: item.amenities,
      isActive: 1,
    };

    var params = {
      TableName: table,
      Item: Item,
    };
    try {
      // Call DynamoDB to add the item to the table
      docClient.put(params, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
}

function getNumber(item) {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const table = "app_users";
  var params = {
    TableName: table,
    KeyConditionExpression: "#number = :mobileNo",
    ExpressionAttributeNames: {
      "#number": "mobileNo",
    },
    ExpressionAttributeValues: {
      ":mobileNo": item,
    },
  };
  let returnValue;

  docClient.query(params, function (err, data) {
    if (err) {
      return false;
    } else {
      if (data.Items == []) {
        returnValue = false;
      } else {
        returnValue = true;
      }
    }
  });
  console.log(returnValue);

  return returnValue;
}

module.exports = {
  registerCustomer,
};
