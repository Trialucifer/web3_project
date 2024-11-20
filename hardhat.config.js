require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config({path: '../.env'})
require("@chainlink/env-enc").config();
//自动去找 index.js文件
require("./tasks")
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
      sepolia: ETHERSCAN_API_KEY
    }
  }
};
