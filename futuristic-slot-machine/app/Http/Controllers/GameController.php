<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\GameSession;
use Illuminate\Support\Facades\Auth;

class GameController extends Controller
{
    public function spin(Request $request)
    {
        $request->validate([
            'betAmount' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        
        if ($user->balance < $request->betAmount) {
            return response()->json(['error' => 'Insufficient balance'], 400);
        }

        // Deduct bet amount
        $user->balance -= $request->betAmount;
        $user->save();

        // Generate random symbols for each reel
        $symbols = ['cherry', 'lemon', 'orange', 'plum', 'bell', 'bar', 'seven'];
        $reels = [
            array_rand(array_flip($symbols)),
            array_rand(array_flip($symbols)),
            array_rand(array_flip($symbols)),
        ];

        // Calculate win
        $winAmount = $this->calculateWin($reels, $request->betAmount);

        // Add win amount to balance
        $user->balance += $winAmount;
        $user->save();

        // Save game session
        $gameSession = GameSession::create([
            'user_id' => $user->id,
            'bet_amount' => $request->betAmount,
            'win_amount' => $winAmount,
            'reel_results' => $reels,
        ]);

        return response()->json([
            'reels' => $reels,
            'winAmount' => $winAmount,
            'balance' => $user->balance,
        ]);
    }

    private function calculateWin($reels, $betAmount)
    {
        // Check for three of a kind
        if ($reels[0] === $reels[1] && $reels[1] === $reels[2]) {
            $multipliers = [
                'cherry' => 3,
                'lemon' => 4,
                'orange' => 5,
                'plum' => 6,
                'bell' => 8,
                'bar' => 10,
                'seven' => 20,
            ];
            
            return $betAmount * $multipliers[$reels[0]];
        }

        // Check for two of a kind (first two reels)
        if ($reels[0] === $reels[1]) {
            $multipliers = [
                'cherry' => 2,
                'lemon' => 2,
                'orange' => 3,
                'plum' => 3,
                'bell' => 5,
                'bar' => 7,
                'seven' => 10,
            ];
            
            return $betAmount * $multipliers[$reels[0]];
        }

        return 0;
    }

    public function history(Request $request)
    {
        $user = Auth::user();
        $history = GameSession::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json($history);
    }
}