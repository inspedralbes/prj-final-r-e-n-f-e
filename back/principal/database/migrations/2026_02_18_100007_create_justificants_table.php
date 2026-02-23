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
        Schema::create('justificants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_alum')->constrained('usuaris')->cascadeOnDelete();
            $table->foreignId('id_assistencia_ini')->nullable()->constrained('assistencies');
            $table->foreignId('id_assistencia_fi')->nullable()->constrained('assistencies');
            $table->text('comentari')->nullable();
            $table->string('document')->nullable();
            $table->boolean('acceptada')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('justificants');
    }
};
