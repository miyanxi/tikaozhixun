from coze_coding_dev_sdk import LLMClient
from coze_coding_utils.runtime_ctx.context import new_context
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import json

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

def get_text_content(content):
    """安全获取文本内容"""
    if isinstance(content, str):
        return content
    elif isinstance(content, list):
        if content and isinstance(content[0], str):
            return " ".join(content)
        else:
            return " ".join(item.get("text", "") for item in content if isinstance(item, dict) and item.get("type") == "text")
    return str(content)

async def main(request):
    """Vercel Serverless Function 入口"""
    try:
        # 解析请求体
        body = await request.json()
        message = body.get("message", "")
        history = body.get("history", [])
        
        if not message:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "缺少 message 参数"})
            }
        
        # 创建 LLM 客户端
        ctx = new_context(method="invoke")
        client = LLMClient(ctx=ctx)
        
        # 构建消息列表
        messages = [SystemMessage(content=SYSTEM_PROMPT)]
        
        # 添加历史对话
        for msg in history[-10:]:  # 保留最近 10 轮对话
            if msg.get("role") == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg.get("role") == "assistant":
                messages.append(AIMessage(content=msg["content"]))
        
        # 添加当前用户消息
        messages.append(HumanMessage(content=message))
        
        # 调用大模型
        response = client.invoke(
            messages=messages,
            model="doubao-seed-2-0-lite-260215",
            temperature=0.7,
            max_completion_tokens=2000
        )
        
        # 获取回复内容
        reply = get_text_content(response.content)
        
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"reply": reply})
        }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": str(e)})
        }
