import { useMemo, useState } from "react"

type Tab = "주요분야" | "종사자 규모"

type RoleKey = "경영·기획" | "마케팅·홍보" | "매니지먼트" | "제작·개발" | "디자인" | "그 외 직무"
type PaletteKey = "neon" | "ocean" | "sunset" | "citrus" | "berry" | "mono"

type Item = {
  category: Tab
  label: string
  cases: number
  total: number
  roles: Record<RoleKey, number>
}

const roleKeys: RoleKey[] = [
  "경영·기획",
  "마케팅·홍보",
  "매니지먼트",
  "제작·개발",
  "디자인",
  "그 외 직무",
]

const palettes: {
  key: PaletteKey
  label: string
  description: string
  colors: string[]
}[] = [
  {
    key: "neon",
    label: "네온 믹스",
    description: "생동감 있는 고채도 조합",
    colors: ["#d8ff73", "#6ee7f2", "#ff7eb6", "#a995ff", "#ffb55f", "#7895ad"],
  },
  {
    key: "ocean",
    label: "오션",
    description: "차분한 블루·그린 조합",
    colors: ["#5eead4", "#67e8f9", "#38bdf8", "#818cf8", "#a78bfa", "#64748b"],
  },
  {
    key: "sunset",
    label: "선셋",
    description: "따뜻한 오렌지·핑크 조합",
    colors: ["#ffe66d", "#ffb45c", "#ff7b72", "#f472b6", "#c084fc", "#8f7a72"],
  },
  {
    key: "citrus",
    label: "시트러스",
    description: "상쾌한 옐로·그린 조합",
    colors: ["#f9f871", "#d4f268", "#9be564", "#5dd39e", "#41b3a3", "#52796f"],
  },
  {
    key: "berry",
    label: "베리",
    description: "선명한 레드·바이올렛 조합",
    colors: ["#ff5c8a", "#ff8fab", "#e879f9", "#a78bfa", "#7c83fd", "#6b5b73"],
  },
  {
    key: "mono",
    label: "모노",
    description: "절제된 화이트·그레이 조합",
    colors: ["#f5f7f2", "#d5d9d1", "#aeb5aa", "#858e81", "#60695d", "#3d443a"],
  },
]

const items: Item[] = [
  {
    category: "주요분야",
    label: "영상 제작 및 제작 지원",
    cases: 4154,
    total: 19356,
    roles: {
      경영·기획: 4217,
      마케팅·홍보: 3259,
      매니지먼트: 1039,
      제작·개발: 8014,
      디자인: 2300,
      "그 외 직무": 527,
    },
  },
  {
    category: "주요분야",
    label: "광고·마케팅 및 커머스",
    cases: 6346,
    total: 19520,
    roles: {
      경영·기획: 3439,
      마케팅·홍보: 6826,
      매니지먼트: 379,
      제작·개발: 6822,
      디자인: 1734,
      "그 외 직무": 320,
    },
  },
  {
    category: "주요분야",
    label: "크리에이터 마케팅 에이전시 (MCN 등)",
    cases: 491,
    total: 2701,
    roles: {
      경영·기획: 387,
      마케팅·홍보: 423,
      매니지먼트: 539,
      제작·개발: 942,
      디자인: 275,
      "그 외 직무": 134,
    },
  },
  {
    category: "주요분야",
    label: "온라인 비디오 공유 플랫폼",
    cases: 98,
    total: 2141,
    roles: {
      경영·기획: 203,
      마케팅·홍보: 379,
      매니지먼트: 55,
      제작·개발: 1100,
      디자인: 148,
      "그 외 직무": 257,
    },
  },
  {
    category: "종사자 규모",
    label: "1~4인",
    cases: 9504,
    total: 22181,
    roles: {
      경영·기획: 4306,
      마케팅·홍보: 6007,
      매니지먼트: 268,
      제작·개발: 9500,
      디자인: 2038,
      "그 외 직무": 62,
    },
  },
  {
    category: "종사자 규모",
    label: "5~9인",
    cases: 800,
    total: 4689,
    roles: {
      경영·기획: 637,
      마케팅·홍보: 1331,
      매니지먼트: 137,
      제작·개발: 1803,
      디자인: 747,
      "그 외 직무": 33,
    },
  },
  {
    category: "종사자 규모",
    label: "10~19인",
    cases: 478,
    total: 5996,
    roles: {
      경영·기획: 1293,
      마케팅·홍보: 1265,
      매니지먼트: 335,
      제작·개발: 2364,
      디자인: 582,
      "그 외 직무": 158,
    },
  },
  {
    category: "종사자 규모",
    label: "20인 이상",
    cases: 307,
    total: 10851,
    roles: {
      경영·기획: 2010,
      마케팅·홍보: 2284,
      매니지먼트: 1272,
      제작·개발: 3211,
      디자인: 1089,
      "그 외 직무": 985,
    },
  },
]

const numberFormat = new Intl.NumberFormat("ko-KR")
const percentFormat = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 1,
})

function DonutChart({
  item,
  roles,
}: {
  item: Item
  roles: { key: RoleKey color: string }[]
}) {
  const radius = 82
  const circumference = 2 * Math.PI * radius
  let consumed = 0

  return (
    <div
      className="donut-wrap"
      aria-label={`${item.label} 직무 비중 도넛 차트`}
    >
      <svg className="donut" viewBox="0 0 220 220" role="img">
        <circle className="donut-track" cx="110" cy="110" r={radius} />
        {roles.map((role) => {
          const fraction = item.roles[role.key] / item.total
          const dash = fraction * circumference
          const offset = -consumed * circumference
          consumed += fraction
          return (
            <circle
              key={role.key}
              className="donut-segment"
              cx="110"
              cy="110"
              r={radius}
              stroke={role.color}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
            >
              <title>{`${role.key} ${percentFormat.format(fraction * 100)}%`}</title>
            </circle>
          )
        })}
      </svg>
      <div className="donut-center">
        <span>{numberFormat.format(item.total)}</span>
        <small>명</small>
      </div>
    </div>
  )
}

function App() {
  const [tab, setTab] = useState<Tab>("주요분야")
  const [paletteKey, setPaletteKey] = useState<PaletteKey>("neon")
  const palette =
    palettes.find((item) => item.key === paletteKey) ?? palettes[0]
  const roles = roleKeys.map((key, index) => ({
    key,
    color: palette.colors[index],
  }))
  const visibleItems = useMemo(
    () => items.filter((item) => item.category === tab),
    [tab],
  )
  const [selectedLabel, setSelectedLabel] = useState(items[0].label)
  const selected =
    visibleItems.find((item) => item.label === selectedLabel) ?? visibleItems[0]

  const changeTab = (nextTab: Tab) => {
    setTab(nextTab)
    setSelectedLabel(items.find((item) => item.category === nextTab)!.label)
  }

  return (
    <main>
      <div className="noise" />
      <header className="masthead">
        <div className="brand-mark" aria-hidden="true">
          D
        </div>
        <div>
          <p className="eyebrow">KOREA CREATOR ECONOMY · 2024</p>
          <h1>
            디지털 크리에이터
            <br />
            미디어 산업 인력 지도
          </h1>
        </div>
        <p className="header-note">
          통계청 디지털 크리에이터 미디어 산업조사
          <br />
          직무별 종사자 현황
        </p>
      </header>

      <section className="summary" aria-label="전체 요약">
        <article className="metric primary">
          <p>전체 종사자</p>
          <div>
            <strong>43,717</strong>
            <span>명</span>
          </div>
          <small>산업 전체 6개 직무 합계</small>
        </article>
        <article className="metric">
          <p>전체 사례수</p>
          <div>
            <strong>11,089</strong>
            <span>개</span>
          </div>
          <small>2024년 조사 기준</small>
        </article>
        <div className="summary-index" aria-hidden="true">
          <span>01</span>
          <i />
          <span>OVERVIEW</span>
        </div>
      </section>

      <section className="dashboard">
        <div className="section-head">
          <div>
            <p className="section-kicker">WORKFORCE COMPOSITION</p>
            <h2>항목별 직무 구성</h2>
          </div>
          <div className="tabs" role="tablist" aria-label="분류 선택">
            {(["주요분야", "종사자 규모"] as Tab[]).map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={tab === item}
                className={tab === item ? "active" : ""}
                onClick={() => changeTab(item)}
              >
                {item === "주요분야" ? "주요분야별" : "종사자 규모별"}
              </button>
            ))}
          </div>
        </div>

        <div className="palette-picker">
          <div>
            <p>COLOR VARIATIONS</p>
            <span>차트 팔레트</span>
          </div>
          <div className="palette-options" aria-label="차트 색상 팔레트">
            {palettes.map((option) => (
              <button
                key={option.key}
                type="button"
                className={paletteKey === option.key ? "active" : ""}
                aria-pressed={paletteKey === option.key}
                onClick={() => setPaletteKey(option.key)}
                title={option.description}
              >
                <span className="palette-swatches" aria-hidden="true">
                  {option.colors.map((color) => (
                    <i key={color} style={{ backgroundColor: color }} />
                  ))}
                </span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="content-grid">
          <div className="bars-panel">
            <div className="legend">
              {roles.map((role) => (
                <span key={role.key}>
                  <i style={{ backgroundColor: role.color }} />
                  {role.key}
                </span>
              ))}
            </div>

            <div className="bar-list">
              {visibleItems.map((item, itemIndex) => (
                <button
                  type="button"
                  className={`bar-row ${
                    selected.label === item.label ? "selected" : ""
                  }`}
                  key={item.label}
                  onClick={() => setSelectedLabel(item.label)}
                  aria-label={`${item.label}, 전체 ${numberFormat.format(item.total)}명`}
                >
                  <span className="row-number">0{itemIndex + 1}</span>
                  <span className="bar-main">
                    <span className="bar-label">
                      <b>{item.label}</b>
                      <span>{numberFormat.format(item.total)}명</span>
                    </span>
                    <span className="stack">
                      {roles.map((role) => {
                        const percent =
                          (item.roles[role.key] / item.total) * 100
                        return (
                          <i
                            key={role.key}
                            style={{
                              width: `${percent}%`,
                              backgroundColor: role.color,
                            }}
                            title={`${role.key} ${percentFormat.format(percent)}%`}
                          />
                        )
                      })}
                    </span>
                  </span>
                  <span className="row-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              ))}
            </div>
            <div className="axis" aria-hidden="true">
              <span>0%</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100%</span>
            </div>
          </div>

          <aside className="detail-panel">
            <div className="detail-head">
              <div>
                <p>SELECTED ITEM</p>
                <h3>{selected.label}</h3>
              </div>
              <span>{numberFormat.format(selected.cases)} 사례</span>
            </div>
            <DonutChart item={selected} roles={roles} />
            <div className="role-list">
              {roles.map((role) => (
                <div key={role.key}>
                  <i style={{ backgroundColor: role.color }} />
                  <span>{role.key}</span>
                  <b>{numberFormat.format(selected.roles[role.key])}</b>
                  <small>
                    {percentFormat.format(
                      (selected.roles[role.key] / selected.total) * 100,
                    )}
                    %
                  </small>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <footer>
        <span>DATA SOURCE</span>
        <p>통계청 · 디지털 크리에이터 미디어 산업 직무별 종사자 현황 (2024)</p>
        <span>UNIT · 명 / 개</span>
      </footer>
    </main>
  )
}

export default App
