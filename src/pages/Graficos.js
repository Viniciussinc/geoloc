import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";

function createArcPath(cx, cy, r, startAngle, endAngle) {
  const startX = cx + r * Math.cos(startAngle);
  const startY = cy + r * Math.sin(startAngle);
  const endX = cx + r * Math.cos(endAngle);
  const endY = cy + r * Math.sin(endAngle);
  const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
  return `M ${cx} ${cy} L ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
}

export default function Graficos() {
  const data = [10, 10, 25, 18, 17];
  const total = data.reduce((s, v) => s + v, 0);
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = Math.min(cx, cy) - 10;

  let startAngle = -Math.PI / 2; // start at top

  const slices = data.map((value) => {
    const angle = (value / total) * Math.PI * 2;
    const endAngle = startAngle + angle;
    const midAngle = startAngle + angle / 2;
    const path = createArcPath(cx, cy, r, startAngle, endAngle);
    const labelX = cx + (r * 0.6) * Math.cos(midAngle);
    const labelY = cy + (r * 0.6) * Math.sin(midAngle);
    startAngle = endAngle;
    return { value, path, labelX, labelY, midAngle };
  });

  const randomColor = () => {
    return ("#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textContainer}>Gráfico de Pizza</Text>
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Svg width={size} height={size}>
          <G>
            {slices.map((s, i) => (
              <G key={i}>
                <Path d={s.path} fill={randomColor()} stroke="#fff" strokeWidth={1} />
                <SvgText
                  x={s.labelX}
                  y={s.labelY}
                  fill="#fff"
                  fontSize={16}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {s.value}%
                </SvgText>
              </G>
            ))}
          </G>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
  },
  textContainer: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
});
