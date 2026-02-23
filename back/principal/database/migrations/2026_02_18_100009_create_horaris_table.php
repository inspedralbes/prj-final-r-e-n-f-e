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
        Schema::create('horaris', function (Blueprint $table) {
            $table->id();
            $table->string('codi_hora')->nullable();
            $table->foreignId('id_assig')->constrained('assignatures')->cascadeOnDelete();
            $table->foreignId('id_classe')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('id_aula')->nullable()->constrained('aules')->nullOnDelete();
            // L1-12 slots? Not clear from diagram if they are columns, but arrows suggest values or separate entity.
            // Following previous logic: 'codi_hora' is the string like "L1".
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('horaris');
    }
};
