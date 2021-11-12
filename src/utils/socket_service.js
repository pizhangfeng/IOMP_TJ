// export default class SocketService {
//   /**
//    * 单例
//    */
//   static instance = null
//   static get Instance() {
//     if (!this.instance) {
//       this.instance = new SocketService()
//     }
//     return this.instance
//   }

//   // 和服务端连接的socket对象
//   ws = null
//   // 标识是否连接成功
//   connected = false
//   // 请求数据尝试的次数
//   sendRetryCount = 0
//   // 重新连接尝试的次数
//   connectRetryCount = 0

//   // 存储回调函数
//   callBackMapping = {}

//   // 定义连接服务器的方法
//   connect() {
//     // 连接服务器
//     if (!window.WebSocket) return console.log('您的浏览器不支持 WebSocket');

//     //this.ws = new WebSocket('ws://101.34.160.195:9998')
//     this.ws = new WebSocket('ws://127.0.0.1:9998')

//     // 使用接口地址
//     // this.ws = new WebSocket('ws://101.34.160.195:9998')


//     // 连接成功的事件
//     this.ws.onopen = () => {
//       this.connected = true
//       this.connectRetryCount = 0
//       console.log('连接服务端成功了');
//     }
//     //客户端发送服务端数据
//     //action: getData, fullScreen, themeChange
//     //socketType（前端响应函数标识）: hotData,mapData,rankData,sellerData,stockData,trednData,fullScreen,themeChange
//     //chartName: hot,map,rank,seller,stock,trend
//     //value: 是否全屏，风格

//     //服务端发送客户端数据
//     //接收客户端数据，如果action=getData返回{data: JSON.stringify(chartName.json)}
//     //接收客户端数据，如果action等于其他，将该数据转发给其他所有客户端

//     // 接收到服务端数据
//     this.ws.onmessage = (msg) => {
//       console.log('接收到数据')
//       // 保存接收到的数据
//       const recvData = JSON.parse(msg.data)
//       // console.log('接收到数据：',recvData);
//       // 取出业务模块类型
//       const socketType = recvData.socketType
//       // 判断回调函数是否存在
//       if (this.callBackMapping[socketType]) {
//         const action = recvData.action
//         if (action === 'getData') {
//           // 获取数据  realData真实数据
//           const realData = JSON.parse(recvData.data)
//           // console.log('真实数据：',realData);
//           //当客户端一send就会执行客户端对应的回调方法
//           this.callBackMapping[socketType].call(this, realData)
//         } else if (action === 'fullScreen') {
//           // 全屏事件
//           this.callBackMapping[socketType].call(this, recvData)
//         } else if (action === 'themeChange') {
//           // 主题切换
//           this.callBackMapping[socketType].call(this, recvData)
//         }
//       }
//     }

//     // 连接服务端失败
//     this.ws.onerror = () => {
//       this.connected = false
//       console.log('连接服务端失败');
//     }

//     // 连接已关闭  当连接成功后:服务器关闭
//     this.ws.onclose = () => {
//       this.connectRetryCount++
//       this.connected = false
//       console.log('连接已关闭');
//       setTimeout(() => {
//         this.connect()
//       }, this.connectRetryCount * 500);
//     }
//   }

//   /**
//    * 注册回调函数
//    * @param {socketType} 业务模块类型 
//    * @param {*} callback 
//    */
//   registerCallBack(socketType, callback) {
//     this.callBackMapping[socketType] = callback
//   }

//   // 取消某一个回调函数
//   unRegisterCallBack(socketType) {
//     this.callBackMapping[socketType] = null
//   }

//   // 发送数据的方法
//   send(data) {
//     if (this.connected) {
//       this.sendRetryCount = 0
//       // 调用 webSocket 身上的send方法
//       // console.log('发送请求：',data);
//       this.ws.send(JSON.stringify(data))
//     } else {
//       this.sendRetryCount++

//       setTimeout(() => {
//         this.send(data)
//       }, this.sendRetryCount * 500);
//     }

//   }
// }
export default class SocketService {
  /**
   * 单例
   */
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 和服务端连接的socket对象
  ws = null

  // 存储回调函数
  callBackMapping = {}

  // 标识是否连接成功
  connected = false

  // 记录重试的次数
  sendRetryCount = 0

  // 重新连接尝试的次数
  connectRetryCount = 0

  //  定义连接服务器的方法
  connect() {
    // 连接服务器
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebSocket')
    }
    this.ws = new WebSocket('ws://localhost:9998')

    // 连接成功的事件
    this.ws.onopen = () => {
      console.log('连接服务端成功了')
      this.connected = true
      // 重置重新连接的次数
      this.connectRetryCount = 0
    }
    // 1.连接服务端失败
    // 2.当连接成功之后, 服务器关闭的情况
    this.ws.onclose = () => {
      console.log('连接服务端失败')
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, 500 * this.connectRetryCount)
    }
    // 得到服务端发送过来的数据
    this.ws.onmessage = msg => {
      console.log('从服务端获取到了数据')
      // 真正服务端发送过来的原始数据时在msg中的data字段
      // console.log(msg.data)
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
        } else if (action === 'themeChange') {
          this.callBackMapping[socketType].call(this, recvData)
        }
      }
    }
  }

  // 回调函数的注册
  registerCallBack (socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  // 取消某一个回调函数
  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送数据的方法
  send (data) {
    // 判断此时此刻有没有连接成功
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 500)
    }
  }
}
