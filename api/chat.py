"""
Vercel Serverless Function - AI Coach Chat API
使用 Python 标准库直接调用 DeepSeek API（兼容 OpenAI 格式）
"""

import json
import os
import ssl
import urllib.request
import urllib.error
import logging
from http.server import BaseHTTPRequestHandler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# 环境变量
API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com").rstrip("/")
MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-chat")

# 系统提示词
SYSTEM_PROMPT = """你是《体考智训》AI体育教练，专门帮助初中生解决体育学习和训练问题。

## 回答要求
1. 使用适合初中生理解的语言，简单易懂
2. 先回答核心问题，再补充细节
3. 每次推荐2-4个具体方法，给出次数、组数和休息时间
4. 使用积极、鼓励性的语气，避免打击学生
5. 不进行疾病诊断，不提供减肥药物、补剂或极端节食建议
6. 遇到疼痛、受伤、胸闷、头晕等问题时，建议停止训练并告知家长，必要时及时就医

## 可以回答的问题
- 体育项目动作要领（50米跑、立定跳远、实心球、跳绳、引体向上、仰卧起坐、1000米/800米跑等）
- 常见错误动作及纠正方法
- 日常训练方法
- 热身和拉伸放松方法
- 如何提高速度、耐力、力量、爆发力和协调性
- 在家可以完成的体育训练
- 如何合理安排训练时间

## 安全提醒
在回答训练相关问题时，适当提醒学生：
- 训练前做好热身
- 训练后做好拉伸
- 出现疼痛、头晕或身体不适时立即停止训练
- 训练强度要循序渐进"""


def call_deepseek_api(messages):
    """
    使用 Python 标准库直接调用 DeepSeek API
    返回模型回答文本
    """
    # 检查 API Key
    if not API_KEY:
        logger.info("DEEPSEEK_API_KEY missing")
        raise ValueError("API Key 未配置")

    # 记录安全信息（不输出完整密钥）
    logger.info("API Key exists: %s, length: %d", bool(API_KEY), len(API_KEY))
    logger.info("Base URL: %s", BASE_URL)
    logger.info("Model: %s", MODEL)

    # 构建请求
    url = f"{BASE_URL}/v1/chat/completions"

    payload = {
        "model": MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1000
    }

    data = json.dumps(payload).encode("utf-8")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    # 发送请求（30秒超时）
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")

    # 创建 SSL 上下文（允许 HTTPS）
    ctx = ssl.create_default_context()

    try:
        with urllib.request.urlopen(req, timeout=30, context=ctx) as response:
            status_code = response.status
            logger.info("DeepSeek HTTP status: %d", status_code)

            if status_code != 200:
                error_body = response.read().decode("utf-8", errors="replace")
                logger.info("DeepSeek error response: %s", error_body[:200])
                raise Exception(f"DeepSeek API returned status {status_code}")

            response_body = response.read().decode("utf-8")
            result = json.loads(response_body)

            # 提取回答
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"]
            else:
                logger.info("Unexpected response format: %s", str(result)[:200])
                raise Exception("DeepSeek 返回格式异常")

    except urllib.error.HTTPError as e:
        logger.info("HTTP Error: %d, type: %s", e.code, type(e).__name__)
        error_body = e.read().decode("utf-8", errors="replace")
        logger.info("Error body: %s", error_body[:200])
        raise Exception(f"DeepSeek API HTTP {e.code}")

    except urllib.error.URLError as e:
        logger.info("URL Error: %s, type: %s", str(e), type(e).__name__)
        raise Exception("网络连接失败")

    except Exception as e:
        logger.info("Exception type: %s, message: %s", type(e).__name__, str(e)[:100])
        raise


class handler(BaseHTTPRequestHandler):
    """Vercel Serverless Function handler"""

    def do_OPTIONS(self):
        """处理 CORS 预检请求"""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
        self.end_headers()

    def do_POST(self):
        """处理聊天请求"""
        try:
            # 读取请求体
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"

            try:
                request_data = json.loads(body)
            except json.JSONDecodeError:
                self._send_json(400, {"reply": "请求格式错误，请发送有效的 JSON"})
                return

            user_message = request_data.get("message", "").strip()
            history = request_data.get("history", [])

            if not user_message:
                self._send_json(400, {"reply": "请输入你的问题"})
                return

            # 构建消息列表
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]

            # 添加历史对话（最近 10 轮）
            for msg in history[-10:]:
                if msg.get("role") in ("user", "assistant") and msg.get("content"):
                    messages.append({"role": msg["role"], "content": msg["content"]})

            # 添加当前问题
            messages.append({"role": "user", "content": user_message})

            # 调用 DeepSeek API
            reply = call_deepseek_api(messages)

            self._send_json(200, {"reply": reply})

        except ValueError as e:
            # API Key 未配置
            logger.info("ValueError: %s", str(e))
            self._send_json(500, {
                "reply": "AI 教练服务暂未配置，请联系管理员。你可以先浏览其他功能模块，如动作学习、体质测评等。",
                "error_code": "API_KEY_MISSING"
            })

        except Exception as e:
            error_type = type(e).__name__
            error_msg = str(e)[:100]
            logger.info("Error type: %s, message: %s", error_type, error_msg)
            self._send_json(500, {
                "reply": "AI 教练服务暂时不可用，请稍后再试。你可以先浏览其他功能模块。",
                "error_code": f"API_ERROR_{error_type}"
            })

    def _send_json(self, status_code, data):
        """发送 JSON 响应"""
        response_body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(response_body)))
        self.end_headers()
        self.wfile.write(response_body)

    def log_message(self, format, *args):
        """重写日志方法，使用标准 logging"""
        logger.info("%s - %s", self.client_address[0] if self.client_address else "unknown", format % args)
