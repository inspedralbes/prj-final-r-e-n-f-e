<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuaris', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('cognom')->nullable();
            $table->enum('rol', allowed:['Admin', 'Profe', 'Alumne'])->default('Alumne');
            $table->string('email')->unique();
            $table->string('email_pares')->nullable();
            $table->string('password')->nullable();
            $table->string('token')->nullable();
            $table->string('nfc_id')->nullable();
            // Removed constrained() to avoid circular dependency. Added in later migration.
            $table->foreignId('id_curs')->nullable()->nullOnDelete();
            $table->string('horari_guardies')->nullable();
            // $table->rememberToken();
            $table->timestamps();
        });

        // Schema::create('password_reset_tokens', function (Blueprint $table) {
        //     $table->string('email')->primary();
        //     $table->string('token');
        //     $table->timestamp('created_at')->nullable();
        // });

        // Schema::create('sessions', function (Blueprint $table) {
        //     $table->string('id')->primary();
        //     $table->foreignId('user_id')->nullable()->index();
        //     $table->string('ip_address', 45)->nullable();
        //     $table->text('user_agent')->nullable();
        //     $table->longText('payload');
        //     $table->integer('last_activity')->index();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS usuaris CASCADE');
        // DB::statement('DROP TABLE IF EXISTS password_reset_tokens CASCADE');
        // DB::statement('DROP TABLE IF EXISTS sessions CASCADE');
    }
};
