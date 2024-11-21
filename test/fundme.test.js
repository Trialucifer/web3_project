const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")

describe("test fundme contract", async function() {

    //beforeEach 每个if运行之前都会运行这个
    let fundMe
    let firstAccount
    beforeEach(async function() {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        //deployments.get("FundMe") 获取合约
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
    })
    
    it("test if the owner is mag.sender", async function() {
        // const [firstAccount] = await ethers.getSigners()
        // const fundMeFactory = await ethers.getContractFactory("FundMe")
        // //部署FundMe合约
        // const fundMe = await fundMeFactory.deploy(180)
        await fundMe.waitForDeployment()
        // assert.equal((await fundMe.owner()), firstAccount.address)
        assert.equal((await fundMe.owner()), firstAccount)
    })

    it("test if the datafeed is assigned correctuly", async function() {
        // const fundMeFactory = await ethers.getContractFactory("FundMe")
        // //部署FundMe合约
        // const fundMe = await fundMeFactory.deploy(180)
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.dataFeed()), "asdfasdfasdfasdfasdf")
    })
})

//执行命令：npx hardhat test
