from http.server import BaseHTTPRequestHandler
import json
import os

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

FALLBACK_RESPONSES = {
    "热身": "训练前热身非常重要！建议你做以下热身动作：\n\n1. **慢跑 3-5 分钟**：让身体微微出汗\n2. **关节活动**：转动脚踝、膝盖、髋关节、肩膀、手腕，每个方向 10 次\n3. **动态拉伸**：高抬腿 20 次、开合跳 15 次、弓步走 10 步\n\n热身时间大约 5-10 分钟，感觉身体微微发热就可以开始正式训练了！加油！💪",
    "拉伸": "训练后的拉伸放松很重要！建议你做以下拉伸：\n\n1. **大腿前侧拉伸**：单腿站立，另一只手抓住脚踝往后拉，保持 20 秒，换腿\n2. **小腿拉伸**：面对墙，一脚在前一脚在后，后腿伸直，身体前倾，保持 20 秒\n3. **背部拉伸**：坐在地上，双腿伸直，身体前倾摸脚尖，保持 20 秒\n4. **肩部拉伸**：一只手横过胸前，另一只手辅助往身体拉，保持 15 秒\n\n每个动作做 2 组，拉伸时感觉轻微拉扯感即可，不要用力过猛！",
    "50米": "提高 50 米跑成绩的关键是爆发力和起跑技术！\n\n**训练建议：**\n1. **起跑练习**：练习蹲踞式起跑，听到信号后快速蹬地，每组 5 次，做 3 组\n2. **高抬腿跑**：原地快速高抬腿，每组 20 次，做 3 组，组间休息 30 秒\n3. **短距离冲刺**：30 米全力冲刺，每组 3 次，组间休息 2 分钟\n4. **力量训练**：深蹲跳 15 次×3 组，增强腿部爆发力\n\n每周练习 2-3 次，坚持 4 周会有明显进步！🏃",
    "跳远": "提高立定跳远成绩需要爆发力和协调性！\n\n**训练建议：**\n1. **预摆练习**：练习手臂预摆和腿部蹬地的协调，每组 10 次，做 3 组\n2. **蛙跳**：连续蛙跳 10 米×3 组\n3. **收腹跳**：原地跳起后收腹提膝，每组 10 次，做 3 组\n4. **单腿跳**：单腿连续跳 20 米×3 组\n\n**动作要领：**起跳前预摆 2-3 次，起跳时手臂向前上方摆动，空中收腹提膝，落地时小腿前伸。每周练习 2-3 次！🦘",
    "跳绳": "提高跳绳成绩需要节奏感和耐力！\n\n**训练建议：**\n1. **基础跳**：匀速跳 1 分钟×5 组，组间休息 30 秒\n2. **快速跳**：最快速度跳 30 秒×5 组，组间休息 1 分钟\n3. **耐力跳**：连续跳 3 分钟×3 组\n4. **双摇跳**：尝试双摇跳，每组 10 次，做 3 组\n\n**技巧：**手腕发力，前脚掌着地，保持均匀呼吸。每天练习 10-15 分钟！🪢",
    "引体向上": "提高引体向上需要背部和手臂力量！\n\n**训练建议：**\n1. **悬垂练习**：双手握杠悬垂，每次 20-30 秒，做 3 组\n2. **辅助引体**：用弹力带辅助，每组 5-8 次，做 3 组\n3. **离心训练**：跳上去后缓慢下降（3-5 秒），每组 5 次，做 3 组\n4. **划船练习**：俯身划船，每组 12 次，做 3 组\n\n**动作要领：**正手握杠与肩同宽，拉起时挺胸下巴过杠，下降时控制速度。每周 2-3 次！💪",
    "仰卧起坐": "提高仰卧起坐需要核心力量！\n\n**训练建议：**\n1. **标准仰卧起坐**：每组 20 次，做 3 组\n2. **平板支撑**：每次 30-60 秒，做 3 组\n3. **卷腹**：仰卧只抬起肩背，每组 15 次，做 3 组\n4. **俄罗斯转体**：坐姿左右转体，每组 20 次，做 3 组\n\n**注意：**双手放胸前或耳侧，不要抱头，避免颈部受伤！🏋️",
    "长跑": "提高 1000 米/800 米成绩需要耐力和节奏！\n\n**训练建议：**\n1. **慢跑耐力**：匀速跑 15-20 分钟，每周 2 次\n2. **间歇跑**：400 米快跑 + 200 米慢走，重复 4-6 组\n3. **节奏跑**：用比赛配速跑 600-800 米，每周 1 次\n4. **力量训练**：深蹲、弓步走\n\n**技巧：**起跑不要冲太猛，呼吸两步一吸两步一呼，最后 200 米加速冲刺！🏃‍♂️",
    "实心球": "提高实心球成绩需要全身协调发力！\n\n**训练建议：**\n1. **持球练习**：双手持球于头后，练习发力顺序，每组 10 次，做 3 组\n2. **跪姿投掷**：跪姿投掷实心球，每组 8 次，做 3 组\n3. **力量训练**：俯卧撑 15 次×3 组\n4. **核心训练**：平板支撑 30 秒×3 组\n\n**动作要领：**双手持球于头后上方，蹬地、收腹、挥臂依次发力，出手角度约 40-45 度！🎯"
}

def get_fallback_response(message):
    message_lower = message.lower()
    for keyword, response in FALLBACK_RESPONSES.items():
        if keyword in message_lower:
            return response
    return """你好！我是《体考智训》AI 体育教练。

我可以帮你解答：
-  50 米跑技巧
- 🦘 立定跳远训练
- 🎯 实心球投掷
- 🪢 跳绳方法
-  引体向上/仰卧起坐
- ‍♂️ 1000 米/800 米长跑
- 🧘 热身和拉伸
- 📋 训练计划安排

请告诉我你想了解哪个方面！

⚠️ 训练时如出现疼痛、头晕等不适，请立即停止并告知家长。"""


async def call_ai_model(message, history):
    """调用 AI 模型生成回答"""
    api_key = os.environ.get('COZE_WORKLOAD_IDENTITY_API_KEY')
    base_url = os.environ.get('COZE_INTEGRATION_MODEL_BASE_URL')

    if not api_key or not base_url:
        return get_fallback_response(message)

    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=api_key, base_url=base_url)

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in history[-10:]:
            role = msg.get('role', 'user')
            if role in ('user', 'assistant'):
                messages.append({"role": role, "content": msg['content']})
        messages.append({"role": "user", "content": message})

        response = await client.chat.completions.create(
            model="doubao-seed-2-0-lite-260215",
            messages=messages,
            temperature=0.7,
            max_tokens=2000
        )

        return response.choices[0].message.content

    except Exception:
        return get_fallback_response(message)


class handler(BaseHTTPRequestHandler):

    async def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)

            message = data.get('message', '')
            history = data.get('history', [])

            reply = await call_ai_model(message, history)

            response_data = {"reply": reply, "success": True}
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            error_response = {"reply": get_fallback_response("你好"), "success": False}
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))

    async def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "ok", "service": "AI Coach"}).encode('utf-8'))

    async def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
