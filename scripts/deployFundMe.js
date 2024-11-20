// import ethers.js 用于和EVM线上合约交互并部署合约的第三方的一个包 
// create main function
    
// execute main funciton

//hardhat包中有很多东西，只引入 ethers
const {ethers} = require("hardhat")

async function main() {
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
    // if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    //     //等5个区块,验证成功性更高
    //     console.log("waiting for 5 confirmations")
    //     await fundMe.deploymentTransaction().wait(5)
    //     verifyFundMe(fundMe.target, 300)
    // }else {
    //     console.log("verification skipped..")
    // }

    // //int 2 accounts ethers.getSigners()方法可以拿到配置文件中的两个账号
    // const [firstAccount, secondAccount] = await ethers.getSigners()
    // //fund contract weith first account 第一个账户调用合约的 fund函数
    // const fundTx = await fundMe.fund({value: ethers.parseEther("0.5")})
    // //上面的转账不能保证币一定是发送成功的，所以得等待
    // await fundTx.wait()
    // //check balance of contract 查看合约中有收到 0.5嘛
    // const balancOfContract = await ethers.provider.getBalance(fundMe.target)
    // console.log(`Balance of the contract is ${balancOfContract}`)
    // //fund contract with send account
    // const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.0")})
    // await fundTxWithSecondAccount.wait()
    // //check balance of contract
    // const balancOfContractWithSecondAccount = await ethers.provider.getBalance(fundMe.target)
    // console.log(`Balance of the contract is ${balancOfContractWithSecondAccount}`)
    // //check mapping fundersToAmount
    // const firstAccountBalance = await fundMe.fundersToAmount(firstAccount.address)
    // const secondAccountBalance = await fundMe.fundersToAmount(secondAccount.address)
    // console.log(`balance of first account ${firstAccount.address} is ${firstAccountBalance}`)
    // console.log(`balance of second account ${secondAccount.address} is ${secondAccountBalance}`)
}

//main 不加括号，说明这个main是变量或者是一个值
main().then().catch((error) => { 
    console.error(error)
    //正常退出是0，非正常是1
    process.exit(1)
})

async function verifyFundMe(fundMeAddr, args) {
     //验证脚本
     await hre.run("verify:verify", {
         address: fundMeAddr,
         constructorArguments: [args],
       });
}

//脚本执行： npx hardhat run scripts/deployFundMe.js
