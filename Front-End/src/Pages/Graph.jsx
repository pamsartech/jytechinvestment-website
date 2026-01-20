import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,} from "recharts";

/* -------------------- DATA -------------------- */

const costData = [
  { name: "Application Cost", value: 95 },
  { name: "Expenses", value: 3 },
  { name: "Financement", value: 2 },
  { name: "TVA", value: 0.01 }, // tiny value so it still renders
];

const COLORS = ["#062f2a", "#0c5c4d", "#00a884", "#4fe3c1"];

const marginData = [
  {
    name: "VATON Margin",
    value: -189000,
    color: "#00a884",
  },
  {
    name: "Full VAT",
    value: -188000,
    color: "#062f2a",
  },
  {
    name: "Recoverable VAT",
    value: -183000,
    color: "#27ecc1",
  },
];

/* -------------------- LABEL RENDERER FOR PIE -------------------- */

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
  value,
}) => {
  if (value < 0.5) return null; // hide 0% visually

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#062f2a"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={13}
      fontWeight={500}
    >
      {name} {Math.round(percent * 100)}%
    </text>
  );
};

/* -------------------- COMPONENT -------------------- */

export default function Graph() {
  return (
    <div className="w-full px-1 md:px-6 py-4 md:py-8">
      <h2 className="mb-6 text-2xl font-semibold">Analyse graphique</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* -------------------- PIE / DONUT -------------------- */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold">Répartition des coûts</h3>

          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={115}
                  paddingAngle={2}
                  labelLine={true}
                  label={renderCustomLabel}
                >
                  {costData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
            {costData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* -------------------- BAR CHART -------------------- */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold">Margin VAT</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={marginData}
              layout="vertical"
              margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
              barCategoryGap={40}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} />

              <XAxis
                type="number"
                domain={[-200000, -180000]}
                tickFormatter={(v) => `${Math.round(v / 1000)} k`}
              />

              
              <YAxis type="category" dataKey="name" hide />

              <Tooltip
                formatter={(value) => `${Number(value).toLocaleString()} €`}
              />

              <Bar
                dataKey="value"
                barSize={48}
                radius={[12, 12, 12, 12]}
              >
                {marginData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

       
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#062f2a]" />
              Full VAT
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#00a884]" />
              VATON Margin
            </div>
             <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#27ecc1]" />
              Recoverable VAT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
