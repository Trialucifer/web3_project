const { ethers } = require("hardhat")
const { assert } = require("chai")

describe("test fundme contract", async function() {
    it("test if the owner is mag.sender", async function() {
        const [firstAccount] = await ethers.getSigners()
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        //部署FundMe合约
        const fundMe = await fundMeFactory.deploy(180)
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.owner()), firstAccount.address)
    })
})

//执行命令：npx hardhat test
