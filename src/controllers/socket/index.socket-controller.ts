import { SocketController, OnConnect, OnDisconnect, ConnectedSocket } from 'socket-controllers'

@SocketController()
class ChatController {
  @OnConnect()
  connection(@ConnectedSocket() socket: any) {
    // console.log('client connected')
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {
    // console.log('client disconnected')
  }
}

export default ChatController
