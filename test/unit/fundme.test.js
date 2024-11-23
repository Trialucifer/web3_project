const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
//用来模拟时间流失
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const {devlopmentChains} = require("../../helper-hardhat-config")

!devlopmentChains.includes(network.name) 
? describe.skip 
: describe("test fundme contract", async function() {

    //beforeEach 每个if运行之前都会运行这个
    let fundMe
    let secondAccount
    let firstAccount
    let mockV3Aggregator
    beforeEach(async function() {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount
        //deployments.get("FundMe") 获取合约的部署对象（部署信息）
        const fundMeDeployment = await deployments.get("FundMe")
        //获取合约的实例，然后允许调用公开的方法
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
        //部署一个假的合约
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
        //连接新的地址用这个函数
        secondFundMe = await ethers.getContract("FundMe", secondAccount)
    })
    
    it("test if the owner is msg.sender", async function() {
        // const [firstAccount] = await ethers.getSigners()
        // const fundMeFactory = await ethers.getContractFactory("FundMe")
        // //部署FundMe合约
        // const fundMe = await fundMeFactory.deploy(180)
        await fundMe.waitForDeployment()
        // assert.equal((await fundMe.owner()), firstAccount.address)
        assert.equal((await fundMe.owner()), firstAccount)
    })

    // it("test if the datafeed is assigned correctuly", async function() {
    //     // const fundMeFactory = await ethers.getContractFactory("FundMe")
    //     // //部署FundMe合约
    //     // const fundMe = await fundMeFactory.deploy(180)
    //     await fundMe.waitForDeployment()
    //     assert.equal((await fundMe.dataFeed()), mockV3Aggregator.address)
    // })

    //fund , getFund ,refund
    //unit test for fun
    //window open,value greater the minium value, funder balance
    it("window close, value grater thean minimum, fund failed", 
        async function() {
            //超过180 make sure the window is closed
            await helpers.time.increase(200)
            //模拟挖矿，使得时间超过200秒
            await helpers.mine()
            //value 大于最小值
             //wei 为单位
            expect(fundMe.fund({value: ethers.parseEther("0.1")})).to.be.revertedWith("window is closed")
        }
    )

    it("window open, value is less than minimum, fund failed", 
        async function () {
            expect(fundMe.fund({value: ethers.parseEther("0.01")})).to.be.revertedWith("Send more ETH")
        }
    )

    it("window close, value is greater minimum, fund success", 
        async function () {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            //默认是第一个账号调用了这个合约
            const balance = await fundMe.fundersToAmount(firstAccount)
            expect(balance).to.equal(ethers.parseEther("0.1"))
        }
    )

    //unit test for getFund
    //onlyOwner, windowClose, target reached
    it("not owner, window close, target reached , fetFund failed",
        async function () {
             //make sure the target reached
             await fundMe.fund({value: ethers.parseEther("1")})
            //超过180 make sure the window is closed
            await helpers.time.increase(200)
            //模拟挖矿，使得时间超过200秒
            await helpers.mine()
            expect(secondFundMe.getFund()).to.be.revertedWith("this function can only be called by owner")
        }
    )

    it("windwow open, target reached, getFund failed", 
        async function () {
            await fundMe.fund({value: ethers.parseEther("1")})
            await expect(fundMe.getFund()).to.be.revertedWith("window is not closed")
        }
    )

    it("window close, target not reached, getFund failed",
        async function() {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            //超过180 make sure the window is closed
            await helpers.time.increase(200)
            //模拟挖矿，使得时间超过200秒
            await helpers.mine()
            await expect(fundMe.getFund()).to.be.revertedWith("Target is not reached")
        }
    )

    it("window close, target reached, getFund success",
        async function() {
            await fundMe.fund({value: ethers.parseEther("1")})
            //超过180 make sure the window is closed
            await helpers.time.increase(200)
            //模拟挖矿，使得时间超过200秒
            await helpers.mine()
            await expect(fundMe.getFund()).to.emit(fundMe, "FundWithdDrawByOwner")
            .withArgs(ethers.parseEther("1"))
        }
    )

    //reFund
    //window close,target not reache, funder has balance
    it("window open, target not reached, funder has balance", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            expect(fundMe.refund()).to.be.revertedWith("window is not closed")
        }
    )

    it("window closed, target reached, funder has balance", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("1")})
            await helpers.time.increase(200)
            await helpers.mine()
            expect(fundMe.refund()).to.be.revertedWith("Target is reached")
        }
    )

    it("window closed, target reached, funder no balance", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("1")})
            await helpers.time.increase(200)
            await helpers.mine()
            expect(secondFundMe.refund()).to.be.revertedWith("there is no fund for you")
        }
    )

    it("window closed, target reached, funder has balance", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("1")})
            await helpers.time.increase(200)
            await helpers.mine()
            expect(fundMe.refund()).to.emit(fundMe, "RefundBalance")
            .withArgs(firstAccount, ethers.parseEther("1"))
            // const balance = await fundMe.fundersToAmount(firstAccount)
            // expect(balance).to.equals(ethers.parseEther("1"))
        }
    )
})

//执行命令：npx hardhat test
