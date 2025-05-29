import { type NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { scenario, intensity, userInput, intensityName } = await request.json()

    if (!userInput || !scenario) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 构建提示词
    const prompt = buildPrompt(scenario, intensity, intensityName, userInput)

    // 调用 OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://communication-assistant.vercel.app',
        'X-Title': 'Communication Assistant'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error status:', response.status)
      console.error('OpenRouter API error data:', errorData)
      throw new Error(`API调用失败: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('AI未返回有效回复')
    }

    // 解析AI返回的回复
    const replies = parseReplies(aiResponse)

    return NextResponse.json({ replies })

  } catch (error) {
    console.error('生成回复错误:', error)
    return NextResponse.json(
      { error: '生成回复失败，请稍后重试', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

function buildPrompt(scenario: string, intensity: number, intensityName: string, userInput: string): string {
  const scenarioDescriptions = {
    '面对甩锅': '对方试图推卸责任或转移问题到你身上',
    '面对指责': '对方在批评或指责你的行为或决定',
    '面对挑衅': '对方故意挑衅或试图激怒你',
    '工作沟通': '职场环境中的专业沟通场景'
  }

  const intensityDescriptions = {
    1: '非常温和友善，以理解和包容为主',
    2: '友善但坚持立场，保持礼貌',
    3: '平和中性，就事论事',
    4: '坚定有力，明确表达立场',
    5: '直接明确，不回避问题',
    6: '犀利尖锐，直击要害',
    7: '强硬态度，不容妥协',
    8: '激烈回应，强势反击',
    9: '毒舌反击，言辞犀利',
    10: '核弹级回击，毫不留情'
  }

  return `你是一个专业的沟通助手，擅长在各种对话场景中生成合适的回复。

场景：${scenario} - ${scenarioDescriptions[scenario as keyof typeof scenarioDescriptions] || '一般沟通场景'}
语气强度：${intensity}/10 (${intensityName}) - ${intensityDescriptions[intensity as keyof typeof intensityDescriptions] || '适中强度'}

对方说："${userInput}"

请根据以上场景和语气强度要求，生成3条不同风格但都符合要求的回复。要求：

1. 回复要符合${intensityName}的语气强度，既不能过弱也不能过强
2. 针对"${scenario}"场景，回复要有针对性和实用性
3. 每条回复都要有不同的角度和策略
4. 语言要自然流畅，符合中文表达习惯
5. 回复长度适中，不要过长或过短

请按以下格式返回，每条回复占一行：

回复1：[具体回复内容]
回复2：[具体回复内容]
回复3：[具体回复内容]`
}

function parseReplies(aiResponse: string): string[] {
  // 解析AI返回的回复
  const lines = aiResponse.split('\n').filter(line => line.trim())
  const replies: string[] = []

  for (const line of lines) {
    // 匹配 "回复X：" 格式
    const match = line.match(/^回复[0-9]+[：:]\s*(.+)$/)
    if (match?.[1]) {
      replies.push(match[1].trim())
    }
    // 如果没有匹配到格式，但是是有内容的行，也加入
    else if (line.trim() && !line.includes('回复') && replies.length < 3) {
      replies.push(line.trim())
    }
  }

  // 如果解析失败，尝试其他方式
  if (replies.length === 0) {
    // 按换行符分割，取前3个非空行
    const fallbackReplies = aiResponse
      .split('\n')
      .filter(line => line.trim() && !line.includes('根据') && !line.includes('场景'))
      .slice(0, 3)

    if (fallbackReplies.length > 0) {
      return fallbackReplies
    }

    // 最后的备选方案
    return [aiResponse.trim()]
  }

  // 确保有3条回复
  while (replies.length < 3 && replies.length > 0) {
    replies.push(replies[0]) // 复制第一条作为备用
  }

  return replies.slice(0, 3)
}