<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        return response()->json($user->load('profile'));
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'avatar' => 'sometimes|string',
            'theme_color' => 'sometimes|string|max:7',
            'bio' => 'sometimes|nullable|string|max:500',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
            $user->save();
        }

        $profileData = $request->only(['avatar', 'theme_color', 'bio']);
        if (!empty($profileData)) {
            $user->profile()->updateOrCreate(['user_id' => $user->id], $profileData);
        }

        return response()->json($user->load('profile'));
    }
}