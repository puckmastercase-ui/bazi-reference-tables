#!/bin/bash
set -e
cd /d/project/bazi-reference-data || exit 1

# 临时脚本不公开
rm -f hermes-publish.sh

git add -A
git -c user.name="yilibazi" -c user.email="dev@yilibazi.com" commit -q --amend --no-edit
echo "  commit: $(git rev-parse --short HEAD)"

echo
echo "=== 推送前最终确认 ==="
TOP=$(git rev-parse --show-toplevel)
echo "  toplevel: $TOP"
[ "$TOP" = "D:/project/bazi-reference-data" ] || { echo "  ✗✗ 隔离失败，中止"; exit 1; }
echo "  文件数: $(git ls-files | wc -l)"
echo "  含敏感词: $(git ls-files | head -50 | xargs grep -lniE 'secret|whsec|api_key|\.env' 2>/dev/null | wc -l) 个"
echo
read -r -p "" 2>/dev/null || true
