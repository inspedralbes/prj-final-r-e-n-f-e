<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('horaris', function (Blueprint $table) {
            $table->foreignId('id_professor')->nullable()->constrained('usuaris')->nullOnDelete();
        });

        Schema::table('inscrits', function (Blueprint $table) {
            $table->foreignId('id_horari')->nullable()->constrained('horaris')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inscrits', function (Blueprint $table) {
            $table->dropForeign(['id_horari']);
            $table->dropColumn('id_horari');
        });

        Schema::table('horaris', function (Blueprint $table) {
            $table->dropForeign(['id_professor']);
            $table->dropColumn('id_professor');
        });
    }
};
