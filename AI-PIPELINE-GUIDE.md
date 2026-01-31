# 🤖 Local AI Pipeline Guide

VibeWrite.ai uses **local AI models** instead of external APIs. Here's everything you need to know!

## 🎯 Why Local Pipelines?

### ✅ **Advantages:**
1. **Zero API Costs** - No monthly API bills!
2. **No Rate Limits** - Generate unlimited rewrites
3. **Privacy** - Data never leaves your server
4. **Faster** - No network latency to external APIs
5. **Offline** - Works without internet (after initial download)
6. **Predictable** - No API downtime or quota issues

### ⚠️ **Trade-offs:**
1. **First Load** - Takes 1-2 minutes to download model (~80MB)
2. **Memory** - Uses ~300MB RAM while running
3. **Quality** - Smaller models = less sophisticated than GPT-4
4. **CPU Usage** - Uses server CPU (no GPU required)

## 📦 How It Works

### **Technology Stack:**
- **@xenova/transformers** - JavaScript port of Hugging Face Transformers
- Runs models directly in Node.js
- Uses ONNX Runtime for inference
- Models cached locally after first download

### **Model Pipeline:**
```
User Input → Vibe-Specific Prompt → Local Model → Generated Text → Fallback (if needed)
```

### **Current Model:**
- **Name**: `Xenova/distilgpt2`
- **Type**: Causal language model (GPT-2 based)
- **Size**: ~80MB
- **Speed**: ~2-3 seconds per rewrite
- **Quality**: Good for creative text transformation

## 🔧 Switching Models

Edit `backend/ai.js` line 56 to change models:

### **Option 1: DistilGPT2** (Current - Best Balance)
```javascript
textGenerator = await pipeline('text-generation', 'Xenova/distilgpt2');
```
- ✅ Fast and lightweight
- ✅ Good for creative rewrites
- ✅ 80MB download
- ⚠️ Can be random/creative

### **Option 2: GPT-2** (Better Quality)
```javascript
textGenerator = await pipeline('text-generation', 'Xenova/gpt2');
```
- ✅ Better coherence
- ✅ More natural language
- ⚠️ Larger (~500MB)
- ⚠️ Slower inference

### **Option 3: T5-Small** (Best for Rewrites)
```javascript
textGenerator = await pipeline('text2text-generation', 'Xenova/t5-small');
```
- ✅ Designed for text-to-text tasks
- ✅ More controllable output
- ✅ Better instruction following
- ⚠️ Different pipeline type

### **Option 4: FLAN-T5** (Production Recommended)
```javascript
textGenerator = await pipeline('text2text-generation', 'Xenova/flan-t5-small');
```
- ✅ Fine-tuned for instructions
- ✅ Most reliable for rewrites
- ✅ Consistent quality
- ⚠️ ~250MB

## 🚀 Performance Optimization

### **1. Model Caching**
Models are automatically cached in:
```
~/.cache/huggingface/hub/
```

To pre-download before deployment:
```bash
# Run once to cache the model
node -e "const { pipeline } = require('@xenova/transformers'); pipeline('text-generation', 'Xenova/distilgpt2').then(() => console.log('Cached!'))"
```

### **2. Memory Management**
The model loads once on server start and stays in memory:
```javascript
// In ai.js
let textGenerator = null;  // Cached pipeline

// Initialize on module load
initializePipeline();
```

### **3. Concurrent Requests**
The pipeline can handle multiple requests, but they process sequentially. For high traffic:
- Consider adding a request queue
- Or load multiple model instances
- Or use a dedicated ML server

### **4. Production Deployment**
For production with local models:
- Ensure at least 1GB RAM available
- Models work fine on free tier hosting (Render, Railway)
- Pre-cache models in Docker builds

## 🎨 Customizing Prompts

The quality of rewrites depends heavily on prompts. Edit `vibePrompts` in `backend/ai.js`:

```javascript
const vibePrompts = {
    funny: {
        prefix: "Make this funny:" // Short, clear instruction
    },
    // ... customize for each vibe
};
```

### **Prompt Tips:**
1. **Keep it short** - Models work better with concise prompts
2. **Be specific** - "Make this professional" vs "Rewrite professionally"
3. **Test variations** - Different phrasings yield different results
4. **Use examples** - Few-shot prompting can help

## 🛡️ Fallback System

If the model fails or produces poor output, the app uses rule-based fallbacks:

```javascript
function fallbackRewrite(text, vibe) {
    // Simple transformations:
    // - Funny: Add jokes
    // - Hype: Add CAPS and emojis
    // - Savage: Add witty burns
    // - Cute: Add emojis and sweet language
    // - Professional: Formal language
}
```

**Fallback triggers:**
- Model not loaded yet
- Generation takes too long
- Output is too short (<10 chars)
- Output is identical to input
- Any error during generation

## 📊 Monitoring

Check server logs to monitor model performance:
```bash
🤖 Loading AI model... (this may take a minute on first run)
✅ AI model loaded and ready!
⚠️  Model not ready, using fallback rewrite
⚠️  Generated text too short, using fallback
❌ Pipeline generation error: [error details]
```

## 🔮 Future Enhancements

### **1. GPU Acceleration**
If you have a GPU server:
```bash
npm install @tensorflow/tfjs-node-gpu
```
Then use TensorFlow.js models for faster inference.

### **2. Model Fine-tuning**
Train your own model on vibe-specific data:
- Collect examples of each vibe
- Fine-tune distilgpt2 on your data
- Export to ONNX format
- Use in transformers.js

### **3. Ensemble Models**
Use different models for different vibes:
```javascript
const models = {
    funny: await pipeline('text-generation', 'Xenova/distilgpt2'),
    professional: await pipeline('text2text-generation', 'Xenova/t5-small')
};
```

### **4. Streaming Responses**
For real-time generation:
```javascript
// Use token streaming for progressive output
for await (const token of generator.stream(prompt)) {
    // Send token to frontend
}
```

## 🆘 Troubleshooting

### **Model won't download:**
```bash
# Check cache directory permissions
ls -la ~/.cache/huggingface/

# Clear cache and retry
rm -rf ~/.cache/huggingface/
```

### **Out of memory:**
- Switch to smaller model (distilgpt2)
- Reduce max_new_tokens parameter
- Restart server to clear memory

### **Slow generation:**
- Normal on first request (model loading)
- Reduce max_new_tokens (150 → 100)
- Use lighter model
- Check CPU usage

### **Poor quality output:**
- Try different model (T5 or FLAN-T5)
- Adjust temperature (higher = more creative)
- Refine prompts
- Use fallback system

## 📚 Resources

- **Transformers.js Docs**: https://huggingface.co/docs/transformers.js
- **Model Hub**: https://huggingface.co/models?library=transformers.js
- **ONNX Models**: https://huggingface.co/Xenova

## 🎯 Quick Commands

```bash
# Test model loading
node -e "require('./backend/ai.js')"

# Clear model cache
rm -rf ~/.cache/huggingface/

# Monitor memory usage
top -p $(pgrep -f "node server.js")

# Check model size
du -sh ~/.cache/huggingface/
```

---

**Remember**: Local AI is powerful but different from cloud APIs. Test thoroughly and use the fallback system for reliability! 🚀
