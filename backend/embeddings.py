from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEmbeddings
from typing import List

# 1. FastAPI 앱 설정
app = FastAPI(title="LangChain Embedding Service")

# 2. 임베딩 모델 로드 (서버 시작 시 메모리에 로드)
# 모델 경로를 지정하거나 Hugging Face Hub의 모델명을 입력합니다.
model_name = "dmis-lab/biobert-v1.1"
model_kwargs = {'device': 'cpu'}  # GPU가 있다면 'cuda'로 변경
encode_kwargs = {'normalize_embeddings': True}

embeddings_model = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

# 3. 데이터 모델 정의
class TextRequest(BaseModel):
    text: str

class BatchTextRequest(BaseModel):
    texts: List[str]

# 4. API 엔드포인트 구현
@app.get("/")
def read_root():
    return {"message": "Hugging Face Embedding Service is running!"}

@app.post("/embed")
async def embed_text(request: TextRequest):
    try:
        # 단일 텍스트 임베딩
        vector = embeddings_model.embed_query(request.text)
        return {"embedding": vector}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed/batch")
async def embed_batch(request: BatchTextRequest):
    try:
        # 리스트 형태의 텍스트 일괄 임베딩
        vectors = embeddings_model.embed_documents(request.texts)
        return {"embeddings": vectors}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 서버 실행 (스크립트로 실행 시)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)