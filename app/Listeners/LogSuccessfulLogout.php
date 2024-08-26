<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Log;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogSuccessfulLogout
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    public function handle(Logout $event)
    {
        $user = $event->user;

        Log::channel('info')->info('User logged out: ', [
            'userid' => $user->id, 
            'email' => $user->email,
            'ip_address' => request()->ip(),
        ]);
    }
}
