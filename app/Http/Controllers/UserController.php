<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rules\Password;


class UserController extends Controller
{
    public function storeNewUser(Request $request)
    {
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'Email already in use!'], 409);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|in:user,admin',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        event(new Registered($user));

        Log::channel('info')->info('New user registered', [
            'admin_userid' => Auth::user() ? Auth::user()->id : 'N/A',
            'admin_email' => Auth::user() ? Auth::user()->email : 'N/A',
            'admin_ipaddress' => $request->ip(),
            'newuser_userid' => $user->id,
            'newuser_email' => $user->email,
            'newuser_role' => $user->role,
        ]);

        return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
    }

    public function getAllUsers()
    {
        $users = User::orderBy('id', 'desc')->get();

        return response()->json($users);
    }

    public function destroyUserById($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Check if the user ID is 1 and return an error if true
        if ($user->id == 1) {
            return response()->json(['message' => 'Cannot delete this user'], 403);
        }

        // Store the user information before deletion for logging
        $userId = $user->id;
        $userEmail = $user->email;
        $userRole = $user->role;

        $user->delete();

        Log::channel('info')->info('User deleted', [
            'admin_userid' => Auth::user() ? Auth::user()->id : 'N/A',
            'admin_email' => Auth::user() ? Auth::user()->email : 'N/A',
            'admin_ipaddress' => request()->ip(),
            'deleted_user_userid' => $userId,
            'deleted_user_email' => $userEmail,
            'deleted_user_role' => $userRole,
        ]);

        return response()->json(['message' => 'User deleted successfully'], 200);
    }

    public function updatePassword(Request $request, int $userId): JsonResponse
    {
        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::findOrFail($userId);

        // Check if the user ID is 1 and return an error if true
        if ($user->id == 1) {
            return response()->json(['message' => 'Cannot delete this user'], 403);
        }

        $userEmail = $user->email;
        $userRole = $user->role;

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        Log::channel('info')->info('User password updated', [
            'admin_userid' => Auth::user() ? Auth::user()->id : 'N/A',
            'admin_email' => Auth::user() ? Auth::user()->email : 'N/A',
            'admin_ipaddress' => $request->ip(),
            'updated_user_userid' => $userId,
            'updated_user_email' => $userEmail,
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string|in:admin,user',
        ]);

        $user = User::findOrFail($id);

        // Check if the user ID is 1 and return an error if true
        if ($user->id == 1) {
            return response()->json(['message' => 'Cannot delete this user'], 403);
        }

        // Store user information before updating role for logging
        $oldRole = $user->role;
        $userEmail = $user->email;

        $user->role = $request->role;
        $user->save();

        Log::channel('info')->info('User role updated', [
            'admin_userid' => Auth::user() ? Auth::user()->id : 'N/A',
            'admin_email' => Auth::user() ? Auth::user()->email : 'N/A',
            'admin_ip_address' => $request->ip(),
            'updated_user_userid' => $id,
            'updated_user_email' => $userEmail,
            'old_user_role' => $oldRole,
            'new_user_role' => $request->role,
        ]);

        return response()->json(['message' => 'User role updated successfully']);
    }
}
