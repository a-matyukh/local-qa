import { writeFileSync } from "fs"
import { TextLoader } from "langchain/document_loaders/fs/text"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { HNSWLib } from "langchain/vectorstores/hnswlib"
import { HuggingFaceTransformersEmbeddings } from "langchain/embeddings/hf_transformers"
import { Ollama } from "langchain/llms/ollama"
import { RetrievalQAChain } from "langchain/chains"

export async function set_document_text(getted_text) {
    writeFileSync("getted_text.txt", getted_text)

    // Load
    const loader = new TextLoader("getted_text.txt")
    const docs = await loader.load()
    // Split
    const splitter = new RecursiveCharacterTextSplitter({
        chunkOverlap: 0, chunkSize: 500
    })
    const splitDocuments = await splitter.splitDocuments(docs)
    // Store
    const vectorStore = await HNSWLib.fromDocuments(
        splitDocuments,
        new HuggingFaceTransformersEmbeddings()
    )
    // Chain
    const model = new Ollama({
        baseUrl: "http://localhost:11434",
        model: "openchat"
    })
    return RetrievalQAChain.fromLLM(model, vectorStore.asRetriever())
}