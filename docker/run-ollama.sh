#!/usr/bin/env bash

ollama serve &
ollama list
ollama pull hf.co/SakuraLLM/Sakura-1.5B-Qwen2.5-v1.0-GGUF
