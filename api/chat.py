from http.server import BaseHTTPRequestHandler
import json
import os

# AI 体育教练系统提示词
SYSTEM_PROMPT = """你是《体考智训》AI 体育教练，专门为初中生提供体育学习和训练指导。

## 你的职责
- 回答体育项目动作要领
- 解释常见错误动作和纠正方法
- 提供日常训练方法建议
- 指导热身和拉伸放松
- 帮助提高速度、耐力、力量和爆发力
- 推荐在家可以完成的体育训练
- 指导如何合理安排训练时间

## 回答要求
1. 使用适合初中生理解的语言，简单易懂
2. 先回答核心问题，再展开说明
3. 每次推荐 2-4 个具体方法
4. 给出次数、组数和休息时间
5. 使用积极、鼓励性的语气
6. 不进行疾病诊断
7. 不提供减肥药物、补剂或极端节食建议

## 安全提醒
遇到疼痛、受伤、胸闷、头晕等问题时，必须建议学生：
- 立即停止训练
- 及时休息
- 告知家长
- 必要时向医生或专业人员咨询

## 重要声明
你提供的是一般性体育学习建议，不能代替医生或专业教练的诊断和指导。"""

# 预定义的体育知识回答（用于无 API Key 时的兜底）
FALLBACK_RESPONSES = {
    "热身": "训练前热身非常重要！建议你做以下热身动作：\n\n1. **慢跑 3-5 分钟**：让身体微微出汗\n2. **关节活动**：转动脚踝、膝盖、髋关节、肩膀、手腕，每个方向 10 次\n3. **动态拉伸**：高抬腿 20 次、开合跳 15 次、弓步走 10 步\n\n热身时间大约 5-10 分钟，感觉身体微微发热就可以开始正式训练了！加油！💪",
    
    "拉伸": "训练后的拉伸放松很重要！建议你做以下拉伸：\n\n1. **大腿前侧拉伸**：单腿站立，另一只手抓住脚踝往后拉，保持 20 秒，换腿\n2. **小腿拉伸**：面对墙，一脚在前一脚在后，后腿伸直，身体前倾，保持 20 秒\n3. **背部拉伸**：坐在地上，双腿伸直，身体前倾摸脚尖，保持 20 秒\n4. **肩部拉伸**：一只手横过胸前，另一只手辅助往身体拉，保持 15 秒\n\n每个动作做 2 组，拉伸时感觉轻微拉扯感即可，不要用力过猛！🧘",
    
    "50米": "提高 50 米跑成绩的关键是爆发力和起跑技术！\n\n**训练建议：**\n1. **起跑练习**：练习蹲踞式起跑，听到信号后快速蹬地，每组 5 次，做 3 组\n2. **高抬腿跑**：原地快速高抬腿，每组 20 次，做 3 组，组间休息 30 秒\n3. **短距离冲刺**：30 米全力冲刺，每组 3 次，组间休息 2 分钟\n4. **力量训练**：深蹲跳 15 次×3 组，增强腿部爆发力\n\n每周练习 2-3 次，坚持 4 周会有明显进步！记住起跑要快，途中跑要保持高频率！🏃",
    
    "跳远": "提高立定跳远成绩需要爆发力和协调性！\n\n**训练建议：**\n1. **预摆练习**：练习手臂预摆和腿部蹬地的协调，每组 10 次，做 3 组\n2. **蛙跳**：连续蛙跳 10 米×3 组，增强腿部力量\n3. **收腹跳**：原地跳起后收腹提膝，每组 10 次，做 3 组\n4. **单腿跳**：单腿连续跳 20 米×3 组（换腿），提高爆发力\n\n**动作要领：**\n- 起跳前预摆 2-3 次\n- 起跳时手臂向前上方摆动\n- 空中收腹提膝\n- 落地时小腿前伸，脚跟着地\n\n每周练习 2-3 次，注意安全，落地要缓冲！",
    
    "跳绳": "提高跳绳成绩需要节奏感和耐力！\n\n**训练建议：**\n1. **基础跳**：匀速跳 1 分钟×5 组，组间休息 30 秒\n2. **快速跳**：最快速度跳 30 秒×5 组，组间休息 1 分钟\n3. **耐力跳**：连续跳 3 分钟×3 组，提高耐力\n4. **双摇跳**：尝试双摇跳（跳一次绳过两次），每组 10 次，做 3 组\n\n**技巧提示：**\n- 手腕发力，不要用手臂\n- 前脚掌着地，膝盖微屈\n- 保持均匀呼吸\n- 绳子长度：踩住绳子中间，手柄到腋下\n\n每天练习 10-15 分钟，坚持 2 周就能看到进步！🪢",
    
    "引体向上": "提高引体向上需要背部和手臂力量！\n\n**训练建议：**\n1. **悬垂练习**：双手握杠悬垂，每次坚持 20-30 秒，做 3 组\n2. **辅助引体**：用弹力带辅助或踩凳子辅助，每组 5-8 次，做 3 组\n3. **离心训练**：跳上去后缓慢下降（3-5 秒），每组 5 次，做 3 组\n4. **划船练习**：俯身划船或水平引体，每组 12 次，做 3 组\n\n**动作要领：**\n- 正手握杠，与肩同宽\n- 拉起时挺胸，下巴过杠\n- 下降时控制速度，不要直接掉下来\n- 核心收紧，身体不要晃动\n\n每周练习 2-3 次，从辅助开始，慢慢减少辅助力量！💪",
    
    "仰卧起坐": "提高仰卧起坐需要核心力量！\n\n**训练建议：**\n1. **标准仰卧起坐**：每组 20 次，做 3 组，组间休息 30 秒\n2. **平板支撑**：每次 30-60 秒，做 3 组，增强核心稳定性\n3. **卷腹**：仰卧，只抬起肩背，每组 15 次，做 3 组\n4. **俄罗斯转体**：坐姿，双脚离地，左右转体，每组 20 次，做 3 组\n\n**动作要领：**\n- 仰卧，双腿弯曲，脚掌着地\n- 双手交叉放胸前或耳侧（不要抱头）\n- 用腹部力量卷起上身\n- 下降时控制速度，不要直接躺下\n\n每天练习 1 组，循序渐进增加次数！注意不要抱头，避免颈部受伤！🏋️",
    
    "长跑": "提高 1000 米/800 米成绩需要耐力和节奏！\n\n**训练建议：**\n1. **慢跑耐力**：匀速跑 15-20 分钟，每周 2 次，建立有氧基础\n2. **间歇跑**：400 米快跑 + 200 米慢走，重复 4-6 组，组间休息 2 分钟\n3. **节奏跑**：用比赛配速跑 600-800 米，每周 1 次\n4. **力量训练**：深蹲、弓步走，增强腿部力量\n\n**跑步技巧：**\n- 起跑不要冲太猛，保持均匀节奏\n- 呼吸节奏：两步一吸、两步一呼\n- 摆臂自然，不要左右晃动\n- 最后 200 米可以加速冲刺\n\n每周练习 3 次，坚持 4 周会有明显进步！注意跑前热身、跑后拉伸！🏃‍♂️",
    
    "实心球": "提高实心球成绩需要全身协调发力！\n\n**训练建议：**\n1. **持球练习**：双手持球于头后，练习发力顺序，每组 10 次，做 3 组\n2. **跪姿投掷**：跪姿投掷实心球，每组 8 次，做 3 组，体会腰腹发力\n3. **力量训练**：俯卧撑 15 次×3 组，增强上肢力量\n4. **核心训练**：平板支撑 30 秒×3 组，增强腰腹力量\n\n**动作要领：**\n- 双手持球于头后上方\n- 蹬地、收腹、挥臂依次发力\n- 出手角度约 40-45 度\n- 出手后身体跟随，不要踩线\n\n每周练习 2 次，注意热身，避免肩部受伤！🎯"
}

def get_fallback_response(message):
    """根据关键词返回预定义回答"""
    message_lower = message.lower()
    
    for keyword, response in FALLBACK_RESPONSES.items():
        if keyword in message_lower:
            return response
    
    # 默认回答
    return """你好！我是《体考智训》AI 体育教练。

我可以帮你解答以下问题：
-  如何提高 50 米跑成绩
- 🦘 立定跳远技巧
- 🎯 实心球投掷方法
- 🪢 跳绳训练建议
- 💪 引体向上/仰卧起坐训练
- 🏃‍️ 1000 米/800 米长跑技巧
-  热身和拉伸方法
-  训练计划安排

请告诉我你想了解哪个方面，我会给你详细的训练建议！

⚠️ 温馨提示：训练时如出现疼痛、头晕等不适，请立即停止并告知家长。"""


class handler(BaseHTTPRequestHandler):
    """Vercel Serverless Function Handler"""
    
    async def do_POST(self):
        """处理 POST 请求"""
        try:
            # 读取请求体
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)
            
            message = data.get('message', '')
            history = data.get('history', [])
            
            # 尝试使用 AI 模型
            api_key = os.environ.get('COZE_WORKLOAD_IDENTITY_API_KEY')
            base_url = os.environ.get('COZE_INTEGRATION_MODEL_BASE_URL')
            
            if api_key and base_url:
                # 有 API Key，使用真实 AI
                try:
                    from coze_coding_dev_sdk import LLMClient
                    from coze_coding_utils.runtime_ctx.context import new_context
                    from langchain_core.messages import SystemMessage, HumanMessage
                    
                    ctx = new_context(method="ai_coach")
                    client = LLMClient(ctx=ctx)
                    
                    # 构建消息
                    messages = [SystemMessage(content=SYSTEM_PROMPT)]
                    for msg in history[-10:]:  # 保留最近 10 条历史
                        if msg.get('role') == 'user':
                            messages.append(HumanMessage(content=msg['content']))
                        elif msg.get('role') == 'assistant':
                            messages.append(AIMessage(content=msg['content']))
                    messages.append(HumanMessage(content=message))
                    
                    # 调用模型
                    response = await client.chat(
                        model="doubao-seed-2-0-lite-260215",
                        messages=messages,
                        temperature=0.7,
                        max_tokens=2000
                    )
                    
                    reply = response.content if hasattr(response, 'content') else str(response)
                    
                except Exception as e:
                    # AI 调用失败，使用兜底回答
                    reply = get_fallback_response(message)
            else:
                # 没有 API Key，使用兜底回答
                reply = get_fallback_response(message)
            
            # 返回响应
            response_data = {
                "reply": reply,
                "success": True
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            error_response = {
                "reply": "抱歉，我遇到了一些问题。请稍后再试，或直接查看下方的训练建议。",
                "success": False,
                "error": str(e)
            }
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))
    
    async def do_GET(self):
        """处理 GET 请求（健康检查）"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "ok", "service": "AI 体育教练"}).encode('utf-8'))
    
    async def do_OPTIONS(self):
        """处理 CORS 预检请求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
