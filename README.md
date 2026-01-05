# for-hrd

src/
├─ css/
├─ base.css // reset + body + root variables
├─ layout.css // page layout, containers
├─ header.css // header + logo + header controls
├─ scales.css // scale-row, chart, ticks, input, actions
├─ markers.css // marker-\* (overlay layer)
├─ buttons.css // button styles (global)
├─ responsive.css // ВСЕ media queries
└─ styles.css // entry point (imports)

src/
    js/
    ├─ main.js                      ← entry point (підключається в HTML)
    ├─ constants/
    │   └─ labels.js                ← статичні назви шкал
    ├─ utils/
    │   └─ clamp.js                 ← допоміжні чисті функції
    ├─ header/
    │   ├─ createHeaderControls.js  ← створення DOM елементів хедера
    │   └─ controls.js              ← логіка керування хедером
    ├─ scales/
    │   ├─ createScaleRow.js        ← логіка однієї шкали (DOM + поведінка)
    │   └─ initScales.js            ← ініціалізація всіх шкал
    └─ modal/
        └─ modal.js                 ← (заготовка) модальне вікно / overlay
