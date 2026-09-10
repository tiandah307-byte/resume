# 黄天达 · 个人简历与作品集站点

> 设计语言复刻自原站 `huangtianda-resume.pages.dev`（暗紫黑底 + 靛蓝光晕 + General Sans / Geist / JetBrains Mono），内容全部替换为最新简历。

## 页面

| 文件 | 说明 |
|---|---|
| `index.html` | 主页：Hero / 数据看板 / 个人叙事 / 实习经历（前端 + 后端 RAG）/ 7 个项目 / AI Coding 入口 / 技能 / 荣誉与校园 / 联系 |
| `ai-coding.html` | AI Coding 工作流与评测实践：四个支柱、质控面板 0→1 案例（含脱敏截图）、Coding Agent 评测指标体系 |
| `styles.css` | 全部样式（设计 token、光晕卡片、网格与噪点纹理、时间线、项目卡、响应式） |
| `main.js` | 移动端导航、滚动出现动画、光晕卡片光标跟随、导航高亮与锚点偏移 |

## 资源

- `avatar.webp` — 头像
- `drama/1–5.webp` — 校园经历图片
- `pics/*.webp` — 项目截图（医疗影像标注、皮肤病变、门诊数据、标注规范）
- `shots/dashboard-1440.png`、`shots/todo-groups.png` — AI Coding 页的**已脱敏**产品截图（患者姓名打码、内部运营指标以 `—` 占位）
- Hero 背景视频走原站 CDN 外链（13 MB，未入库）；如需自托管，下载后改 `index.html` 里 `.hero-video` 的 `src`

## 本地预览

```bash
# 任意静态服务器即可，例如：
npx serve .
# 或
python -m http.server 8080
```

然后打开 http://localhost:8080/

## 部署

**Cloudflare Pages（与原站一致）**
1. 连接 GitHub 仓库 `tiandah/resume`
2. Build command 留空，Build output directory 填 `/`
3. 部署后绑定自定义域名（或继续用 `*.pages.dev` 子域）

**GitHub Pages**
1. Settings → Pages → Source 选择 `Deploy from a branch`，分支 `main`，目录 `/ (root)`
2. 访问 `https://tiandah.github.io/resume/`
3. 仓库内已包含 `.nojekyll`（避免下划线目录被忽略）

## 更新简历

内容都是纯 HTML，直接编辑 `index.html` / `ai-coding.html` 中对应区块即可；样式统一在 `styles.css` 的 `:root` 变量里，改配色只需改 CSS 变量。