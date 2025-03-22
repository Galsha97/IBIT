import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gauge } from "lucide-react";
import { useState, useEffect } from "react";

export default function IBITDashboard() {
  const [score, setScore] = useState(0);

  const getStatus = (score) => {
    if (score >= 5) return "מצוין - כניסה מומלצת";
    if (score >= 3) return "טוב - כדאי לשקול כניסה";
    if (score >= 1) return "ניטרלי - המתן לאות חזק יותר";
    return "חלש - עדיף להמתין";
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://sheets-as-json.akbar.dev/api/sheets/1dAeabL6x1uGpU0tb-DqVeJtUOIjzK5eT_qSUGW12mwM/Input");
        const data = await response.json();

        const row = data[0];
        let newScore = 0;
        if (parseFloat(row.priceDropPercent) >= 3) newScore += 2;
        if (row.ivHigh.toLowerCase() === "true") newScore += 2;
        if (parseInt(row.daysToExpiry) <= 2) newScore += 1;

        setScore(newScore);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 p-4 max-w-xl mx-auto">
      <Card>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <Gauge className="w-12 h-12 mb-2" />
          <h2 className="text-xl font-semibold mb-2">ציון כניסה לפוזיציית פוט על IBIT</h2>
          <div className="text-5xl font-bold mb-2">{score}/5</div>
          <div className="text-muted-foreground mb-4">{getStatus(score)}</div>
          <Progress value={(score / 5) * 100} className="w-full mb-4" />
          <Button variant="outline" onClick={() => window.location.reload()}>רענן נתונים</Button>
        </CardContent>
      </Card>
    </div>
  );
}
