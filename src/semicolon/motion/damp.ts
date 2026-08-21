/**
 * 한 박자 늦게 도착하는 값.
 *
 * 색면이 커서를 직접 따라다니면 싸구려 효과가 된다. 사람이 물 표면 아래를
 * 움직이고 색이 뒤늦게 밀려나는 것처럼 보이려면, 목표에 즉시 닿지 않고
 * 매 순간 남은 거리의 일부만 좁혀야 한다.
 *
 * 프레임마다 같은 비율로 좁히면 60Hz와 120Hz에서 속도가 달라진다. 지수
 * 감쇠로 쓰면 화면이 몇 번 그려지든 같은 시간에 같은 자리에 도착한다.
 *
 * @param rate 클수록 빨리 따라붙는다. 이 공간에서 쓰는 값은 전부 한 자리 수다.
 * @param dt   지난 프레임과의 간격(초).
 */
export function damp(current: number, target: number, rate: number, dt: number): number {
  return target + (current - target) * Math.exp(-rate * dt)
}

/** 목표에 사실상 닿았는지. 이보다 가까워지면 움직임을 멈춰도 눈에 띄지 않는다. */
export function settled(current: number, target: number, epsilon = 0.0005): boolean {
  return Math.abs(current - target) < epsilon
}

/** 범위 밖으로 나가지 않게 자른다. */
export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value
}
