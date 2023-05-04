const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Exchange", () => {
  // All of the tests
  let deployer, feeAccount, exchange, accounts

    const feePercent = 10

  beforeEach(async () => {

    // This code will run before each it()
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    feeAccount = accounts[1];

    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy(feeAccount.address, feePercent);
  });

  describe("Deployment", () => {

    it("tracks the fee account", async () => {
      // checking that the name is correct
      expect(await exchange.feeAccount()).to.equal(feeAccount.address);
    });
    it("tracks the fee percent", async () => {
        // checking that the name is correct
        expect(await exchange.feePercent()).to.equal(feePercent);
      });
  });
});
