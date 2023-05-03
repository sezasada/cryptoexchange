const { ethers } = require("hardhat");
const { expect } = require("chai");
 
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
  // All of the tests
  let token, accounts, deployer
  beforeEach(async () => {
    // This code will run before each it()
    // Fetching the token from blockchain
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Sebastien's Token", "SEBZ", 1000000);

    accounts = await ethers.getSigners()
    deployer = accounts[0]
  });

  describe("Deployment", () => {

    const name = "Sebastien's Token";
    const symbol = "SEBZ";
    const decimals = 18;
    const totalSupply = tokens("1000000")

    it("has correct name", async () => {
      // checking that the name is correct
      expect(await token.name()).to.equal(name);
    });

    it("has correct symbol", async () => {
      // checking that the symbol is correct
      expect(await token.symbol()).to.equal(symbol);
    });

    it("has correct decimals", async () => {
      // checking that the decimals are correct
      expect(await token.decimals()).to.equal(decimals);
    });

    it("has correct totalSupply", async () => {
      // checking that the total supply is correct
      expect(await token.totalSupply()).to.equal(totalSupply);
    });
    it("assigns total supply to deployer", async () => {
      // checking that the total supply is correct
      console.log(deployer.address);
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    });
  });
});
