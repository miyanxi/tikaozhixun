"""
体考智训 - AI 体育教练 API
使用 DeepSeek 大语言模型
"""

import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

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


class ChatHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        """处理 POST 请求"""
        try:
            # 读取请求体
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}

            user_message = data.get("message", "").strip()
            history = data.get("history", [])

            if not user_message:
                self._send_json({"reply": "请输入你的问题～"})
                return

            # 调用 DeepSeek API
            reply = self._call_deepseek(user_message, history)
            self._send_json({"reply": reply})

        except Exception as e:
            print(f"Error: {e}")
            self._send_json({"reply": "抱歉，AI 教练暂时无法回答。请稍后再试，或直接查看其他功能模块的训练建议！"})

    def _call_deepseek(self, user_message, history):
        """调用 DeepSeek API"""
        try:
            from openai import OpenAI

            client = OpenAI(
                api_key=DEEPSEEK_API_KEY,
                base_url=DEEPSEEK_BASE_URL,
            )

            # 构建消息列表
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]

            # 添加历史对话（最近 6 轮）
            for msg in history[-6:]:
                messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})

            # 添加当前问题
            messages.append({"role": "user", "content": user_message})

            # 调用 API
            response = client.chat.completions.create(
                model=DEEPSEEK_MODEL,
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
            )

            reply = response.choices[0].message.content
            return reply

        except Exception as e:
            print(f"DeepSeek API Error: {e}")
            return "抱歉，AI 教练暂时无法回答。请稍后再试，或直接查看其他功能模块的训练建议！"

    def _send_json(self, data):
        """发送 JSON 响应"""
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def do_OPTIONS(self):
        """处理 CORS 预检请求"""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


def handler(request):
    """Vercel Serverless Function 入口"""
    parsed_url = urlparse(request.url)

    if parsed_url.path == "/api/chat" and request.method == "POST":
        content_length = int(request.headers.get("Content-Length", 0))
        body = request.rfile.read(content_length)
        data = json.loads(body) if body else {}

        user_message = data.get("message", "").strip()
        history = data.get("history", [])

        if not user_message:
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                "body": json.dumps({"reply": "请输入你的问题～"}, ensure_ascii=False),
            }

        # 调用 DeepSeek API
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

            reply = response.choices[0].message.content

            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                "body": json.dumps({"reply": reply}, ensure_ascii=False),
            }

        except Exception as e:
            print(f"DeepSeek API Error: {e}")
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                "body": json.dumps({"reply": "抱歉，AI 教练暂时无法回答。请稍后再试，或直接查看其他功能模块的训练建议！"}, ensure_ascii=False),
            }

    return {
        "statusCode": 404,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"error": "Not found"}, ensure_ascii=False),
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    server = HTTPServer(("0.0.0.0", port), ChatHandler)
    print(f"AI Coach API running on port {port}")
    server.serve_forever()
