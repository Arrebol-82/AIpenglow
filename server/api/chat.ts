// server/api/chat.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userMessage = body.message

  console.log('Nitro 后端收到前端消息:', userMessage)

  // 模拟网络延迟（未来这里将替换成请求你本地 MCP 接口的代码）
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    reply: `我已经收到你的指令：“${userMessage}”。我的底层 MCP 服务正在接入中，准备随时为你执行任务！`
  }
})
