'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'

// 对话场景配置
const scenarios = [
  {
    id: 'blame',
    name: '面对甩锅',
    description: '应对推卸责任和转移问题',
    color: 'bg-gradient-to-br from-red-100 to-pink-100 text-red-700 border-red-200 hover:shadow-lg',
    icon: 'https://ext.same-assets.com/3513338043/2563901416.svg'
  },
  {
    id: 'criticism',
    name: '面对指责',
    description: '回应不公正的批评质疑',
    color: 'bg-gradient-to-br from-orange-100 to-yellow-100 text-orange-700 border-orange-200 hover:shadow-lg',
    icon: 'https://ext.same-assets.com/3513338043/548389142.svg'
  },
  {
    id: 'provocation',
    name: '面对挑衅',
    description: '智慧应对故意挑衅行为',
    color: 'bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-700 border-yellow-200 hover:shadow-lg',
    icon: 'https://ext.same-assets.com/3513338043/260646423.svg'
  },
  {
    id: 'work',
    name: '工作沟通',
    description: '职场专业沟通和协作',
    color: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:shadow-xl',
    icon: 'https://ext.same-assets.com/3513338043/4061061103.svg'
  }
]

// 语气强度配置
const intensityLevels = [
  { level: 1, emoji: '😊', name: '温和', description: '温和友善', color: 'from-green-400 to-blue-400' },
  { level: 2, emoji: '🙂', name: '友善', description: '友善亲切', color: 'from-green-400 to-teal-400' },
  { level: 3, emoji: '😐', name: '平和', description: '平和中性', color: 'from-blue-400 to-cyan-400' },
  { level: 4, emoji: '😤', name: '坚定', description: '坚定有力', color: 'from-cyan-400 to-blue-500' },
  { level: 5, emoji: '😠', name: '直接', description: '直接明确', color: 'from-blue-500 to-purple-500' },
  { level: 6, emoji: '😡', name: '犀利', description: '犀利尖锐', color: 'from-purple-500 to-pink-500' },
  { level: 7, emoji: '🤬', name: '强硬', description: '强硬态度', color: 'from-pink-500 to-red-500' },
  { level: 8, emoji: '😤', name: '激烈', description: '激烈回应', color: 'from-red-500 to-orange-500' },
  { level: 9, emoji: '😏', name: '毒舌', description: '毒舌反击', color: 'from-orange-500 to-red-600' },
  { level: 10, emoji: '💥', name: '核弹', description: '核弹级回击', color: 'from-red-600 to-red-700' }
]

interface Reply {
  id: string
  content: string
  timestamp: number
  likes: number
}

// 复制成功提示组件
function CopyTooltip({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap animate-fade-in-up">
      ✅ 复制成功！
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-500"></div>
    </div>
  )
}

// 点赞动画组件
function LikeAnimation({ show, count }: { show: boolean; count: number }) {
  if (!show) return null

  return (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce-up">
        +{count} ❤️
      </div>
    </div>
  )
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState('work')
  const [intensity, setIntensity] = useState([3])
  const [userInput, setUserInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [replies, setReplies] = useState<Reply[]>([])
  const [likeAnimations, setLikeAnimations] = useState<{[key: string]: { show: boolean; count: number }}>({})
  const [copyTooltips, setCopyTooltips] = useState<{[key: string]: boolean}>({})

  // 用于滚动到结果的引用
  const repliesRef = useRef<HTMLDivElement>(null)

  // 客户端挂载后加载设置
  useEffect(() => {
    const savedScenario = localStorage.getItem('selectedScenario')
    const savedIntensity = localStorage.getItem('intensity')
    if (savedScenario) setSelectedScenario(savedScenario)
    if (savedIntensity) setIntensity([parseInt(savedIntensity)])
    setMounted(true)
  }, [])

  // 保存设置到 localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('selectedScenario', selectedScenario)
      localStorage.setItem('intensity', intensity[0].toString())
    }
  }, [selectedScenario, intensity, mounted])

  const currentIntensity = intensityLevels.find(level => level.level === intensity[0]) || intensityLevels[2]
  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario) || scenarios[3]

  // 复制功能
  const copyToClipboard = async (text: string, replyId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // 显示复制提示
      setCopyTooltips(prev => ({ ...prev, [replyId]: true }))
      // 2秒后隐藏提示
      setTimeout(() => {
        setCopyTooltips(prev => ({ ...prev, [replyId]: false }))
      }, 2000)
    } catch (err) {
      // 兼容旧浏览器
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      // 显示复制提示
      setCopyTooltips(prev => ({ ...prev, [replyId]: true }))
      // 2秒后隐藏提示
      setTimeout(() => {
        setCopyTooltips(prev => ({ ...prev, [replyId]: false }))
      }, 2000)
    }
  }

  // 点赞功能
  const handleLike = (replyId: string) => {
    setReplies(prevReplies =>
      prevReplies.map(reply =>
        reply.id === replyId
          ? { ...reply, likes: reply.likes + 1 }
          : reply
      )
    )

    // 显示点赞动画
    const currentLikes = replies.find(r => r.id === replyId)?.likes || 0
    setLikeAnimations(prev => ({
      ...prev,
      [replyId]: { show: true, count: currentLikes + 1 }
    }))

    // 3秒后隐藏动画
    setTimeout(() => {
      setLikeAnimations(prev => ({
        ...prev,
        [replyId]: { show: false, count: 0 }
      }))
    }, 3000)
  }

  const generateReplies = async () => {
    if (!userInput.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: selectedScenarioData.name,
          intensity: intensity[0],
          userInput: userInput.trim(),
          intensityName: currentIntensity.name
        }),
      })

      if (!response.ok) {
        throw new Error('生成回复失败')
      }

      const data = await response.json()

      const newReplies = data.replies.map((content: string, index: number) => ({
        id: `${Date.now()}-${index}`,
        content,
        timestamp: Date.now(),
        likes: 0
      }))

      setReplies(newReplies)

      // 保存到 localStorage
      if (mounted) {
        const history = JSON.parse(localStorage.getItem('replyHistory') || '[]')
        history.unshift({
          scenario: selectedScenarioData.name,
          intensity: intensity[0],
          userInput,
          replies: newReplies,
          timestamp: Date.now()
        })
        localStorage.setItem('replyHistory', JSON.stringify(history.slice(0, 50)))
      }

      // 生成完成后自动滚动到结果区域
      setTimeout(() => {
        repliesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)

    } catch (error) {
      console.error('生成回复失败:', error)
      alert('生成回复失败，请稍后重试')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* 美观背景 */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* 标题部分 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="https://ext.same-assets.com/3513338043/3783633550.svg"
              alt=""
              width="48"
              height="48"
              className="drop-shadow-lg"
            />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              沟通助手
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            AI助你在任何对话中都能优雅回应，用智慧和逻辑提升沟通效果
          </p>
        </div>

        {/* 场景选择 */}
        <Card className="mb-8 backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">🎯 选择对话场景</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`group p-6 flex flex-col items-center gap-3 transition-all duration-300 border-2 rounded-xl hover:scale-105 transform ${
                    selectedScenario === scenario.id
                      ? `${scenario.color} shadow-xl scale-105`
                      : 'bg-white hover:bg-gray-50 border-gray-200 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <img
                    src={scenario.icon}
                    alt=""
                    width="28"
                    height="28"
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="text-center">
                    <div className="font-bold text-base">{scenario.name}</div>
                    <div className="text-sm opacity-80 mt-1">{scenario.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* 语气强度调节 */}
        <Card className="mb-8 backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
          <div className="p-8">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-800">⚡ 调节回复语气强度</h3>

              {/* 当前强度显示 */}
              <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                <div className="text-6xl mb-4">{currentIntensity.emoji}</div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${currentIntensity.color} bg-clip-text text-transparent`}>
                  {currentIntensity.name}
                </div>
                <div className="text-gray-600 mt-2 text-lg">{currentIntensity.description}</div>
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-lg font-bold mt-4 shadow-lg">
                  档位 {intensity[0]}/10
                </div>
              </div>

              {/* 滑块 */}
              <div className="px-6">
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full mb-6"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  {[
                    { emoji: '😊', name: '温和' },
                    { emoji: '😐', name: '平和' },
                    { emoji: '😠', name: '直接' },
                    { emoji: '😡', name: '犀利' },
                    { emoji: '💥', name: '核弹' }
                  ].map((item, index) => (
                    <span key={index} className="flex flex-col items-center">
                      <span className="text-2xl mb-1">{item.emoji}</span>
                      <span className="font-medium">{item.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 强度选择器 */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl">
                <div className="grid grid-cols-5 md:grid-cols-10 gap-3 text-sm">
                  {intensityLevels.map((level) => (
                    <div
                      key={level.level}
                      onClick={() => setIntensity([level.level])}
                      className={`text-center p-3 rounded-xl transition-all duration-300 cursor-pointer hover:scale-105 ${
                        intensity[0] === level.level
                          ? `bg-gradient-to-r ${level.color} text-white shadow-lg scale-105`
                          : 'bg-white hover:bg-gray-100 shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className="text-xl mb-1">{level.emoji}</div>
                      <div className="font-bold">{level.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 输入区域 */}
        <Card className="mb-8 backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
          <div className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src="https://ext.same-assets.com/3513338043/2320907649.svg"
                  alt=""
                  width="28"
                  height="28"
                  className="drop-shadow-lg"
                />
                <label className="text-2xl font-bold text-gray-700">💬 对方说了什么？</label>
              </div>
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="min-h-[160px] text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none rounded-xl shadow-inner bg-gradient-to-br from-white to-gray-50"
                placeholder="输入对方的话，AI将为你生成智能回复..."
              />
              <div className="flex gap-4">
                <Button
                  onClick={generateReplies}
                  disabled={!userInput.trim() || isGenerating}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      生成中...
                    </span>
                  ) : (
                    `✨ 生成${currentIntensity.name}回复`
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setUserInput('')}
                  className="py-4 px-6 rounded-xl border-2 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  🗑️
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* 生成的回复 */}
        {replies.length > 0 && (
          <Card ref={repliesRef} className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                🤖 AI智能回复
                <span className="ml-auto text-lg bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-1 rounded-full">
                  {replies.length} 条回复
                </span>
              </h3>
              <div className="space-y-6">
                {replies.map((reply, index) => (
                  <div
                    key={reply.id}
                    className="group p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl border-2 border-blue-100 hover:border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${currentIntensity.color} text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 leading-relaxed text-lg mb-4">{reply.content}</p>
                        <div className="flex gap-3">
                          <div className="relative">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(reply.content, reply.id)}
                              className="hover:bg-blue-50 border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                              📋 复制
                            </Button>
                            <CopyTooltip show={copyTooltips[reply.id] || false} />
                          </div>
                          <div className="relative">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLike(reply.id)}
                              className="hover:bg-red-50 border-red-200 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                              👍 点赞 {reply.likes > 0 && <span className="ml-1 text-red-500 font-bold">({reply.likes})</span>}
                            </Button>
                            <LikeAnimation
                              show={likeAnimations[reply.id]?.show || false}
                              count={likeAnimations[reply.id]?.count || 0}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}