import React, { useState } from 'react';
import { DollarSign, CreditCard, Coins } from 'lucide-react';

function App() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [result, setResult] = useState<{ message: string; color: string } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const colors = ['red', 'black', 'green'];
  const multipliers = {
    red: 2,
    black: 2,
    green: 14
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-500';
      case 'black': return 'text-gray-900 bg-gray-200 px-2 rounded';
      case 'green': return 'text-green-500';
      case 'yellow': return 'text-yellow-500';
      default: return '';
    }
  };

  const placeBet = () => {
    if (betAmount <= 0) {
      setResult({ message: 'Please enter a valid bet amount', color: 'yellow' });
      return;
    }
    if (betAmount > balance) {
      setResult({ message: 'Insufficient balance', color: 'yellow' });
      return;
    }
    if (!selectedColor) {
      setResult({ message: 'Please select a color', color: 'yellow' });
      return;
    }

    setIsSpinning(true);
    setResult(null);

    setTimeout(() => {
      const winningColor = colors[Math.floor(Math.random() * colors.length)];
      const won = winningColor === selectedColor;
      const winAmount = won ? betAmount * multipliers[selectedColor as keyof typeof multipliers] : 0;
      
      setBalance(prev => won ? prev + (winAmount - betAmount) : prev - betAmount);
      
      const resultMessage = won 
        ? `You won $${winAmount - betAmount}!`
        : `You lost $${betAmount}!`;
        
      setResult({
        message: `${resultMessage} (${winningColor.toUpperCase()})`,
        color: winningColor
      });
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Coins className="h-8 w-8 text-yellow-500" />
                Color Bet
              </h1>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{balance}</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Bet Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                    placeholder="Enter bet amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Color</label>
                <div className="flex gap-4">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        w-full py-2 rounded-lg font-medium transition-all
                        ${color === 'red' ? 'bg-red-600 hover:bg-red-700' : ''}
                        ${color === 'black' ? 'bg-gray-900 hover:bg-gray-950' : ''}
                        ${color === 'green' ? 'bg-green-600 hover:bg-green-700' : ''}
                        ${selectedColor === color ? 'ring-2 ring-blue-500 transform scale-105' : ''}
                      `}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={placeBet}
                disabled={isSpinning}
                className={`
                  w-full py-3 rounded-lg font-bold text-lg transition-all
                  ${isSpinning 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'}
                `}
              >
                {isSpinning ? 'Spinning...' : 'Place Bet'}
              </button>

              {result && (
                <div className={`text-center font-medium text-lg ${getColorClass(result.color)}`}>
                  {result.message}
                </div>
              )}

              <div className="mt-4 text-sm text-gray-400">
                <div className="font-medium mb-2">Multipliers:</div>
                <ul className="list-disc list-inside">
                  <li>Red/Black: 2x</li>
                  <li>Green: 14x</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;