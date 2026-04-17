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
        Schema::create('cursos', function (Blueprint $table) {
            $table->id();
            $table->enum('tipus', allowed:['GM', 'GS']);
            $table->string('nom');
            $table->foreignId('id_tutor')->nullable()->constrained('usuaris')->nullOnDelete();
            $table->foreignId('id_periode')->nullable()->constrained('periodes')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cursos');
    }
};
