<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Log;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogSuccessfulLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    public function handle(Login $event)
    {
        $user = $event->user;
        
        Log::channel('info')->info('User logged in: ', [
            'userid' => $user->id, 
            'email' => $user->email,
            'ip_address' => request()->ip(),
        ]);
    }
}
