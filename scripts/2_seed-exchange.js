const hre = require("hardhat");
const { ethers } = require("hardhat");
const config = require('../src/config.json');
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether");
};

const wait = (seconds) => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
    // Fetch accounts from wallet - all accounts are unlocked 
    const accounts = await ethers.getSigners()

    // Fetch network 
    const { chainId } = await ethers.provider.getNetwork()
    console.log("using chainId", chainId)

    // fetch deployed tokens
    const SEBZ = await ethers.getContractAt("Token", config[chainId].SEBZ.address)
    console.log(`SEBZ fetched: ${SEBZ.address}\n`)

    const mETH = await ethers.getContractAt("Token", config[chainId].mETH.address)
    console.log(`mETH fetched: ${mETH.address}\n`)

    const mDAI = await ethers.getContractAt("Token", config[chainId].mDAI.address)
    console.log(`mDAI fetched: ${mDAI.address}\n`)

    // Fetch the deployed exchange
    const exchange = await ethers.getContractAt("Exchange", config[chainId].exchange.address)
    console.log(`Exchange fetched: ${exchange.address}\n`)

    // give tokens to account[1]
    const sender = accounts[0]
    const receiver = accounts[1]
    let amount = tokens(10000)

    // user1 transfers 10,000 mETH
    let transaction, result
    transaction = await mETH.connect(sender).transfer(receiver.address, amount)
    console.log(`Transfered ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

    // Set up exchange users
    const user1 = accounts[0]
    const user2 = accounts[1]
    amount = tokens(10000)

    // user1 approves 10,000 SEBZ...
    transaction = await SEBZ.connect(user1).approve(exchange.address, amount)
    await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user1.address}`)

    // user1 deposits 10,000 SEBZ...
    transaction = await exchange.connect(user1).depositToken(SEBZ.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} Ether from ${user1.address}`)

    // user2 approves mETH
    transaction = await mETH.connect(user2).approve(exchange.address, amount)
    await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user2.address}`)

    //user2 deposits mETH
    transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} tokens from ${user2.address}`)

    /////////////////////////////////////////////////////////////////////////////
    // Make Canceled Orders 

    let orderId
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), SEBZ.address, tokens(5))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    // user1 cancels the order 
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user1).cancelOrder(orderId)
    result = await transaction.wait()
    console.log(`Cancelled order from ${user1.address}\n`)

    // Wait 1 second
    await wait(1)

    /////////////////////////////////////////////////////////////////////////////
    // Make Filled Orders 
    // user1 makes order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), SEBZ.address, tokens(10))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    // user1 cancels the order 
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)

    // Wait 1 second
    await wait(1)

    // user1 makes another order
    transaction = await exchange.makeOrder(mETH.address, tokens(50), SEBZ.address, tokens(15))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    // user2 fills another order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)

  // wait 1 second
  await wait(1)

  // user1 makes final order
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), SEBZ.address, tokens(20))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  // user2 fills final order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)

  // wait 1 second
  await wait(1)

  /////////////////////////////////////////////////////////////
  // Make Open Orders
  //

  // user1 makes 10 orders
  for(let i = 1; i <= 10; i++) {
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(10 * i), SEBZ.address, tokens(10))
    result = await transaction.wait()

    console.log(`Made order from ${user1.address}`)

    // wait 1 second
    await wait(1)
  }

  // user2 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange.connect(user2).makeOrder(SEBZ.address, tokens(10), mETH.address, tokens(10 * i))
    result = await transaction.wait()

    console.log(`Made order from ${user2.address}`)

    // wait 1 second
    await wait(1)
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
