#!/bin/bash

# VersaVisual Brand System - Figma MCP Integration
# Envia variáveis de design diretamente para Figma via MCP

FIGMA_MCP_URL="http://127.0.0.1:3845/mcp"

# 1. Initialize MCP session
echo "🔌 Inicializando sessão MCP com Figma..."
INIT_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"initialize",
    "params":{
      "protocolVersion":"2024-11-05",
      "capabilities":{},
      "clientInfo":{"name":"VersaVisual","version":"1.0"}
    }
  }' \
  "$FIGMA_MCP_URL")

echo "Resposta: $INIT_RESPONSE"

# 2. Send brand colors
echo ""
echo "🎨 Enviando cores da marca..."
COLORS_PAYLOAD='{
  "jsonrpc":"2.0",
  "id":2,
  "method":"tools/call",
  "params":{
    "name":"update_variables",
    "arguments":{
      "collection":"VersaVisual-Colors",
      "variables":{
        "VV/Black":"#0A0A0A",
        "VV/White":"#FFFFFF",
        "VV/Teal-Accent":"#5B9BAF",
        "VV/Light-Text":"#E0E0E0",
        "VV/Section-Label":"#7AABB8"
      }
    }
  }
}'

curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d "$COLORS_PAYLOAD" \
  "$FIGMA_MCP_URL"

# 3. Send typography
echo ""
echo "✍️  Enviando configurações tipográficas..."
TYPO_PAYLOAD='{
  "jsonrpc":"2.0",
  "id":3,
  "method":"tools/call",
  "params":{
    "name":"update_variables",
    "arguments":{
      "collection":"VersaVisual-Typography",
      "variables":{
        "Display/Font-Family":"Bebas Neue, Barlow Condensed, sans-serif",
        "Display/Font-Size-XL":48,
        "Display/Font-Weight":700,
        "Body/Font-Family":"ui-sans-serif, system-ui, sans-serif",
        "Body/Font-Size":16,
        "Body/Font-Weight":400
      }
    }
  }
}'

curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d "$TYPO_PAYLOAD" \
  "$FIGMA_MCP_URL"

# 4. Send spacing
echo ""
echo "📏 Enviando escala de espaçamento..."
SPACING_PAYLOAD='{
  "jsonrpc":"2.0",
  "id":4,
  "method":"tools/call",
  "params":{
    "name":"update_variables",
    "arguments":{
      "collection":"VersaVisual-Spacing",
      "variables":{
        "Space/4":4,
        "Space/8":8,
        "Space/12":12,
        "Space/16":16,
        "Space/24":24,
        "Space/32":32
      }
    }
  }
}'

curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d "$SPACING_PAYLOAD" \
  "$FIGMA_MCP_URL"

echo ""
echo "✅ Variáveis da VersaVisual enviadas para Figma!"
echo "📍 Verifique no Figma: Assets → Variables"
