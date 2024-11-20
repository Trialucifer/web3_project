const { task } = require("hardhat/config")
//task 名字
task("deploy-fundme", "deploy and verify fundme contract").setAction(async(taskArgs, hre) => {
    //create factory : 合约工厂，进行合约部署的,FundMe 合约的名字
    //await 表示在执行完这个方法之前，不要进行下一步操作
    const fundMeFacotry = await ethers.getContractFactory("FundMe")
    //deploy contract from factory，deploy并不能保证合约一定能部署
    console.log("contract deploying")
    const fundMe = await fundMeFacotry.deploy(300)
    //等待部署完成，这里是真正的完成
    fundMe.waitForDeployment();
    // console.log("contract has been deploye successfully, contract address is " + fundMe.target)
    console.log(`contract has been deploye successfully, contract address is ${fundMe.target}`)
    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        //等5个区块,验证成功性更高
        console.log("waiting for 5 confirmations")
        await fundMe.deploymentTransaction().wait(5)
        verifyFundMe(fundMe.target, 300)
    }else {
        console.log("verification skipped..")
    }
})

async function verifyFundMe(fundMeAddr, args) {
    //验证脚本
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: [args],
      });
}

module.exports = {}
//命令是： npx hardhat deploy-fundme --network sepolia