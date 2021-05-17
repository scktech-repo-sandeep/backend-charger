const AWS = require("aws-sdk");
const config = require("../../config/db");
const uuidv1 = require("uuid/v1");
const bcrypt = require("bcrypt");
const moment = require("moment");

const verifyNumber = async (req, res) => {
  if (verified == true) {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const table = "app_users";
    var params = {
      TableName: table,
      Key: {
        mobileNo: req.body.mobileNo,
        emailId: req.body.emailId,
      },
      UpdateExpression: "set  mobileVerifed= :r",
      ExpressionAttributeValues: {
        ":r": "Y",
      },
      ReturnValues: "UPDATED_NEW",
    };

    console.log("Updating the item...");
    docClient.update(params, function (err, data) {
      if (err) {
        res.status(400).json({ message: err });
      } else {
        res.status(200).json({ message: "mobile Verified" });
      }
    });
  }
};

const verifyEmailId = async (req, res) => {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const table = "app_users";
  var params = {
    TableName: table,
    Key: {
      mobileNo: req.body.mobileNo,
      emailId: req.body.emailId,
    },
    UpdateExpression: "set  emailVerified= :r",
    ExpressionAttributeValues: {
      ":r": "Y",
    },
    ReturnValues: "UPDATED_NEW",
  };

  console.log("Updating the item...");
  docClient.update(params, function (err, data) {
    if (err) {
      res.status(200).json({ message: err });
    } else {
      res.status(200).json({ message: "Email Verified" });
    }
  });
};

//sednotp api with number,emailId
const sendOtp = async (req, res) => {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const table = "app_otp";
  // create number
  let otp = Math.floor(100000 + Math.random() * 900000);

  const Item = {
    Id: uuidv1(),
    otp: otp.toString(),
    mobileNo: req.body.mobileNo,
    emailId: req.body.emailId,
    createdAt: moment().format(),
    isActive: "1",
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
      res.send({
        success: true,
        message: "otp sent",
        data: Item,
      });
    }
  });
};

function verifyOtp(otp, number, emailId) {
    
}

// verifyUpdate("0987654", "san@gmail.com");
// verifyEmailId("0987654", "san@gmail.com");

exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
exports.verifyEmailId = verifyEmailId;

exports.verifyNumber = verifyNumber;
