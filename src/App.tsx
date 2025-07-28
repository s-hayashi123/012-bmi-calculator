import { useMemo, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

function App() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // TODO: useMemoを使ってBMIを計算するロジックを実装
  const bmiResult = useMemo(() => {
    if (!height || !weight) return null;

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (heightInMeters <= 0 || weightInKg <= 0) return null;

    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return bmi;
  }, [height, weight]);

  const bmiCategory = useMemo(() => {
    if (bmiResult === null) return "";

    if (bmiResult < 18.5) {
      return "痩せすぎ";
    } else if (bmiResult <= 24.9) {
      return "普通体重";
    } else if (bmiResult <= 29.9) {
      return "肥満（1度）";
    } else {
      return "太り過ぎ";
    }
  }, [bmiResult]);

  const handleReset = () => {
    setHeight("");
    setWeight("");
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">BMI Calculator</h1>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          type="text"
          placeholder="身長を入力してください。"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          type="text"
          placeholder="体重を入力してください。"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      <div className="mt-8 text-center">
        {bmiResult !== null && (
          <>
            <p className="text-xl">あなたのBMIは...</p>
            <p className="text-5xl font-bold">{bmiResult.toFixed(1)}</p>
            <p className="mt-2 text-2xl">{bmiCategory}</p>
            <Button onClick={handleReset} className="mt-4 cursor-pointer">
              リセット
            </Button>
          </>
        )}
      </div>
    </main>
  );
}

export default App;
