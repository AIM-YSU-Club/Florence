export const pharmacyInfo = {
  name: '임시TEXT',
  address: '임시TEXT',
};

export const drugs = [
  { id: 1, name: '임시약품1' },
  { id: 2, name: '임시약품2' },
  { id: 3, name: '임시약품3' },
  { id: 4, name: '임시약품4' },
];

const randomBetween = (min, max) =>
  Math.round((Math.random() * (max - min) + min) * 10) / 10;

export function generateClimateData() {
  const labels = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }
  return labels.map((date) => ({
    date,
    temperature: randomBetween(18, 32),
    humidity: randomBetween(40, 85),
    pm25: randomBetween(10, 80),
    uv: randomBetween(1, 11),
  }));
}

export function generateSalesForecast() {
  const labels = [];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }
  return labels.map((date) => ({
    date,
    predicted: Math.round(randomBetween(20, 150)),
  }));
}
