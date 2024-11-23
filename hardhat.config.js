require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config({path: '../.env'})
require("@chainlink/env-enc").config();
//自动去找 index.js文件
require("./tasks")
require("hardhat-deploy")
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
const { ProxyAgent, setGlobalDispatcher } = require("undici");

const SEPOLIA_URL = process.env.SEPOLIA_URL
const SEPOLIA_URL_2 = process.env.SEPOLIA_URL_2
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY


const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");//查看自己的代理 修改端口
setGlobalDispatcher(proxyAgent);


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  defaultNetwork: "hardhat",
  mocha: {
    //修改配置等待200秒，默认配置超过40秒就报错
    timeout: 300000
  },
  networks: {
    sepolia: {
      //如果要部署真实的测试网，通过第三方服务商拿到免费的url Elchemy,Infura,QuickNode
      url: SEPOLIA_URL_2,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_2],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: {
      //etherscan 进行合约验证是时候用的
      sepolia: ETHERSCAN_API_KEY
    }
  },
  namedAccounts: {
    firstAccount: {
      default: 0
    },
    secondAccount: {
      default: 1
    }
  },
  gasReporter: {
    enabled: false
  }
};
