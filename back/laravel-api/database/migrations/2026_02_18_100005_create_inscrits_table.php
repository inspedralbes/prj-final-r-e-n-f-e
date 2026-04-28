<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inscrits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_alumne')->constrained('usuaris')->cascadeOnDelete();
            $table->foreignId('id_assignatura')->constrained('assignatures')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscrits');
    }
};
