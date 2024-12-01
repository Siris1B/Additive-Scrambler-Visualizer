import React from "react";

const ScramblerDescrambler = ({
  scheme,
  registerStatus,
  inputtedText,
  firstScremble,
  SecondScremble,
  ResultScremble,
  Result,
  index,
}) => {
  const length = scheme.length;
  const squareSize = 40;
  const startX = 180; // Початкова точка для скремблера
  const startY = 100; // Початкова точка для першого квадрату
  const gap = 40; // Відстань між квадратами
  const indices = Array.from(scheme)
    .map((value, index) => (value === "1" ? index : -1))
    .filter((index) => index !== -1);
  // Розміщення кругів по центру
  const centerY = startY + (length / 2) * gap;
  const textPositionY = startY + length * gap + 60; // Позиція під останнім квадратом
  const svgHeight = startY + length * gap + 100; // Загальна висота SVG з урахуванням контенту
  return (
    <svg
      style={{ border: "1px solid black", padding: "8px" }}
      width="100%"
      height="100%"
      viewBox={`0 0 600 ${svgHeight}`}
    >
      <text x="0" y={svgHeight - 4} fontSize="24" fontWeight="bold">
        {"Ітерація " + index}
      </text>
      {/* Верхні кола та стрілки */}
      <circle cx="105" cy="25" r="20" fill="white" stroke="black" />
      <text x="97" y="32" fontSize="24" fontWeight="bold">
        +
      </text>
      <circle cx="500" cy="25" r="20" fill="white" stroke="black" />
      <text x="492" y="32" fontSize="24" fontWeight="bold">
        +
      </text>
      {/* Стрілки до верхніх кіл */}
      <line
        x1="5"
        y1="25"
        x2="75"
        y2="25"
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />
      <line
        x1="125"
        y1="25"
        x2="250"
        y2="25"
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />
      <line
        x1="220"
        y1="25"
        x2="330"
        y2="25"
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrow)"
        strokeDasharray="5,5"
      />
      <line
        x1="330"
        y1="25"
        x2="470"
        y2="25"
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />
      <line
        x1="520"
        y1="25"
        x2="590"
        y2="25"
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />

      {/* Коло для скремблера */}
      <circle cx="105" cy={centerY} r="20" fill="white" stroke="black" />
      <text x="96" y={centerY + 7} fontSize="24" fontWeight="bold">
        +
      </text>

      {/* Коло для дескремблера */}
      <circle cx="500" cy={centerY} r="20" fill="white" stroke="black" />
      <text x="492" y={centerY + 7} fontSize="24" fontWeight="bold">
        +
      </text>

      {/* Стрілки від середніх кіл до верхніх кіл */}
      <line
        x1="105"
        y1={centerY - 20}
        x2="105"
        y2="55"
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />
      <line x1="105" y1="70" x2="200" y2="70" stroke="black" strokeWidth="2" />
      <line
        x1="200"
        y1="70"
        x2="200"
        y2="90"
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />
      <line
        x1="500"
        y1={centerY - 20}
        x2="500"
        y2="55"
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />
      <line x1="400" y1="70" x2="500" y2="70" stroke="black" strokeWidth="2" />
      <line
        x1="400"
        y1="70"
        x2="400"
        y2="90"
        stroke="black"
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />

      {/* Генерація квадратів для скремблера */}
      {scheme.split("").map((_, index) => {
        const bit = registerStatus[index];
        return (
          <React.Fragment key={index}>
            <rect
              x={startX}
              y={startY + index * gap}
              width={squareSize}
              height={squareSize}
              fill="white"
              stroke="black"
            />
            <text x={startX + 15} y={startY + index * gap + 25} fontSize="18">
              {bit}
            </text>

            {/* Стрілки тільки для "1", від краю квадрата до кола */}
            {indices.includes(index) && (
              <line
                x1={startX}
                y1={startY + index * gap + squareSize / 2}
                x2="125"
                y2={centerY}
                stroke="black"
                strokeWidth="2"
              />
            )}
          </React.Fragment>
        );
      })}

      {/* Генерація квадратів для дескремблера */}
      {scheme.split("").map((_, index) => {
        const bit = registerStatus[index];

        return (
          <React.Fragment key={index}>
            <rect
              x={startX + 200} // Відстань між скремблером і дескремблером
              y={startY + index * gap}
              width={squareSize}
              height={squareSize}
              fill="white"
              stroke="black"
            />
            <text x={startX + 215} y={startY + index * gap + 25} fontSize="18">
              {bit}
            </text>

            {/* Стрілки тільки для "1", від краю квадрата до кола */}
            {indices.includes(index) && (
              <line
                x1={startX + 200 + squareSize}
                y1={startY + index * gap + squareSize / 2}
                x2="480"
                y2={centerY}
                stroke="black"
                strokeWidth="2"
              />
            )}
          </React.Fragment>
        );
      })}

      {/* Текст "Скремблер" і "Дескремблер" */}
      <text x="160" y={textPositionY} fontSize="18">
        Скремблер
      </text>
      <text x="360" y={textPositionY} fontSize="18">
        Дескремблер
      </text>
      {/* текст */}
      <text x="10" y="13" fontSize="14">
        {inputtedText}
      </text>
      <text x="250" y="13" fontSize="14">
        {ResultScremble}
      </text>
      <text x="520" y="13" fontSize="14">
        {Result}
      </text>

      <text x="485" y="88" fontSize="16" fontWeight="bold">
        {SecondScremble}
      </text>
      <text x="110" y="88" fontSize="16" fontWeight="bold">
        {firstScremble}
      </text>

      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L0,10 L10,5 z" fill="black" />
        </marker>
      </defs>
    </svg>
  );
};

export default ScramblerDescrambler;
