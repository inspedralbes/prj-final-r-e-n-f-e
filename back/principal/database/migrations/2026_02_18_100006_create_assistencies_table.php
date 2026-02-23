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
        Schema::create('assistencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_inscripcio')->constrained('inscrits')->cascadeOnDelete();
            $table->date('data');
            $table->enum('estat', ['Assistit', 'Falta', 'Retart'])->nullable();
            $table->foreignId('id_profe')->nullable()->constrained('usuaris');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assistencies');
    }
};
