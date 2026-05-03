<?php

namespace App\Mail;

use GuzzleHttp\Psr7\Request;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeMessage extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $name;
    public $rol;
    public $appName;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $rol)
    {
        $this->name = $name;
        $this->rol = $rol;
        $this->appName = config('app.name');
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Benvingut a ' . $this->appName . ', ' . $this->name . '!')
            ->view('emails.welcome-message');
    }
}
