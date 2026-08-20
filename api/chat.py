"""
体考智训 - AI 体育教练 API
使用 DeepSeek 大语言模型
Vercel Python Serverless Function
"""

import json
import os
import traceback
from http.server import BaseHTTPRequestHandler

# DeepSeek API 配置（从环境变量读取）
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
DEEPSEEK_MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-chat")

# 系统提示词
SYSTEM_PROMPT = """你是《体考智训》AI 体育教练，专门为初中生提供体育学习和训练建议。

## 角色定位
- 专业、友好、鼓励性的体育教练
- 熟悉初中体育中考项目（50 米跑、立定跳远、实心球、跳绳、引体向上、仰卧起坐、1000 米/800 米跑）
- 了解青少年体质健康标准和训练方法

## 回答原则
1. **先回答核心问题**：直接给出关键建议，不要绕弯子
2. **具体可操作**：每次推荐 2-4 个具体方法，包含次数、组数、休息时间
3. **适合初中生**：训练强度适中，不安排危险动作和极端训练
4. **积极鼓励**：使用正面语言，避免"很差""不合格"等打击性表达
5. **安全第一**：提醒热身、拉伸，出现疼痛/头晕/胸闷时立即停止训练并告知家长

## 禁止事项
- 不进行医疗诊断
- 不提供减肥药物、补剂或极端节食建议
- 不保证成绩一定提高
- 不替代医生或专业教练

## 回答格式
- 使用简洁清晰的语言
- 适当使用 emoji 增加亲和力
- 重要信息用粗体标注
- 分点列出训练建议"""


class handler(BaseHTTPRequestHandler):
    """Vercel Python Serverless Function 入口（类名必须为 handler）"""

    def do_POST(self):
        """处理 POST 请求"""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}

            user_message = data.get("message", "").strip()
            history = data.get("history", [])

            if not user_message:
                self._send_json(200, {"reply": "请输入你的问题～"})
                return

            reply = self._call_deepseek(user_message, history)
            self._send_json(200, {"reply": reply})

        except Exception as e:
            error_type = type(e).__name__
            print(f"[chat] Error ({error_type}): {e}")
            self._send_json(200, {"reply": "抱歉，AI 教练暂时无法回答。请稍后再试，或直接查看其他功能模块的训练建议！"})

    def do_OPTIONS(self):
        """处理 CORS 预检请求"""
        self._send_json(200, {})

    def _call_deepseek(self, user_message, history):
        """调用 DeepSeek API"""
        try:
            from openai import OpenAI

            client = OpenAI(
                api_key=DEEPSEEK_API_KEY,
                base_url=DEEPSEEK_BASE_URL,
            )

            messages = [{"role": "system", "content": SYSTEM_PROMPT}]

            for msg in history[-6:]:
                messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})

            messages.append({"role": "user", "content": user_message})

            response = client.chat.completions.create(
                model=DEEPSEEK_MODEL,
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
            )

            return response.choices[0].message.content

        except Exception as e:
            error_type = type(e).__name__
            print(f"[chat] DeepSeek API Error ({error_type}): {e}")
            return "抱歉，AI 教练暂时无法回答。请稍后再试，或直接查看其他功能模块的训练建议！"

    def _send_json(self, status_code, data):
        """发送 JSON 响应"""
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))
